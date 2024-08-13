import { RequestHandler, Router } from "express";
import { wrapRequestHandler } from "@src/helpers/handlers";

import passport from "passport";
import {
  loginValidator,
  registerValidator,
} from "@src/middlewares/auth.middleware";
import authController from "@src/controllers/auth.controller";
const authRouter = Router();

authRouter.post(
  "/register",
  wrapRequestHandler(registerValidator),
  wrapRequestHandler(authController.register)
);

authRouter.post(
  "/login",
  wrapRequestHandler(loginValidator),
  passport.authenticate("local") as RequestHandler,
  wrapRequestHandler(authController.login)
);

authRouter.post("/logout", wrapRequestHandler(authController.logout));

authRouter.get("/test", (req, res) => {
  console.log(req.isAuthenticated());
  console.log(req.cookies);
  console.log(req.user);
  res.json({ isAuthen: req.isAuthenticated(), user: req.user });
});

export default authRouter;
