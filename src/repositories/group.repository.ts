import { GroupRole, GroupStatus } from "@src/enums/group.enums";
import GroupModel, { IGroup } from "@src/schema/group.schema";
import UserModel from "@src/schema/user.schema";
import { GroupMemberDetailType } from "@src/types/group.types";
import { GroupDetailType } from "@src/types/user.types";
import { ProjectionType, QueryOptions, Types } from "mongoose";

class GroupRepository {
  public async createGroup(group: Partial<IGroup>) {
    return await GroupModel.create(group);
  }

  public async updateGroupById(groupId: string, payload: Partial<IGroup>) {
    return await GroupModel.findByIdAndUpdate<IGroup>(groupId, payload, {
      new: true,
    });
  }

  public async findGroupById(
    groupId: string | Types.ObjectId,
    projection: ProjectionType<IGroup> = {}
  ) {
    return await GroupModel.findById(groupId, projection).lean();
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

  public async getUserGroups(
    userId: string,
    afterId?: string,
    limit?: number,
    groupRole?: GroupRole,
    status?: GroupStatus
  ) {
    let query: QueryOptions<IGroup> = {
      members: new Types.ObjectId(userId),
      status: GroupStatus.APPROVED,
    };

    if (groupRole === GroupRole.ADMIN) {
      query = {
        admin: new Types.ObjectId(userId),
        status: status || GroupStatus.APPROVED,
      };
    }

    console.log(query);

    const groups = await GroupModel.aggregate<GroupDetailType>([
      { $match: query },
      { $sort: { _id: 1 } },
      {
        $match: {
          _id: {
            $gt: afterId
              ? new Types.ObjectId(afterId)
              : // if afterId is not provided, set it to a dummy ObjectId
                new Types.ObjectId("000000000000000000000000"),
          },
        },
      },
      { $limit: limit || 10 },
      {
        $project: {
          _id: 1,
          name: 1,
          visibilityLevel: 1,
          status: 1,
          memberCount: { $size: "$members" },
        },
      },
    ]);

    return groups;
  }

  public async getGroupMembers(
    groupId: string,
    limit?: number,
    afterId?: string
  ) {
    return await GroupModel.aggregate<GroupMemberDetailType>([
      { $match: { _id: new Types.ObjectId(groupId) } },
      { $unwind: { path: "$members", includeArrayIndex: "index" } },
      {
        $match: {
          // exclude admin from the list, admin always has index 0
          index: {
            $ne: 0,
          },
        },
      },
      { $sort: { members: 1 } },
      {
        $match: {
          members: {
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
          localField: "members",
          foreignField: "_id",
          as: "memberDetails",
        },
      },
      { $unwind: "$memberDetails" },
      {
        $project: {
          _id: "$memberDetails._id",
          firstName: "$memberDetails.firstName",
          lastName: "$memberDetails.lastName",
          avatar: "$memberDetails.avatar",
          username: "$memberDetails.username",
          friends: "$memberDetails.friends",
          groupRole: 1,
        },
      },
    ]);
  }
}

export default new GroupRepository();
