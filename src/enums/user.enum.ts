export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum UserStatus {
  ACTIVE = "active",
  BANNED = "banned",
}

export enum FriendRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum UserFriendRelation {
  FRIEND = "friend",
  NOT_FRIEND = "not_friend",
  SELF = "self",
  // when the sender has received a friend request from the user.
  INCOMING_REQUEST = "incoming_request",

  // When the sender has sent a friend request to the user.
  OUTGOING_REQUEST = "outgoing_request",
}
