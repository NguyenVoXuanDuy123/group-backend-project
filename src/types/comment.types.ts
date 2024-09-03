import { ICommentEditHistory } from "@src/schema/comment.schema";

export type CreateCommentRequestType = {
  content: string;
};

export type UpdateCommentRequestType = {
  content?: string;
};

/**
 * When users fetch comments, they will get the comment details defined below
 */

export type CommentDetailType = {
  _id: string;
  content: string;
  editHistory: ICommentEditHistory[];
  author: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatar: string;
  };
  reactionCount: number;
  createdAt: Date;
  updatedAt: Date;
};
