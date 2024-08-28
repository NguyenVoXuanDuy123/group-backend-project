import UserModel, { IUser } from "@src/schema/user.schema";
import { FriendDetailType } from "@src/types/user.types";

import { ProjectionType, Types } from "mongoose";

class UserRepository {
  public async getUserById(
    _id: string | Types.ObjectId,
    projection: ProjectionType<IUser> = {}
  ) {
    return await UserModel.findById(_id, projection).lean();
  }

  public async checkUserExistsById(_id: string) {
    return !!(await this.getUserById(_id, { _id: 1 }));
  }

  public async checkUserExistsByUsername(username: string) {
    return !!(await this.findByUsername(username, { _id: 1 }));
  }
  public async findByUsername(username: string, projection = {}) {
    return await UserModel.findOne({ username }, projection).lean();
  }

  public async createUser(user: Partial<IUser>) {
    await UserModel.create(user);
  }

  public async updateUserById(_id: string, user: Partial<IUser>) {
    await UserModel.findByIdAndUpdate<IUser>(_id, { $set: user });
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
  }

  public async getFriends(userId: string, afterId?: string, limit?: number) {
    const friendDetails = await UserModel.aggregate<FriendDetailType>([
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
          first_name: "$friendDetails.first_name",
          last_name: "$friendDetails.last_name",
          avatar: "$friendDetails.avatar",
          friends: "$friendDetails.friends",
        },
      },
    ]);

    return friendDetails;
  }
}

export default new UserRepository();
