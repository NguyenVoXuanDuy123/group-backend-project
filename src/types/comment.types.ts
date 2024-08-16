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
  edit_history: ICommentEditHistory[];
  author: {
    _id: string;
    first_name: string;
    last_name: string;
    username: string;
    avatar: string;
  };
  reaction_count: number;
  created_at: Date;
  updated_at: Date;
};
