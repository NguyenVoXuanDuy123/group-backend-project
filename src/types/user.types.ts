import { GroupVisibilityLevel } from "@src/enums/group.enum";
import { UserRole, UserStatus } from "@src/enums/user.enum";
import { FriendRequestStatus } from "@src/enums/user.enum";
import { Types } from "mongoose";

export type UserSessionType = {
  _id: string;
  role: UserRole;
  status: UserStatus;
};

export type UpdateMeRequestType = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
};

export type SendFriendRequestType = {
  receiverId: string;
};

export type ChangeFriendRequestStatusType = {
  status: FriendRequestStatus;
};

/*
 * When users fetch their friends,
 * they will get the friend details defined below
 */
export type FriendDetailType = {
  _id: string;
  lastName: string;
  firstName: string;
  username: string;
  avatar?: string;
  friends: Types.ObjectId[];
};
/**
 * When users fetch groups which they are members of,
 * they will get the group details defined below
 */
export type GroupDetailType = {
  _id: string;
  name: string;
  description: string;
  visibilityLevel: GroupVisibilityLevel;
  members: Types.ObjectId[];
};

/**
 * When users fetch their received friend requests,
 * they will get the friend request details defined below
 */

export type FriendRequestDetailType = {
  _id: string;
  status: FriendRequestStatus;

  senderDetail: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
    friends: Types.ObjectId[];
  };
  createdAt: Date;
};

//Only admin can change user status
export type ChangeUserStatusRequestType = {
  status: UserStatus;
};
