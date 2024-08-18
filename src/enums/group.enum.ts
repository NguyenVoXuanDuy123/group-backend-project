export enum GroupVisibilityLevel {
  PUBLIC = "public",
  PRIVATE = "private",
}

export enum GroupStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export enum GroupJoinRequestStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  CANCELLED = "cancelled",
}

export enum GroupRole {
  ADMIN = "admin",
  MEMBER = "member",
}

export enum UserGroupRelation {
  ADMIN = "admin",
  MEMBER = "member",
  NOT_MEMBER = "not_member",
  // When the sender has sent a group request to the user.
  INCOMING_REQUEST = "incoming_request",
}
