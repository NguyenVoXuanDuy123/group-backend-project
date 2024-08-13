import { GroupVisibilityLevel } from "@src/schema/group.schema";
import { GroupJoinRequestStatus } from "@src/schema/groupJoinRequest.schema";

export type CreateGroupRequestType = {
  name: string;
  description: string;
  visibilityLevel: GroupVisibilityLevel;
};

export type UpdateGroupRequestType = {
  name?: string;
  description?: string;
  visibilityLevel?: GroupVisibilityLevel;
};

export type GroupMemberRequestType = {
  groupId: string;
};

export type ChangeGroupJoinRequestStatusRequestType = {
  status: GroupJoinRequestStatus;
};

export type RemoveGroupMemberRequestType = {
  memberId: string;
};
