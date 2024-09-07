import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enum";
import { PostEditHistory } from "@src/schema/post.schema";
import { UserInformationType } from "@src/types/user.types";

export type CreatePostRequestType = {
  content: string;
  images?: string[];
  visibilityLevel: PostVisibilityLevel;
  groupId?: string;
};

export type UpdatePostRequestType = {
  content?: string;
  images?: string[];
  visibilityLevel?: PostVisibilityLevel;
};

export type ReactToRequestType = {
  type: ReactionType;
};

/*
 * When users fetch post or comment reactions, they will get the reaction details defined below
 */

export type ReactionDetailType = {
  _id: string;
  type: ReactionType;
  targetType: ReactionTargetType;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
  };
};

export type PostDetailType = {
  author: UserInformationType;
  commentCount: number;
  content: string;
  createdAt: string;
  editHistory: PostEditHistory[];
  group: null | Group;
  _id: string;
  images: string[];
  updatedAt: string;
  visibilityLevel: PostVisibilityLevel;
};

type Group = {
  _id: string;
  name: string;
  admin: string;
};
