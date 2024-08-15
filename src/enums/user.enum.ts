export enum UserRelationshipWithGroup {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
  NONE_MEMBER = "NONE_MEMBER",
  REQUESTED = "REQUESTED",
}

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export enum UserStatus {
  ACTIVE = "active",
  BANNED = "banned",
}

export enum UserRelation {
  FRIEND = "FRIEND",
  NOT_FRIEND = "NOT_FRIEND",
  SELF = "SELF",
  INCOMING_REQUEST = "INCOMING_REQUEST", // When the sender has sent a friend request to the user.
  OUTGOING_REQUEST = "OUTGOING_REQUEST", // When the user has sent a friend request to the sender.
}
