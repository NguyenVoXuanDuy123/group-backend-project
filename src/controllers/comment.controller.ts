import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import commentService from "@src/services/comment.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { UpdateCommentRequestType } from "@src/types/comment.types";
import { ReactToRequestType } from "@src/types/post.types";
import { UserSessionType } from "@src/types/user.types";

class commentController {
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
      result: comment,
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
    const { reactionType } = req.body;
    const reaction = await commentService.reactToComment(
      _id,
      req.params.commentId,
      reactionType
    );
    if (reaction.updated_at.getTime() === reaction.created_at.getTime()) {
      res.status(HttpStatusCodes.CREATED).json({
        message: "React " + reactionType + " to comment successfully",
      });
      return;
    }
    res.status(HttpStatusCodes.OK).json({
      message: "Change reaction to " + reactionType + " successfully",
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
}

export default new commentController();
