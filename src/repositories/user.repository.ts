import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import PostModel from "@src/schema/post.schema";
import UserModel, { IUser } from "@src/schema/user.schema";
import { FriendDetailType, GroupDetailType } from "@src/types/user.types";

import { ProjectionType, Types } from "mongoose";

class UserRepository {
  //find a user by their id
  public async findById(
    _id: string | Types.ObjectId,
    projection: ProjectionType<IUser> = {}
  ) {
    return await UserModel.findById(_id, projection).lean();
  }

  public async checkUserExistsById(_id: string) {
    return !!(await this.findById(_id, { _id: 1 }));
  }

  public async checkUserExistsByUsername(username: string) {
    return !!(await this.findByUsername(username));
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

  public async getFriends(_id: string) {
    const friendDetails = await UserModel.aggregate<FriendDetailType>([
      { $match: { _id: new Types.ObjectId(_id) } },
      { $unwind: "$friends" },
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
          first_name: "$friendDetails.first_name",
          last_name: "$friendDetails.last_name",
          avatar: "$friendDetails.avatar",
          username: "$friendDetails.username",
        },
      },
    ]);
    return friendDetails;
  }

  public async getUserGroups(_id: string) {
    const groups = await UserModel.aggregate<GroupDetailType>([
      { $match: { _id: new Types.ObjectId(_id) } },
      { $unwind: "$groups" },
      {
        $lookup: {
          from: "groups",
          localField: "groups",
          foreignField: "_id",
          as: "groupDetails",
        },
      },
      { $unwind: "$groupDetails" },
      {
        $project: {
          _id: "$groupDetails._id",
          name: "$groupDetails.name",
          description: "$groupDetails.description",
          avatar: "$groupDetails.avatar",
        },
      },
    ]);
    return groups;
  }

  public getNewFeeds = async (
    userId: string,
    afterId: string,
    limit: number
  ) => {
    const user = await UserModel.findById(userId).lean();
    if (!user) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }
    const friendIds = user.friends;
    const groupIds = user.groups;

    console.log("friendIds", friendIds);
    const newFeeds = await PostModel.aggregate([
      {
        $match: {
          $or: [
            { author: { $in: friendIds } }, // Posts from friends
            { group: { $in: groupIds } }, // Posts from groups
          ],
          _id: afterId
            ? { $gt: new Types.ObjectId(afterId) }
            : { $exists: true },
        },
      },
      {
        $sort: { create_date: -1 }, // Sort by create_date descending
      },
      {
        $limit: limit, // Limit the number of posts returned
      },
      {
        $project: { _id: 1 }, // Return only the post IDs
      },
    ]);
    console.log("newFeeds", newFeeds);
    return newFeeds as unknown[];
  };
}

export default new UserRepository();
