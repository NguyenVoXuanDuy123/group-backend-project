import postController from "@src/controllers/post.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import { createPostValidator } from "@src/middlewares/post.middleware";
import { AuthenticationValidator } from "@src/middlewares/util.middleware";
import { Router } from "express";

const postRouter = Router();

postRouter.post(
  "/",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(createPostValidator),
  wrapRequestHandler(postController.createPost)
);

export default postRouter;
