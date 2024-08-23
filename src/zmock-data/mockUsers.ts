import { faker } from "@faker-js/faker";
import { UserRole, UserStatus } from "@src/enums/user.enum";
import UserModel from "@src/schema/user.schema";
import authService from "@src/services/auth.service";
import { randomDate, sanitizeUsername } from "@src/zmock-data/helper";

export const mockUsers = async (userCount: number) => {
  const users = [];
  const isMale = faker.datatype.boolean();

  for (let i = 0; i < userCount; i++) {
    const date = randomDate(new Date("2023-01-01"));
    users.push(
      new UserModel({
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
      })
    );
  }

  //Mock friendships between users
  for (const user of users) {
    // Randomly pick a number of friends for each user
    const friendNumber = faker.number.int({ min: 20, max: 50 });

    // pick random friends but not the user itself
    const friends = faker.helpers.arrayElements(
      users.filter((u) => u._id !== user._id),
      friendNumber
    );

    // Add the friends to the user's friends list
    user.friends = friends.map((friend) => friend._id);
    for (const friend of friends) {
      //If the friend is not already in the user's friends list, add the user to the friend's friends list
      if (!friend.friends.includes(user._id)) {
        friend.friends.push(user._id);
      }
    }
  }

  for (const user of users) {
    await user.save();
  }

  //return await UserModel.insertMany(users);
};
