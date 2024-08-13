import { GroupVisibilityLevel } from "@src/schema/group.schema";

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
