import FriendRequestModel, {
  FriendRequestStatus,
} from "@src/models/friendRequest.schema";

class FriendRequestRepository {
  public async getFriendRequestById(requestId: string) {
    return await FriendRequestModel.findById(requestId).lean();
  }

  public async createFriendRequest(senderId: string, receiverId: string) {
    await FriendRequestModel.create({ senderId, receiverId });
  }

  public async changeStatusFriendRequest(
    requestId: string,
    status: FriendRequestStatus
  ) {
    await FriendRequestModel.updateOne({ _id: requestId }, { status: status });
  }

  public async checkFriendRequestExists(senderId: string, receiverId: string) {
    return !!(await FriendRequestModel.findOne({
      senderId,
      receiverId,
      status: FriendRequestStatus.PENDING,
    }).lean());
  }
}

export default new FriendRequestRepository();
