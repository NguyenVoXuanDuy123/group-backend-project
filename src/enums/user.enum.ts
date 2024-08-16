export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum UserStatus {
  ACTIVE = "active",
  BANNED = "banned",
}

export enum UserFriendRelation {
  FRIEND = "FRIEND",
  NOT_FRIEND = "NOT_FRIEND",
  SELF = "SELF",
  // When the sender has sent a friend request to the user.
  INCOMING_REQUEST = "INCOMING_REQUEST",
  // When the user has sent a friend request to the sender.
  OUTGOING_REQUEST = "OUTGOING_REQUEST",
}
