import { FriendRequestStatus } from "@src/enums/user.enums";
import { validateDate } from "@src/helpers/validation";
import FriendRequestModel, {
  IFriendRequest,
} from "@src/schema/friendRequest.schema";
import { FriendRequestDetailType } from "@src/types/user.types";
import { ProjectionType, Types } from "mongoose";

class FriendRequestRepository {
  public async getFriendRequestById(
    requestId: string | Types.ObjectId,
    projection: ProjectionType<IFriendRequest> = {}
  ) {
    return await FriendRequestModel.findById(requestId, projection).lean();
  }

  public async createFriendRequest(senderId: string, receiverId: string) {
    return await FriendRequestModel.create({
      sender: senderId,
      receiver: receiverId,
    });
  }

  public async changeStatusFriendRequest(
    requestId: string,
    status: FriendRequestStatus
  ) {
    await FriendRequestModel.updateOne({ _id: requestId }, { status: status });
  }

  public async checkPendingFriendRequestExists(
    senderId: string,
    receiverId: string
  ) {
    return !!(await this.getPendingFriendRequestBySenderIdAndReceiverId(
      senderId,
      receiverId
    ));
  }

  public async getPendingFriendRequestBySenderIdAndReceiverId(
    senderId: string | Types.ObjectId,
    receiverId: string | Types.ObjectId,
    projection: ProjectionType<IFriendRequest> = {}
  ) {
    return await FriendRequestModel.findOne(
      {
        sender: senderId,
        receiver: receiverId,
        status: FriendRequestStatus.PENDING,
      },
      projection
    ).lean();
  }

  public async getMyPendingReceivedFriendRequests(
    receiverId: string,
    beforeDate?: string,
    limit?: number
  ) {
    //if date is not valid, method below will throw an error
    if (beforeDate) {
      validateDate(beforeDate);
    }

    return await FriendRequestModel.aggregate<FriendRequestDetailType>([
      {
        $match: {
          receiver: new Types.ObjectId(receiverId),
          status: FriendRequestStatus.PENDING,
          createdAt: { $lt: beforeDate ? new Date(beforeDate) : new Date() },
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limit || 10 },
      {
        $lookup: {
          from: "users",
          localField: "sender",
          foreignField: "_id",
          as: "senderDetails",
        },
      },
      {
        $unwind: "$senderDetails",
      },
      {
        $project: {
          _id: "$_id",
          status: "$status",
          senderDetail: {
            _id: "$senderDetails._id",
            firstName: "$senderDetails.firstName",
            lastName: "$senderDetails.lastName",
            avatar: "$senderDetails.avatar",
            username: "$senderDetails.username",
            friends: "$senderDetails.friends",
          },
          createdAt: "$createdAt",
        },
      },
    ]);
  }
}

export default new FriendRequestRepository();
