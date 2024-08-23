import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import { camelCaseifyWithDateConversion } from "@src/helpers/camelCaseifyWithDateConversion";
import commentService from "@src/services/comment.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { UpdateCommentRequestType } from "@src/types/comment.types";
import { ReactToRequestType } from "@src/types/post.types";
import { UserSessionType } from "@src/types/user.types";

class CommentController {
  public updateComment = async (
    req: APIRequest<UpdateCommentRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const comment = await commentService.updateComment(
      _id,
      req.params.commentId,
      req.body
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Update comment successfully",
      result: camelCaseifyWithDateConversion(comment),
    });
  };

  public deleteComment = async (req: APIRequest, res: APIResponse) => {
    const { _id, role } = req.user as UserSessionType;
    await commentService.deleteComment(_id, req.params.commentId, role);
    res.status(HttpStatusCodes.OK).json({
      message: "Delete comment successfully",
    });
  };

  public reactToComment = async (
    req: APIRequest<ReactToRequestType>,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    const { type } = req.body;
    const reaction = await commentService.reactToComment(
      _id,
      req.params.commentId,
      type
    );
    // If the reaction is created at the same time as updated at, it means the reaction is new
    // Therefore, return 201 status code
    if (reaction.updated_at.getTime() === reaction.created_at.getTime()) {
      res.status(HttpStatusCodes.CREATED).json({
        message: "React " + type + " to comment successfully",
      });
      return;
    }

    // Otherwise, return 200 status code
    res.status(HttpStatusCodes.OK).json({
      message: "Change reaction to " + type + " successfully",
    });
  };

  public removeReactionFromComment = async (
    req: APIRequest,
    res: APIResponse
  ) => {
    const { _id } = req.user as UserSessionType;
    await commentService.removeReactionFromComment(req.params.commentId, _id);
    res.status(HttpStatusCodes.OK).json({
      message: "Remove reaction from comment successfully",
    });
  };

  public getReactionsOfComment = async (req: APIRequest, res: APIResponse) => {
    const { _id } = req.user as UserSessionType;
    const { type } = req.query as ReactToRequestType;
    const reactions = await commentService.getCommentReactions(
      req.params.commentId,
      _id,
      type
    );
    res.status(HttpStatusCodes.OK).json({
      message: "Get reactions of comment successfully",
      result: reactions.map(camelCaseifyWithDateConversion),
    });
  };
}

export default new CommentController();
