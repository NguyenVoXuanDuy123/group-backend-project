import GroupModel from "@src/schema/group.schema";
import UserModel, { IUser } from "@src/schema/user.schema";
import { FriendDetailType, GroupDetailType } from "@src/types/user.types";

import { FilterQuery, ProjectionType, Types } from "mongoose";

class UserRepository {
  //find a user by their id
  public async findById(
    _id: string | Types.ObjectId,
    projection: ProjectionType<IUser> = {}
  ) {
    return await UserModel.findById(_id, projection).lean();
  }

  //check if a user exists by their id
  public async checkUserExistsById(_id: string) {
    return !!(await this.findById(_id));
  }

  //check if a user exists by their username
  public async checkUserExistsByUsername(username: string) {
    return !!(await this.findByUsername(username));
  }

  //find a user by their username
  public async findByUsername(username: string, projection = {}) {
    return await this.findUser({ username }, projection);
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

  public async leaveGroup(userId: string, groupId: string) {
    await UserModel.findByIdAndUpdate(userId, { $pull: { groups: groupId } });
    await GroupModel.findByIdAndUpdate(groupId, { $pull: { members: userId } });
  }

  //find a user by options and projection
  private findUser(
    query: FilterQuery<IUser>,
    projection: ProjectionType<IUser>
  ) {
    return UserModel.findOne(query, projection).lean();
  }
}

export default new UserRepository();
