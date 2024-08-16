import commentController from "@src/controllers/comment.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import { reactToValidator } from "@src/middlewares/post.middleware";

import { Router } from "express";

const commentRouter = Router();

// we add new comment in post.routes.ts, so we don't need to add it here

commentRouter.patch(
  "/:commentId",
  wrapRequestHandler(commentController.updateComment)
);

commentRouter.delete(
  "/:commentId",
  wrapRequestHandler(commentController.deleteComment)
);

commentRouter.put(
  "/:commentId/reactions",
  wrapRequestHandler(reactToValidator),
  wrapRequestHandler(commentController.reactToComment)
);

commentRouter.delete(
  "/:commentId/reactions",
  wrapRequestHandler(commentController.removeReactionFromComment)
);

export default commentRouter;
