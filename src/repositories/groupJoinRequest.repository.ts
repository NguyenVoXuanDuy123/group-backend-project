import { GroupJoinRequestStatus } from "@src/enums/group.enum";
import { IGroup } from "@src/schema/group.schema";

import GroupJoinRequestModel from "@src/schema/groupJoinRequest.schema";
import { GroupJoinRequestDetailType } from "@src/types/group.types";
import { ProjectionType, Types } from "mongoose";

class GroupJoinRequestRepository {
  public async getGroupJoinRequestById(
    requestId: string | Types.ObjectId,
    projection: ProjectionType<IGroup> = {}
  ) {
    return await GroupJoinRequestModel.findById(requestId, projection).lean();
  }
  public async createGroupJoinRequest(
    sender_id: string | Types.ObjectId,
    group_id: string | Types.ObjectId
  ) {
    return await GroupJoinRequestModel.create({ user_id: sender_id, group_id });
  }

  public async checkPendingGroupJoinRequestExists(
    sender_id: string | Types.ObjectId,
    group_id: string | Types.ObjectId
  ) {
    return !!(await this.getPendingGroupJoinRequestBySenderIdAndGroupId(
      sender_id,
      group_id
    ));
  }

  public async getPendingGroupJoinRequestBySenderIdAndGroupId(
    sender_id: string | Types.ObjectId,
    group_id: string | Types.ObjectId,
    projection: ProjectionType<IGroup> = {}
  ) {
    return await GroupJoinRequestModel.findOne(
      {
        user_id: sender_id,
        group_id,
        status: GroupJoinRequestStatus.PENDING,
      },
      projection
    ).lean();
  }

  public async changeStatusGroupJoinRequest(
    requestId: string | Types.ObjectId,
    status: GroupJoinRequestStatus
  ) {
    await GroupJoinRequestModel.updateOne(
      { _id: requestId },
      { status: status }
    );
  }

  public async getPendingGroupJoinRequests(groupId: string) {
    return await GroupJoinRequestModel.aggregate<GroupJoinRequestDetailType>([
      {
        $match: {
          group_id: new Types.ObjectId(groupId),
          status: GroupJoinRequestStatus.PENDING,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 1,
          status: 1,
          user: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            username: 1,
            avatar: 1,
          },
        },
      },
    ]);
  }
}
export default new GroupJoinRequestRepository();
