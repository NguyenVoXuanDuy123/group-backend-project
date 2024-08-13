import { Router } from "express";
import userController from "@src/controllers/user.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import { AuthenticationValidator } from "@src/middlewares/util.middleware";
import {
  changeFriendRequestStatusValidator,
  removeFriendRequestValidator,
} from "@src/middlewares/user.middleware";

const userRouter = Router();

userRouter.get(
  "/profile/me",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(userController.getMe)
);

userRouter.patch(
  "/profile/me",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(userController.updateMe)
);

userRouter.get(
  "/profile/:userId",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(userController.getUser)
);

userRouter.get(
  "/me/friends",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(userController.getMyFriends)
);

userRouter.get(
  "/me/friends/pending-received-requests",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(userController.getMyPendingReceivedFriendRequests)
);

userRouter.get(
  "/:userId/friends",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(userController.getFriends)
);

userRouter.delete(
  "/me/friends/:friendId",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(removeFriendRequestValidator),
  wrapRequestHandler(userController.removeFriend)
);

userRouter.post(
  "/me/friends/requests",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(userController.sendFriendRequest)
);

userRouter.patch(
  "/me/friends/requests/:friendRequestId",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(changeFriendRequestStatusValidator),
  wrapRequestHandler(userController.changeFriendRequestStatus)
);

// **** Export default **** //

export default userRouter;
