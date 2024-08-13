import GroupJoinRequestModel, {
  GroupJoinRequestStatus,
} from "@src/schema/groupJoinRequest.schema";

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
}
export default new GroupJoinRequestRepository();
