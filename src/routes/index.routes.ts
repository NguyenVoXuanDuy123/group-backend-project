import { Router } from "express";
import authRouter from "@src/routes/auth.routes";
import userRouter from "@src/routes/user.routes";
import postRouter from "@src/routes/post.routes";
import groupRouter from "@src/routes/group.routes";
import {
  AuthenticationValidator,
  IsUserActiveValidator,
} from "@src/middlewares/util.middleware";
import { wrapRequestHandler } from "@src/helpers/handlers";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);

//check if user is authenticated
userRouter.use(wrapRequestHandler(AuthenticationValidator));

//if user is authenticated, check if user is not banned, if banned, throw error
apiRouter.use(wrapRequestHandler(IsUserActiveValidator));
apiRouter.use("/users", userRouter);
apiRouter.use("/groups", groupRouter);
apiRouter.use("/posts", postRouter);

export default apiRouter;
