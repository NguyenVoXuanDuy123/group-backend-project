import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enums";

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
