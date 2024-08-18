import { GroupJoinRequestStatus } from "@src/enums/group.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

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
      throw new ApiError(ApiErrorCodes.GROUP_JOIN_REQUEST_ALREADY_SENT);
    }

    const group = await groupRepository.findGroupById(groupId);
    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }
    if (group.admin.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.GROUP_ADMIN_CANNOT_SEND_GROUP_REQUEST);
    }

    if (group.members.some((member) => member.equals(senderId))) {
      throw new ApiError(ApiErrorCodes.ALREADY_GROUP_MEMBER);
    }

    const { _id } = await groupJoinRequestRepository.createGroupJoinRequest(
      senderId,
      groupId
    );
    return await groupJoinRequestRepository.getGroupJoinRequestById(_id, {
      __v: 0,
    });
  }

  async changeGroupJoinRequestStatus(
    senderId: string,
    requestId: string,
    status: GroupJoinRequestStatus
  ) {
    const groupJoinRequest =
      await groupJoinRequestRepository.getGroupJoinRequestById(requestId);

    if (!groupJoinRequest) {
      throw new ApiError(ApiErrorCodes.GROUP_JOIN_REQUEST_NOT_FOUND);
    }
    // Check if the group request is not pending, then it cannot be changed
    // because it is already accepted, rejected, or cancelled
    if (groupJoinRequest.status !== GroupJoinRequestStatus.PENDING) {
      throw new ApiError(ApiErrorCodes.CANNOT_CHANGE_GROUP_REQUEST_STATUS);
    }

    const group = await groupRepository.findGroupById(
      groupJoinRequest.group_id
    );

    if (!group) {
      throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
    }

    // Check if someone outside this request is trying to change the status
    if (
      !groupJoinRequest.user_id.equals(senderId) &&
      !group.admin.equals(senderId)
    ) {
      throw new ApiError(ApiErrorCodes.FORBIDDEN);
    }

    // Check if the sender is the user who sent the request and they want to accept or reject the request
    if (
      groupJoinRequest.user_id.equals(senderId) &&
      status !== GroupJoinRequestStatus.CANCELLED
    ) {
      throw new ApiError(
        ApiErrorCodes.CHANGE_GROUP_JOIN_REQUEST_STATUS_FORBIDDEN
      );
    }

    // Check if the sender is the admin of the group and they want to cancel the request
    if (
      group.admin.equals(senderId) &&
      status === GroupJoinRequestStatus.CANCELLED
    ) {
      throw new ApiError(
        ApiErrorCodes.CHANGE_GROUP_JOIN_REQUEST_STATUS_FORBIDDEN
      );
    }

    if (status === GroupJoinRequestStatus.ACCEPTED) {
      await groupService.addMemberToGroup(
        groupJoinRequest.group_id,
        groupJoinRequest.user_id
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
