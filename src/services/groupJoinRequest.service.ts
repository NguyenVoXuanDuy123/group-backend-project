import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import groupRepository from "@src/repositories/group.repository";
import groupJoinRequestRepository from "@src/repositories/groupJoinRequest.repository";
import { GroupJoinRequestStatus } from "@src/schema/groupJoinRequest.schema";
import groupService from "@src/services/group.service";
import { Types } from "mongoose";

class GroupJoinRequestService {
  async createGroupRequest(senderId: string, groupId: string) {
    // Check if the sender is trying to send a group request which is already sent and pending
    if (
      await groupJoinRequestRepository.checkGroupJoinRequestExists(
        senderId,
        groupId
      )
    ) {
      throw new ApiError(ApiErrorCodes.GROUP_REQUEST_ALREADY_SENT);
    }

    const group = await groupRepository.getGroupById(groupId);

    if (!group) {
      throw new NotFoundError("group");
    }

    if (group.members.some((member) => member.toString() === senderId)) {
      throw new ApiError(ApiErrorCodes.ALREADY_GROUP_MEMBER);
    }

    await groupJoinRequestRepository.createGroupJoinRequest(senderId, groupId);
  }

  async changeGroupRequestStatus(
    senderId: string,
    requestId: string,
    status: GroupJoinRequestStatus
  ) {
    const groupJoinRequest =
      await groupJoinRequestRepository.getGroupJoinRequestById(requestId);

    if (!groupJoinRequest) {
      throw new NotFoundError("group join request");
    }
    // Check if the group request is not pending
    if (groupJoinRequest.status !== GroupJoinRequestStatus.PENDING) {
      throw new ApiError(ApiErrorCodes.CANNOT_CHANGE_GROUP_REQUEST_STATUS);
    }

    const group = await groupRepository.getGroupById(
      groupJoinRequest.group_id.toHexString()
    );

    if (!group) {
      throw new NotFoundError("group");
    }

    // Check if someone outside this request is trying to change the status
    if (
      senderId !== groupJoinRequest.user_id.toHexString() &&
      senderId !== group.admin.toHexString()
    ) {
      console.log(group.admin, senderId);
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }

    // Check if the sender is the user who sent the request and they want to accept or reject the request
    if (
      groupJoinRequest.user_id.toHexString() === senderId &&
      status !== GroupJoinRequestStatus.CANCELED
    ) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }

    // Check if the sender is the admin of the group and they want to cancel the request
    if (
      group.admin.toHexString() === senderId &&
      status === GroupJoinRequestStatus.CANCELED
    ) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }

    if (status === GroupJoinRequestStatus.ACCEPTED) {
      await groupService.addMemberToGroup(
        groupJoinRequest.group_id.toHexString(),
        groupJoinRequest.user_id.toHexString()
      );
    }

    await groupJoinRequestRepository.changeStatusGroupJoinRequest(
      requestId,
      status
    );
  }
  public async getMyPendingReceivedGroupJoinRequests(userId: string) {
    return await groupJoinRequestRepository.getMyPendingReceivedGroupJoinRequests(
      userId
    );
  }
}
export default new GroupJoinRequestService();
