import GroupModel from "@src/schema/group.schema";
import UserModel, { IUser } from "@src/schema/user.schema";
import { FriendDetailType } from "@src/types/user.types";

import { FilterQuery, ProjectionType, Types } from "mongoose";

class UserRepository {
  //find a user by their id
  public async findById(_id: string, projection: ProjectionType<IUser> = {}) {
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

  //create a new user
  public async createUser(user: IUser) {
    await this.create(user);
  }

  //update a user by their id
  public async updateUserById(_id: string, payload: Partial<IUser>) {
    const user = await this.updateOne({ _id }, payload);
    return user;
  }

  public async addFriend(userId: string, friendId: string) {
    await UserModel.findByIdAndUpdate(userId, { $push: { friends: friendId } });
    await UserModel.findByIdAndUpdate(friendId, { $push: { friends: userId } });
  }

  public async removeFriend(userId: string, friendId: string) {
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
          _id: 0,
          "friendDetails._id": 1,
          "friendDetails.last_name": 1,
          "friendDetails.first_name": 1,
          "friendDetails.username": 1,
          "friendDetails.avatar": 1,
        },
      },
    ]);
    return friendDetails;
  }

  public async getGroups(_id: string) {
    const groups = await UserModel.aggregate([
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
          _id: 0,
          "groupDetails._id": 1,
          "groupDetails.name": 1,
          "groupDetails.description": 1,
          "groupDetails.avatar": 1,
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
  private async findUser(
    query: FilterQuery<IUser>,
    projection: ProjectionType<IUser>
  ) {
    return await UserModel.findOne(query, projection).lean();
  }

  //create a new user
  private async create(user: IUser) {
    (await UserModel.create(user)).save();
  }

  private async updateOne(query: FilterQuery<IUser>, update: Partial<IUser>) {
    return await UserModel.updateOne(query, update);
  }
}

export default new UserRepository();
