import { GroupJoinRequestStatus } from "@src/enums/group.enum";
import GroupModel from "@src/schema/group.schema";
import GroupJoinRequestModel from "@src/schema/groupJoinRequest.schema";
import { Types } from "mongoose";

class GroupJoinRequestRepository {
  async getGroupJoinRequestById(requestId: string | Types.ObjectId) {
    return await GroupJoinRequestModel.findById(requestId).lean();
  }
  async createGroupJoinRequest(sender_id: string, group_id: string) {
    return await GroupJoinRequestModel.create({ user_id: sender_id, group_id });
  }

  async checkPendingGroupJoinRequestExists(
    sender_id: string,
    group_id: string
  ) {
    return !!(await this.getPendingGroupJoinRequestBySenderIdAndGroupId(
      sender_id,
      group_id
    ));
  }

  async getPendingGroupJoinRequestBySenderIdAndGroupId(
    sender_id: string,
    group_id: string
  ) {
    return await GroupJoinRequestModel.findOne({
      user_id: sender_id,
      group_id,
      status: GroupJoinRequestStatus.PENDING,
    }).lean();
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

  async getPendingGroupJoinRequests(groupId: string) {
    return await GroupJoinRequestModel.aggregate([
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
