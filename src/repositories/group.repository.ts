import { GroupRole, GroupStatus } from "@src/enums/group.enums";
import { validateDate } from "@src/helpers/validation";
import newsfeedRepository from "@src/repositories/newsfeed.repository";
import GroupModel, { Group } from "@src/schema/group.schema";
import UserModel from "@src/schema/user.schema";
import { GroupMemberDetailType } from "@src/types/group.types";
import { GroupDetailType } from "@src/types/user.types";
import { ProjectionType, QueryOptions, Types } from "mongoose";

class GroupRepository {
  public async createGroup(group: Partial<Group>) {
    return await GroupModel.create(group);
  }

  public async updateGroupById(groupId: string, payload: Partial<Group>) {
    return await GroupModel.findByIdAndUpdate<Group>(groupId, payload, {
      new: true,
    });
  }

  public async findGroupById(
    groupId: string | Types.ObjectId,
    projection: ProjectionType<Group> = {}
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

    // Remove newsfeed of the user for the group
    await newsfeedRepository.removeNewsfeedByOwnerIdAndGroupId(userId, groupId);
  }

  public async getUserGroups(
    userId: string,
    beforeDate?: string,
    limit?: number,
    groupRole?: GroupRole,
    status?: GroupStatus
  ) {
    let query: QueryOptions<Group> = {
      members: new Types.ObjectId(userId),
      status: GroupStatus.APPROVED,
    };
    // If beforeDate is invalid, method below will throw an error
    if (beforeDate) {
      validateDate(beforeDate);
    }

    if (groupRole === GroupRole.ADMIN) {
      query = {
        admin: new Types.ObjectId(userId),
        status: status || GroupStatus.APPROVED,
      };
    }

    query = {
      ...query,
      createdAt: {
        $lt: beforeDate ? new Date(beforeDate) : new Date(),
      },
    };

    const groups = await GroupModel.aggregate<GroupDetailType>([
      { $match: query },
      {
        $sort: {
          createdAt: -1,
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
          description: 1,
          createdAt: 1,
          rejectedReason: 1,
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

  public async getPendingGroups(beforeDate?: string, limit?: number) {
    if (beforeDate) {
      validateDate(beforeDate);
    }
    return await GroupModel.aggregate<GroupDetailType>([
      {
        $match: {
          status: GroupStatus.PENDING,
          createdAt: {
            $lt: new Date(beforeDate ? beforeDate : new Date()),
          },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit || 10 },
      {
        $lookup: {
          from: "users",
          localField: "admin",
          foreignField: "_id",
          as: "admin",
        },
      },
      { $unwind: "$admin" },
      {
        $project: {
          _id: 1,
          name: 1,
          visibilityLevel: 1,
          status: 1,
          memberCount: { $size: "$members" },
          description: 1,
          createdAt: 1,
          admin: {
            _id: 1,
            username: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
          },
        },
      },
    ]);
  }
}

export default new GroupRepository();
