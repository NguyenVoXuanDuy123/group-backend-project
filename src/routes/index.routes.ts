import { Router } from "express";
import authRouter from "@src/routes/auth.routes";
import userRouter from "@src/routes/user.routes";
import postRouter from "@src/routes/post.routes";
import groupRouter from "@src/routes/group.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/groups", groupRouter);
apiRouter.get("/posts", postRouter);

export default apiRouter;
