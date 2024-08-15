import {
  GroupJoinRequestStatus,
  GroupVisibilityLevel,
} from "@src/enums/group.enum";

export type CreateGroupJoinRequestType = {
  name: string;
  description: string;
  visibilityLevel: GroupVisibilityLevel;
};

export type UpdateGroupJoinRequestType = {
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

export enum UserRelationshipWithGroup {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  NONE_MEMBER = "NONE_MEMBER",
  REQUESTED = "REQUESTED",
}
