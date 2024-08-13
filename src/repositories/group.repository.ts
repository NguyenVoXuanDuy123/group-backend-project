import GroupModel, { IGroup } from "@src/schema/group.schema";
import UserModel from "@src/schema/user.schema";
import { Types } from "mongoose";

class GroupRepository {
  async createGroup(group: IGroup) {
    return await GroupModel.create(group);
  }

  async updateGroupById(_id: string, payload: Partial<IGroup>) {
    return await GroupModel.findByIdAndUpdate(_id, payload, { new: true });
  }

  async getGroupById(_id: string) {
    return await GroupModel.findById(_id, { __v: 0 }).lean();
  }

  async addMemberToGroup(groupId: string, userId: string) {
    await GroupModel.findByIdAndUpdate(groupId, { $push: { members: userId } });
    await UserModel.findByIdAndUpdate(userId, { $push: { groups: groupId } });
  }

  async removeMemberFromGroup(groupId: string, userId: string) {
    await GroupModel.findByIdAndUpdate(groupId, { $pull: { members: userId } });
    await UserModel.findByIdAndUpdate(userId, { $pull: { groups: groupId } });
  }

  async getGroupMembers(_id: string) {
    return await GroupModel.aggregate([
      { $match: { _id: new Types.ObjectId(_id) } },
      { $unwind: "$members" },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      { $unwind: "$memberDetails" },
      {
        $project: {
          _id: "$memberDetails._id",
          first_name: "$memberDetails.first_name",
          last_name: "$memberDetails.last_name",
          avatar: "$memberDetails.avatar",
          username: "$memberDetails.username",
        },
      },
    ]);
  }
}

export default new GroupRepository();
