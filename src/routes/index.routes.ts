import { Router } from "express";
import authRouter from "@src/routes/auth.routes";
import userRouter from "@src/routes/users.routes";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);

apiRouter.use("/users", userRouter);

export default apiRouter;
