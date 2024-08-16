import FriendRequestModel, {
  FriendRequestStatus,
} from "@src/schema/friendRequest.schema";
import { FriendRequestDetailType } from "@src/types/user.types";
import { Types } from "mongoose";

class FriendRequestRepository {
  public async getFriendRequestById(requestId: string | Types.ObjectId) {
    return await FriendRequestModel.findById(requestId, {
      __v: 0,
    }).lean();
  }

  public async createFriendRequest(sender_id: string, receiver_id: string) {
    return await FriendRequestModel.create({ sender_id, receiver_id });
  }

  public async changeStatusFriendRequest(
    requestId: string,
    status: FriendRequestStatus
  ) {
    await FriendRequestModel.updateOne({ _id: requestId }, { status: status });
  }

  public async checkPendingFriendRequestExists(
    sender_id: string,
    receiver_id: string
  ) {
    return !!(await this.getPendingFriendRequestBySenderIdAndReceiverId(
      sender_id,
      receiver_id
    ));
  }

  public async getPendingFriendRequestBySenderIdAndReceiverId(
    sender_id: string,
    receiver_id: string
  ) {
    return await FriendRequestModel.findOne(
      {
        sender_id,
        receiver_id,
        status: FriendRequestStatus.PENDING,
      },
      {
        __v: 0,
      }
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
