import CommentController from "@src/controllers/comment.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import { reactToValidator } from "@src/middlewares/post.middleware";

import { Router } from "express";

const commentRouter = Router();

// we add new comment in post.routes.ts, so we don't need to add it here

commentRouter.patch(
  "/:commentId",
  wrapRequestHandler(CommentController.updateComment)
);

commentRouter.delete(
  "/:commentId",
  wrapRequestHandler(CommentController.removeComment)
);

commentRouter.put(
  "/:commentId/reactions",
  wrapRequestHandler(reactToValidator),
  wrapRequestHandler(CommentController.reactToComment)
);

commentRouter.delete(
  "/:commentId/reactions",
  wrapRequestHandler(CommentController.removeReactionFromComment)
);

commentRouter.get(
  "/:commentId/reactions",
  wrapRequestHandler(CommentController.getReactionsOfComment)
);

export default commentRouter;
