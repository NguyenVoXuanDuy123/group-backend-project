import {
  GroupJoinRequestStatus,
  GroupRole,
  GroupStatus,
  GroupVisibilityLevel,
} from "@src/enums/group.enums";
import { Types } from "mongoose";

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
/**
 * when group admins fetch group join requests,
 * they will get the group join request details defined below
 */
export type GroupJoinRequestDetailType = {
  _id: string;
  status: GroupJoinRequestStatus;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
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
  firstName: string;
  lastName: string;
  username: string;
  groupRole: GroupRole;
  avatar: string;
  friends: Types.ObjectId[];
};

//Only admin can change user status
export type ChangeGroupStatusRequestType = {
  status: GroupStatus;
};
