import GroupModel from "@src/schema/group.schema";
import GroupJoinRequestModel, {
  GroupJoinRequestStatus,
} from "@src/schema/groupJoinRequest.schema";
import { Types } from "mongoose";

class GroupJoinRequestRepository {
  async getGroupJoinRequestById(requestId: string) {
    return await GroupJoinRequestModel.findById(requestId).lean();
  }
  async createGroupJoinRequest(sender_id: string, group_id: string) {
    return await GroupJoinRequestModel.create({ user_id: sender_id, group_id });
  }

  async checkGroupJoinRequestExists(sender_id: string, group_id: string) {
    return !!(await GroupJoinRequestModel.findOne({
      user_id: sender_id,
      group_id,
      status: GroupJoinRequestStatus.PENDING,
    }).lean());
  }

  async changeStatusGroupJoinRequest(
    requestId: string,
    status: GroupJoinRequestStatus
  ) {
    await GroupJoinRequestModel.updateOne(
      { _id: requestId },
      { status: status }
    );
  }

  async getMyPendingReceivedGroupJoinRequests(userId: string) {
    return await GroupModel.aggregate([
      {
        $match: {
          admin: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "group_join_requests",
          localField: "_id",
          foreignField: "group_id",
          as: "groupJoinRequests",
        },
      },
      {
        $unwind: "$groupJoinRequests",
      },
      {
        $match: {
          "groupJoinRequests.status": GroupJoinRequestStatus.PENDING,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "groupJoinRequests.user_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: "$userDetails",
      },
      {
        $project: {
          _id: "$groupJoinRequests._id",
          status: "$groupJoinRequests.status",
          userDetails: {
            _id: "$userDetails._id",
            first_name: "$userDetails.first_name",
            last_name: "$userDetails.last_name",
            avatar: "$userDetails.avatar",
            username: "$userDetails.username",
          },
        },
      },
    ]);
  }
}
export default new GroupJoinRequestRepository();
