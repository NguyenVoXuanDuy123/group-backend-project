import { PostVisibilityLevel } from "@src/schema/post.schema";

export type CreatePostRequestType = {
  content: string;
  images: string[];
  visibilityLevel: PostVisibilityLevel;
  group?: string;
};

export type UpdatePostRequestType = {
  content?: string;
  images?: string[];
  visibilityLevel?: PostVisibilityLevel;
  group?: string;
};
