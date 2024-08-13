import { FriendRequestStatus } from "@src/schema/friendRequest.schema";

export type UserSessionType = {
  _id: string;
  role: string;
};

export type UpdateMeRequestType = {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
};

export type SendFriendRequestType = {
  receiverId: string;
};

export type ChangeFriendRequestStatusType = {
  status: FriendRequestStatus;
};

export type FriendDetailType = {
  _id: string;
  last_name: string;
  first_name: string;
  username: string;
  avatar?: string;
};
