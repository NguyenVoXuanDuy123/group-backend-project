import { GroupRole, GroupStatus } from "@src/enums/group.enums";

export type PaginationQueryType = {
  afterId?: string;
  beforeDate?: string;
  limit?: string;
};

export type GroupsQueryType = {
  groupRole?: GroupRole;
  status?: GroupStatus;
};
