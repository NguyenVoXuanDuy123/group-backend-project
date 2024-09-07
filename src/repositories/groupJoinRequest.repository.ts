import { GroupJoinRequestStatus } from "@src/enums/group.enums";
import { validateDate } from "@src/helpers/validation";
import { Group } from "@src/schema/group.schema";

import GroupJoinRequestModel from "@src/schema/groupJoinRequest.schema";
import { GroupJoinRequestDetailType } from "@src/types/group.types";
import { ProjectionType, Types } from "mongoose";

class GroupJoinRequestRepository {
  public async getGroupJoinRequestById(
    requestId: string | Types.ObjectId,
    projection: ProjectionType<Group> = {}
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
    projection: ProjectionType<Group> = {}
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

  public async getPendingGroupJoinRequests(
    groupId: string,
    beforeDate?: string,
    limit?: number
  ) {
    if (beforeDate) {
      //if date is not valid, method below will throw an error
      validateDate(beforeDate);
    }

    return await GroupJoinRequestModel.aggregate<GroupJoinRequestDetailType>([
      {
        $match: {
          group: new Types.ObjectId(groupId),
          status: GroupJoinRequestStatus.PENDING,
          createdAt: {
            $lt: new Date(beforeDate ? beforeDate : new Date()),
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: limit || 10,
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
          createdAt: "$createdAt",
          senderDetail: {
            _id: "$senderDetail._id",
            firstName: "$senderDetail.firstName",
            lastName: "$senderDetail.lastName",
            username: "$senderDetail.username",
            avatar: "$senderDetail.avatar",
          },
        },
      },
    ]);
  }
}
export default new GroupJoinRequestRepository();
