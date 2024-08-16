import postController from "@src/controllers/post.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import {
  createPostValidator,
  reactToPostValidator,
} from "@src/middlewares/post.middleware";

import { Router } from "express";

const postRouter = Router();

postRouter.post(
  "/",
  wrapRequestHandler(createPostValidator),
  wrapRequestHandler(postController.createPost)
);

postRouter.patch("/:postId", wrapRequestHandler(postController.updatePost));

// postRouter.delete("/:postId", wrapRequestHandler(postController.deletePost));

postRouter.get("/:postId", wrapRequestHandler(postController.getPostById));

// postRouter.post(
//   "/:postId/comments",
//   wrapRequestHandler(postController.createComment)
// );

// postRouter.patch(
//   "/:postId/comments/:commentId",
//   wrapRequestHandler(postController.updateComment)
// );

// postRouter.delete(
//   "/:postId/comments/:commentId",
//   wrapRequestHandler(postController.deleteComment)
// );

// postRouter.get(
//   "/:postId/comments/:commentId",
//   wrapRequestHandler(postController.getCommentById)
// );

postRouter.put(
  "/:postId/reactions",
  wrapRequestHandler(reactToPostValidator),
  wrapRequestHandler(postController.reactToPost)
);

postRouter.delete(
  "/:postId/reactions/",
  wrapRequestHandler(postController.removeReactionFromPost)
);

// postRouter.get(
//   "/:postId/reactions",
//   wrapRequestHandler(postController.getReactions)
// );

// postRouter.get(
//   "/:postId/comments",
//   wrapRequestHandler(postController.getComments)
// );

// postRouter.post

export default postRouter;
