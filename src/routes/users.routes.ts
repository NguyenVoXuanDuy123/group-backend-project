import { Router } from "express";
import userController from "@src/controllers/user.controller";
import { wrapRequestHandler } from "@src/util/handlers";
import { AuthenticationValidation } from "@src/middlewares/util.middleware";
import {
  changeFriendRequestStatusValidation,
  removeFriendRequestValidation,
} from "@src/middlewares/user.middleware";

const userRouter = Router();

userRouter.get(
  "/me",
  wrapRequestHandler(AuthenticationValidation),
  wrapRequestHandler(userController.getMe)
);

userRouter.patch(
  "/me",
  wrapRequestHandler(AuthenticationValidation),
  wrapRequestHandler(userController.updateMe)
);

userRouter.get(
  "/me/friends",
  wrapRequestHandler(AuthenticationValidation),
  wrapRequestHandler(userController.getFriends)
);

userRouter.delete(
  "/me/friends/:friendId",
  wrapRequestHandler(AuthenticationValidation),
  wrapRequestHandler(removeFriendRequestValidation),
  wrapRequestHandler(userController.removeFriend)
);

userRouter.post(
  "/me/friends/requests",
  wrapRequestHandler(AuthenticationValidation),
  wrapRequestHandler(userController.sendFriendRequest)
);

userRouter.patch(
  "/me/friends/requests/:friendRequestId",
  wrapRequestHandler(AuthenticationValidation),
  wrapRequestHandler(changeFriendRequestStatusValidation),
  wrapRequestHandler(userController.changeFriendRequestStatus)
);
// **** Export default **** //

export default userRouter;
