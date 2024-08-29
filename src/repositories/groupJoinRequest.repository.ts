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
    sender: string | Types.ObjectId,
    group: string | Types.ObjectId
  ) {
    return await GroupJoinRequestModel.create({ user: sender, group });
  }

  public async checkPendingGroupJoinRequestExists(
    sender: string | Types.ObjectId,
    group: string | Types.ObjectId
  ) {
    return !!(await this.getPendingGroupJoinRequestBySenderIdAndGroupId(
      sender,
      group
    ));
  }

  public async getPendingGroupJoinRequestBySenderIdAndGroupId(
    sender: string | Types.ObjectId,
    group: string | Types.ObjectId,
    projection: ProjectionType<IGroup> = {}
  ) {
    return await GroupJoinRequestModel.findOne(
      {
        user: sender,
        group,
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
          group: new Types.ObjectId(groupId),
          status: GroupJoinRequestStatus.PENDING,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "senderDetail",
        },
      },
      {
        $unwind: "$senderDetail",
      },
      {
        $project: {
          _id: "$_id",
          status: "$status",
          created_at: "$created_at",
          senderDetail: {
            _id: "$senderDetail._id",
            first_name: "$senderDetail.first_name",
            last_name: "$senderDetail.last_name",
            username: "$senderDetail.username",
            avatar: "$senderDetail.avatar",
          },
        },
      },
    ]);
  }
}
export default new GroupJoinRequestRepository();
