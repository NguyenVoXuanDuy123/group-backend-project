import { UserRole } from "@src/enums/user.enums";
import newsfeedRepository from "@src/repositories/newsfeed.repository";
import UserModel, { User } from "@src/schema/user.schema";
import { UserInformationType } from "@src/types/user.types";

import { ProjectionType, Types } from "mongoose";

class UserRepository {
  public async getUserById(
    id: string | Types.ObjectId,
    projection: ProjectionType<User> = {}
  ) {
    return await UserModel.findById(id, projection).lean();
  }

  public async checkUserExistsById(id: string) {
    return !!(await this.getUserById(id, { _id: 1 }));
  }

  public async checkUserExistsByUsername(username: string) {
    return !!(await this.findByUsername(username, { _id: 1 }));
  }
  public async findByUsername(username: string, projection = {}) {
    return await UserModel.findOne({ username }, projection).lean();
  }

  public async createUser(user: Partial<User>) {
    await UserModel.create(user);
  }

  public async updateUserById(id: string, user: Partial<User>) {
    await UserModel.findByIdAndUpdate<User>(id, { $set: user });
  }

  public async addFriend(
    userId: string | Types.ObjectId,
    friendId: string | Types.ObjectId
  ) {
    await UserModel.findByIdAndUpdate(userId, { $push: { friends: friendId } });
    await UserModel.findByIdAndUpdate(friendId, { $push: { friends: userId } });
  }

  public async removeFriend(
    userId: string | Types.ObjectId,
    friendId: string | Types.ObjectId
  ) {
    await UserModel.findByIdAndUpdate(userId, { $pull: { friends: friendId } });
    await UserModel.findByIdAndUpdate(friendId, { $pull: { friends: userId } });

    // Remove newsfeed of the user and friend for each other
    await newsfeedRepository.removeNewsfeedByOwnerIdAndAuthorId(
      userId,
      friendId
    );
    await newsfeedRepository.removeNewsfeedByOwnerIdAndAuthorId(
      friendId,
      userId
    );
  }

  public async getFriends(userId: string, afterId?: string, limit?: number) {
    const friendDetails = await UserModel.aggregate<UserInformationType>([
      { $match: { _id: new Types.ObjectId(userId) } },
      { $unwind: "$friends" },
      { $sort: { friends: 1 } },
      {
        $match: {
          friends: {
            $gt: afterId
              ? new Types.ObjectId(afterId)
              : // if afterId is not provided, set it to a dummy ObjectId
                new Types.ObjectId("000000000000000000000000"),
          },
        },
      },
      { $limit: limit || 10 },
      {
        $lookup: {
          from: "users",
          localField: "friends",
          foreignField: "_id",
          as: "friendDetails",
        },
      },

      { $unwind: "$friendDetails" },
      {
        $project: {
          _id: "$friendDetails._id",
          username: "$friendDetails.username",
          firstName: "$friendDetails.firstName",
          lastName: "$friendDetails.lastName",
          avatar: "$friendDetails.avatar",
          friends: "$friendDetails.friends",
        },
      },
    ]);

    return friendDetails;
  }

  public async searchUsers(q: string, afterId?: string, limit?: number) {
    const users = await UserModel.aggregate<UserInformationType>([
      {
        $addFields: {
          fullName: {
            $concat: ["$firstName", " ", "$lastName"],
          },
        },
      },
      {
        $match: {
          fullName: {
            $regex: q,
            $options: "i",
          },
          role: UserRole.USER,
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
      {
        $match: {
          _id: {
            $gt: afterId
              ? new Types.ObjectId(afterId)
              : new Types.ObjectId("000000000000000000000000"),
          },
        },
      },
      {
        $limit: limit || 10,
      },
      {
        $project: {
          _id: 1,
          username: 1,
          firstName: 1,
          lastName: 1,
          avatar: 1,
          friends: 1,
          friendCount: { $size: "$friends" },
          status: 1,
          createdAt: 1,
        },
      },
    ]);

    return users;
  }
}

export default new UserRepository();
