import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enum";

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
  groupId?: string;
};

export type ReactToRequestType = {
  reactionType: ReactionType;
};

/*
 * When users fetch post or comment reactions, they will get the reaction details defined below
 */

export type ReactionDetailType = {
  _id: string;
  type: ReactionType;
  target_type: ReactionTargetType;
  user: {
    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    avatar: string;
  };
};
