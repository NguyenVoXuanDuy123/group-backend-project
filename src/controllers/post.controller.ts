import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import postService from "@src/services/post.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import {
  CreatePostRequestType,
  ReactToPostRequestType,
  UpdatePostRequestType,
} from "@src/types/post.types";
import { UserSessionType } from "@src/types/user.types";

class PostController {
  public createPost = async (
    req: APIRequest<CreatePostRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const post = await postService.createPost(_id, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Create post successful",
      result: post,
    });
  };

  public getPostById = async (req: APIRequest, res: APIResponse) => {
    const { _id, role } = req.user as UserSessionType;

    const post = await postService.getPostById(req.params.postId, _id, role);
    res.status(HttpStatusCodes.OK).json({
      message: "Get post successful",
      result: post,
    });
  };

  public updatePost = async (
    req: APIRequest<UpdatePostRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    await postService.updatePost(_id, req.params.postId, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Update post successful",
    });
  };

  public reactToPost = async (
    req: APIRequest<ReactToPostRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const { reactionType } = req.body;
    const reaction = await postService.reactToPost(
      req.params.postId,
      _id,
      reactionType
    );

    if (
      reaction.updated_at.toISOString() === reaction.created_at.toISOString()
    ) {
      res.status(HttpStatusCodes.CREATED).json({
        message: "React " + reactionType + " to post successful",
        result: reaction,
      });
      return;
    }
    res.status(HttpStatusCodes.OK).json({
      message: "Change reaction to " + reactionType + " successful",
      result: reaction,
    });
  };

  public removeReactionFromPost = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    await postService.removeReactionFromPost(req.params.postId, _id);
    res.status(HttpStatusCodes.OK).json({
      message: "Remove reaction from post successful",
    });
  };
}

export default new PostController();
