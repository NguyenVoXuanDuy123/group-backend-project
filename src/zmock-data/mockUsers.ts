import { faker } from "@faker-js/faker";
import { UserRole, UserStatus } from "@src/enums/user.enum";
import UserModel from "@src/schema/user.schema";
import authService from "@src/services/auth.service";
import { randomDate, sanitizeUsername } from "@src/zmock-data/helper";

export const mockUsers = async (userCount: number) => {
  const isMale = faker.datatype.boolean();

  for (let i = 0; i < userCount; i++) {
    const date = randomDate(new Date("2023-01-01"));

    await new UserModel({
      username: sanitizeUsername(faker.internet.userName() + i), // + i to ensure unique usernames
      first_name: faker.person.firstName(isMale ? "male" : "female"),
      last_name: faker.person.lastName(isMale ? "male" : "female"),
      password: await authService.hashPassword("123456"),
      bio: faker.lorem.sentence(),
      avatar: faker.image.avatar(),
      status: UserStatus.ACTIVE,
      role: UserRole.USER,
      created_at: date,
      updated_at: date,
    }).save();
  }

  const users = await UserModel.find();

  // Mock friendships between users
  for (const user of users) {
    const friendNumber = faker.number.int({ min: 20, max: 50 });

    const friends = faker.helpers.arrayElements(
      users.filter((u) => u._id !== user._id),
      friendNumber
    );

    user.friends = friends.map((friend) => friend._id);
    await UserModel.findByIdAndUpdate(user._id, { friends: user.friends });

    for (const friend of friends) {
      const friendUser = await UserModel.findById(friend._id);
      if (friendUser && !friendUser.friends.some((f) => f.equals(user._id))) {
        await UserModel.findByIdAndUpdate(friend._id, {
          $push: { friends: user._id },
        });
      }
    }
  }

  // Re-fetch all users to ensure we're working with the latest data
  const updatedUsers = await UserModel.find();

  // Check if friendships were mocked correctly
  for (const user of updatedUsers) {
    for (const friendId of user.friends) {
      const friend = await UserModel.findById(friendId);
      if (!friend) {
        continue;
      }
      if (!friend.friends.some((f) => f.equals(user._id))) {
        console.log(
          `something went wrong 2:`
        );
      }
    }
  }
};
