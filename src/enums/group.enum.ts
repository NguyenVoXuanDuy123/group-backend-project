export enum GroupVisibilityLevel {
  PUBLIC = "public",
  FRIENDS = "friends",
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
  CANCELED = "cancelled",
}

export enum UserGroupRelation {
  ADMIN = "admin",
  MEMBER = "member",
  NOT_MEMBER = "not_member",
  INCOMING_REQUEST = "incoming_request", // When the sender has sent a group request to the user.
}
