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
  // When user is not a member of the group and has sent a request to join the group
  OUTGOING_REQUEST = "outgoing_request",
}
