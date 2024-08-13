import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import NotFoundError from "@src/error/NotFoundError";
import groupRepository from "@src/repositories/group.repository";
import groupJoinRequestRepository from "@src/repositories/groupJoinRequest.repository";
import { GroupJoinRequestStatus } from "@src/schema/groupJoinRequest.schema";
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
    requestId: string,
    status: GroupJoinRequestStatus
  ) {
    const groupJoinRequest =
      await groupJoinRequestRepository.getGroupJoinRequestById(requestId);

    if (!groupJoinRequest) {
      throw new NotFoundError("group join request");
    }

    if (groupJoinRequest.status !== GroupJoinRequestStatus.PENDING) {
      throw new ApiError(ApiErrorCodes.CANNOT_CHANGE_GROUP_REQUEST_STATUS);
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
}
export default new GroupJoinRequestService();
