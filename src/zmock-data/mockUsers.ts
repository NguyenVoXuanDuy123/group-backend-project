/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from "@faker-js/faker";
import { MOCK_AVATAR_DIR, SEED } from "@src/constant/dir";
import {
  FriendRequestStatus,
  UserRole,
  UserStatus,
} from "@src/enums/user.enum";
import FriendRequestModel from "@src/schema/friendRequest.schema";
import UserModel from "@src/schema/user.schema";
import authService from "@src/services/auth.service";
import { maxDate, randomDate, sanitizeUsername } from "@src/zmock-data/helper";
import fs from "fs";

export const mockUsers = async (userCount: number) => {
  console.log(`start creating ${userCount} users`);
  faker.seed(SEED + 1);
  const data = fs.readFileSync(MOCK_AVATAR_DIR, "utf-8");
  const jsonObject = JSON.parse(data);
  const mockAvatars: Array<string> = jsonObject?.avatars;
  for (let i = 0; i < userCount; i++) {
    const isMale = faker.datatype.boolean();
    const date = randomDate(new Date("2023-01-01"));
    const avatar = mockAvatars[i % mockAvatars.length];
    const firstName = faker.person.firstName(isMale ? "male" : "female");
    const lastName = faker.person.lastName(isMale ? "male" : "female");
    await new UserModel({
      _id: faker.database.mongodbObjectId(),
      //sanitizing the username to avoid any special characters, ensure that friendly for the URL
      username: sanitizeUsername(
        faker.internet.userName({
          firstName,
          lastName,
        }) + i // + i to ensure unique usernames
      ),
      firstName: firstName,
      lastName: lastName,
      password: await authService.hashPassword("123456"),
      bio: faker.lorem.sentence(),
      avatar: avatar,
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
      createdAt: date,
      updatedAt: date,
    }).save();
  }

  // Fetch all users to create friendships
  const users = await UserModel.find();

  // Mock friendships between users
  console.log(`start creating friendships`);
  for (const user of users) {
    const friendNumber = faker.number.int({ min: 20, max: 50 });
    const friends = faker.helpers.arrayElements(
      // Exclude the user itself from the list of friends
      users.filter((u) => !u._id.equals(user._id)),
      friendNumber
    );

    for (const friend of friends) {
      //use addToSet to avoid duplicate friends
      await UserModel.updateOne(
        { _id: friend._id },
        { $addToSet: { friends: user._id } }
      );

      await UserModel.updateOne(
        { _id: user._id },
        { $addToSet: { friends: friend._id } }
      );
    }
  }

  // Re-fetch all users to ensure we're working with the latest data
  const updatedUsers1 = await UserModel.find();

  console.log(`start check if friendships were mocked correctly`);
  // Check if friendships were mocked correctly
  for (const user of updatedUsers1) {
    // using literal Object to check if duplicate friends exist
    const friendSet = new Set(user.friends.map((f) => f.toString()));
    // Check if the number of friends is equal to the number of unique friends
    if (friendSet.size !== user.friends.length) {
      console.log(`duplicate friends exist for user`);
    }
    for (const friendId of user.friends) {
      const friend = await UserModel.findById(friendId);
      if (!friend) {
        continue;
      }
      if (!friend.friends.some((f) => f.equals(user._id))) {
        console.log(`something went wrong in checking friendships`);
      }
    }
  }

  console.log(`finished creating friendships`);

  //send friend requests
  // console.log(`start sending friend requests`);
  // const updatedUsers2 = await UserModel.find();
  // for (const user of updatedUsers2) {
  //   const friendRequestNumber = faker.number.int({ min: 5, max: 10 });
  //   const userToSentRequests = await UserModel.find({
  //     _id: { $nin: user.friends },
  //   });

  //   await Promise.all(
  //     userToSentRequests.slice(0, friendRequestNumber).map(async (friend) => {
  //       if (friend._id.equals(user._id)) {
  //         return;
  //       }

  //       return new FriendRequestModel({
  //         _id: faker.database.mongodbObjectId(),
  //         sender: user._id,
  //         receiver: friend._id,
  //         status: FriendRequestStatus.PENDING,
  //         createdAt: randomDate(maxDate(user.createdAt, friend.createdAt)),
  //       }).save();
  //     })
  //   );
  // }
  // console.log(`finished sending friend requests`);

  console.log(`finished mockin ${userCount} users`);
};
