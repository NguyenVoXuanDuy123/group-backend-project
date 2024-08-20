import { FriendRequestStatus } from "@src/enums/user.enum";
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
      sender_id: senderId,
      receiver_id: receiverId,
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
    senderId: string,
    receiverId: string,
    projection: ProjectionType<IFriendRequest> = {}
  ) {
    return await FriendRequestModel.findOne(
      {
        sender_id: senderId,
        receiver_id: receiverId,
        status: FriendRequestStatus.PENDING,
      },
      projection
    ).lean();
  }

  public async getMyPendingReceivedFriendRequests(receiverId: string) {
    return await FriendRequestModel.aggregate<FriendRequestDetailType>([
      {
        $match: {
          receiver_id: new Types.ObjectId(receiverId),
          status: FriendRequestStatus.PENDING,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "sender_id",
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
          senderDetails: {
            _id: "$senderDetails._id",
            first_name: "$senderDetails.first_name",
            last_name: "$senderDetails.last_name",
            avatar: "$senderDetails.avatar",
            username: "$senderDetails.username",
          },
        },
      },
    ]);
  }
}

export default new FriendRequestRepository();
