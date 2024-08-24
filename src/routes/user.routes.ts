import { Router } from "express";
import userController from "@src/controllers/user.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import {
  changeFriendRequestStatusValidator,
  changeUserStatusValidator,
  removeFriendRequestValidator,
} from "@src/middlewares/user.middleware";
import upload from "@src/configs/multer.config";

const userRouter = Router();

// Global authentication

// Profile
userRouter.get("/profile/me", wrapRequestHandler(userController.getMe));
userRouter.patch("/profile/me", wrapRequestHandler(userController.updateMe));

userRouter.patch(
  "/profile/me/avatar",
  upload.single("avatar"),
  wrapRequestHandler(userController.updateAvatar)
);

userRouter.delete(
  "/profile/me/avatar",
  wrapRequestHandler(userController.removeAvatar)
);

userRouter.get("/profile/:userId", wrapRequestHandler(userController.getUser));

// Friends
userRouter.get("/me/friends", wrapRequestHandler(userController.getMyFriends));
userRouter.get(
  "/me/friends/pending-requests",
  wrapRequestHandler(userController.getMyPendingReceivedFriendRequests)
);
userRouter.get(
  "/:userId/friends",
  wrapRequestHandler(userController.getFriends)
);
userRouter.delete(
  "/me/friends/:friendId",
  wrapRequestHandler(removeFriendRequestValidator),
  wrapRequestHandler(userController.removeFriend)
);
userRouter.post(
  "/me/friends/:userId/requests",
  wrapRequestHandler(userController.sendFriendRequest)
);
userRouter.patch(
  "/me/friends/requests/:friendRequestId",
  wrapRequestHandler(changeFriendRequestStatusValidator),
  wrapRequestHandler(userController.changeFriendRequestStatus)
);

// Groups
userRouter.get("/me/groups", wrapRequestHandler(userController.getMyGroups));
userRouter.get(
  "/:userId/groups",
  wrapRequestHandler(userController.getUserGroups)
);
userRouter.delete(
  "/me/groups/:groupId",
  wrapRequestHandler(userController.leaveGroup)
);

// Posts

userRouter.get("/me/feeds", wrapRequestHandler(userController.getFeeds));

// userRouter.get("/me/posts", wrapRequestHandler(userController.getMyPosts));

userRouter.get(
  "/:userId/posts",
  wrapRequestHandler(userController.getUserPosts)
);

userRouter.patch(
  "/:userId/status",
  wrapRequestHandler(changeUserStatusValidator),
  wrapRequestHandler(userController.changeUserStatus)
);

export default userRouter;
