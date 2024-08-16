import { PostVisibilityLevel, ReactionType } from "@src/enums/post.enum";

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

export type ReactToPostRequestType = {
  reactionType: ReactionType;
};
