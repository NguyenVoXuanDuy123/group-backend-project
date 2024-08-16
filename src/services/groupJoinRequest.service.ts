import { GroupJoinRequestStatus } from "@src/enums/group.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import groupRepository from "@src/repositories/group.repository";
import groupJoinRequestRepository from "@src/repositories/groupJoinRequest.repository";

import groupService from "@src/services/group.service";

class GroupJoinRequestService {
  async createGroupJoinRequest(senderId: string, groupId: string) {
    // Check if the sender is trying to send a group request which is already sent and pending
    if (
      await groupJoinRequestRepository.checkPendingGroupJoinRequestExists(
        senderId,
        groupId
      )
    ) {
      throw new ApiError(ApiErrorCodes.GROUP_REQUEST_ALREADY_SENT);
    }

    const group = await groupRepository.findGroupById(groupId);
    if (!group) {
      throw new NotFoundError("group");
    }
    if (senderId === group.admin.toHexString()) {
      throw new ApiError(ApiErrorCodes.GROUP_ADMIN_CANNOT_SEND_GROUP_REQUEST);
    }

    if (group.members.some((member) => member.equals(senderId))) {
      throw new ApiError(ApiErrorCodes.ALREADY_GROUP_MEMBER);
    }

    const { _id } = await groupJoinRequestRepository.createGroupJoinRequest(
      senderId,
      groupId
    );
    return await groupJoinRequestRepository.getGroupJoinRequestById(_id);
  }

  async changeGroupJoinRequestStatus(
    senderId: string,
    requestId: string,
    status: GroupJoinRequestStatus
  ) {
    const groupJoinRequest =
      await groupJoinRequestRepository.getGroupJoinRequestById(requestId);

    if (!groupJoinRequest) {
      throw new NotFoundError("group join request");
    }
    // Check if the group request is not pending, then it cannot be changed
    // because it is already accepted, rejected, or cancelled
    if (groupJoinRequest.status !== GroupJoinRequestStatus.PENDING) {
      throw new ApiError(ApiErrorCodes.CANNOT_CHANGE_GROUP_REQUEST_STATUS);
    }

    const group = await groupRepository.findGroupById(
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
  public async getPendingGroupJoinRequests(groupId: string) {
    return await groupJoinRequestRepository.getPendingGroupJoinRequests(
      groupId
    );
  }
}
export default new GroupJoinRequestService();
