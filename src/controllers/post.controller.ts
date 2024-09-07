import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import postService from "@src/services/post.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { CreateCommentRequestType } from "@src/types/comment.types";
import {
  CreatePostRequestType,
  ReactToRequestType,
  UpdatePostRequestType,
} from "@src/types/post.types";
import { UserSessionType } from "@src/types/user.types";
import { PaginationQueryType } from "@src/types/util.types";

class PostController {
  public createPost = async (
    req: APIRequest<CreatePostRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const post = await postService.createPost(_id, req.body);
    res.status(HttpStatusCodes.CREATED).json({
      message: "Create post successfully",
      result: post,
    });
  };

  public getPostById = async (req: APIRequest, res: APIResponse) => {
    const { _id, role } = req.user as UserSessionType;

    const post = await postService.getPostById(req.params.postId, _id, role);
    res.status(HttpStatusCodes.OK).json({
      message: "Get post successfully",
      result: post,
    });
  };

  public updatePost = async (
    req: APIRequest<UpdatePostRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;

    const post = await postService.updatePost(_id, req.params.postId, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Update post successfully",
      result: post,
    });
  };

  public removePost = async (req: APIRequest, res: APIResponse) => {
    const { _id, role } = req.user as UserSessionType;
    await postService.removePost(_id, req.params.postId, role);
    res.status(HttpStatusCodes.OK).json({
      message: "remove post successfully",
    });
  };

  public reactToPost = async (
    req: APIRequest<ReactToRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const { type } = req.body;
    const reaction = await postService.reactToPost(
      req.params.postId,
      _id,
      type
    );

    if (reaction.updatedAt.getTime() === reaction.createdAt.getTime()) {
      res.status(HttpStatusCodes.CREATED).json({
        message: "React " + type + " to post successfully",
      });
      return;
    }
    res.status(HttpStatusCodes.OK).json({
      message: "Change reaction to " + type + " successfully",
    });
  };

  public removeReactionFromPost = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    await postService.removeReactionFromPost(req.params.postId, _id);
    res.status(HttpStatusCodes.OK).json({
      message: "Remove reaction from post successfully",
    });
  };

  public getReactionsFromPost = async (req: APIRequest, res: APIResponse) => {
    const { _id, role } = req.user as UserSessionType;
    const { type } = req.query as ReactToRequestType;
    const reactions = await postService.getReactionsFromPost(
      req.params.postId,
      _id,
      role,
      type
    );

    res.status(HttpStatusCodes.OK).json({
      message: "Get reactions from post successfully",
      result: reactions,
    });
  };

  public addCommentToPost = async (
    req: APIRequest<CreateCommentRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;

    const comment = await postService.addCommentToPost(
      _id,
      req.params.postId,
      req.body
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Create comment successfully",
      result: comment,
    });
  };

  public getCommentsFromPost = async (req: APIRequest, res: APIResponse) => {
    const { _id, role } = req.user as UserSessionType;
    const paginationQuery = req.query as PaginationQueryType;

    const comments = await postService.getCommentsFromPost(
      req.params.postId,
      _id,
      role,
      paginationQuery
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Get comments successfully",
      result: comments,
    });
  };
}

export default new PostController();
