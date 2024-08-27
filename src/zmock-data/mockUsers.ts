/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { faker } from "@faker-js/faker";
import { MOCK_AVATAR_DIR, SEED } from "@src/constant/dir";
import { UserRole, UserStatus } from "@src/enums/user.enum";
import UserModel from "@src/schema/user.schema";
import authService from "@src/services/auth.service";
import { randomDate, sanitizeUsername } from "@src/zmock-data/helper";
import fs from "fs";

export const mockUsers = async (userCount: number) => {
  console.log(`start creating ${userCount} users`);
  faker.seed(SEED);
  const data = fs.readFileSync(MOCK_AVATAR_DIR, "utf-8");
  const jsonObject = JSON.parse(data);
  const mockAvatars: Array<string> = jsonObject?.avatars;
  for (let i = 0; i < userCount; i++) {
    const isMale = faker.datatype.boolean();
    const date = randomDate(new Date("2023-01-01"));
    const avatar = mockAvatars[i % mockAvatars.length];

    await new UserModel({
      //sanitizing the username to avoid any special characters, ensure that friendly for the URL
      username: sanitizeUsername(faker.internet.userName() + i), // + i to ensure unique usernames
      first_name: faker.person.firstName(isMale ? "male" : "female"),
      last_name: faker.person.lastName(isMale ? "male" : "female"),
      password: await authService.hashPassword("123456"),
      bio: faker.lorem.sentence(),
      avatar: avatar,
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
      created_at: date,
      updated_at: date,
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
  const updatedUsers = await UserModel.find();

  console.log(`start check if friendships were mocked correctly`);
  // Check if friendships were mocked correctly
  for (const user of updatedUsers) {
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
  console.log(`finished mockin ${userCount} users`);
};
