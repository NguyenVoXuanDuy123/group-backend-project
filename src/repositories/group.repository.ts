import { GroupStatus } from "@src/enums/group.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import GroupModel, { IGroup } from "@src/schema/group.schema";
import UserModel from "@src/schema/user.schema";
import { GroupMemberDetailType } from "@src/types/group.types";
import { ProjectionType, Types } from "mongoose";

class GroupRepository {
  public async createGroup(group: Partial<IGroup>) {
    return await GroupModel.create(group);
  }

  public async updateGroupById(_id: string, payload: Partial<IGroup>) {
    return await GroupModel.findByIdAndUpdate<IGroup>(_id, payload, {
      new: true,
    });
  }

  public async findGroupById(
    _id: string | Types.ObjectId,
    projection: ProjectionType<IGroup> = {}
  ) {
    return await GroupModel.findById(_id, projection).lean();
  }

  public async addMemberToGroup(
    groupId: string | Types.ObjectId,
    userId: string | Types.ObjectId
  ) {
    await GroupModel.findByIdAndUpdate(groupId, { $push: { members: userId } });
    await UserModel.findByIdAndUpdate(userId, { $push: { groups: groupId } });
  }

  public async removeMemberFromGroup(groupId: string, userId: string) {
    await GroupModel.findByIdAndUpdate(groupId, { $pull: { members: userId } });
    await UserModel.findByIdAndUpdate(userId, { $pull: { groups: groupId } });
  }

  public async getGroupMembers(_id: string) {
    return await GroupModel.aggregate<GroupMemberDetailType>([
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
        // if member is admin then groupRole is admin else member
        $addFields: {
          groupRole: {
            $cond: {
              if: { $eq: ["$memberDetails._id", "$admin"] },
              then: "admin",
              else: "member",
            },
          },
        },
      },
      {
        $project: {
          _id: "$memberDetails._id",
          first_name: "$memberDetails.first_name",
          last_name: "$memberDetails.last_name",
          avatar: "$memberDetails.avatar",
          username: "$memberDetails.username",
          groupRole: 1,
        },
      },
    ]);
  }

  public async checkIfGroupIsApproved(groupId: string) {
    const group = await GroupModel.findById(groupId, { status: 1 });
    if (!group) throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    return group.status === GroupStatus.APPROVED;
  }
}

export default new GroupRepository();
