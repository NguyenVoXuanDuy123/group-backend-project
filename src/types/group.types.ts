import {
  GroupJoinRequestStatus,
  GroupRole,
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
/**
 * when group admins fetch group join requests,
 * they will get the group join request details defined below
 */
export type GroupJoinRequestDetailType = {
  _id: string;
  status: GroupJoinRequestStatus;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    avatar: string;
  };
};

/**
 * when group admins fetch group members,
 * they will get the group member details defined below
 */
export type GroupMemberDetailType = {
  _id: string;
  first_name: string;
  last_name: string;
  username: string;
  groupRole: GroupRole;
  avatar?: string;
};
