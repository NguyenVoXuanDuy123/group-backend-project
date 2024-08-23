import postController from "@src/controllers/post.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import {
  addCommentValidator,
  createPostValidator,
  reactToValidator,
  updatePostValidator,
} from "@src/middlewares/post.middleware";

import { Router } from "express";

const postRouter = Router();

postRouter.post(
  "/",
  wrapRequestHandler(createPostValidator),
  wrapRequestHandler(postController.createPost)
);

postRouter.patch(
  "/:postId",
  wrapRequestHandler(updatePostValidator),
  wrapRequestHandler(postController.updatePost)
);

postRouter.delete("/:postId", wrapRequestHandler(postController.deletePost));

postRouter.get("/:postId", wrapRequestHandler(postController.getPostById));

postRouter.post(
  "/:postId/comments",
  wrapRequestHandler(addCommentValidator),
  wrapRequestHandler(postController.createCommentToPost)
);

postRouter.get(
  "/:postId/comments",
  wrapRequestHandler(postController.getCommentsFromPost)
);

postRouter.put(
  "/:postId/reactions",
  wrapRequestHandler(reactToValidator),
  wrapRequestHandler(postController.reactToPost)
);

postRouter.delete(
  "/:postId/reactions/",
  wrapRequestHandler(postController.removeReactionFromPost)
);

postRouter.get(
  "/:postId/reactions",
  wrapRequestHandler(postController.getReactionsFromPost)
);

export default postRouter;
