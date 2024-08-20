import groupController from "@src/controllers/group.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import {
  changeGroupStatusValidator,
  createGroupValidator,
  updateGroupValidator,
} from "@src/middlewares/group.middleware";
import { changeFriendRequestStatusValidator } from "@src/middlewares/user.middleware";

import { Router } from "express";

const groupRouter = Router();

groupRouter.post(
  "/",
  wrapRequestHandler(createGroupValidator),
  wrapRequestHandler(groupController.createGroup)
);

groupRouter.patch(
  "/:groupId",
  wrapRequestHandler(updateGroupValidator),
  wrapRequestHandler(groupController.updateGroup)
);

groupRouter.get("/:groupId", wrapRequestHandler(groupController.getGroupById));

// this api is not required
// groupRouter.delete(
//   "/:groupId",
//   wrapRequestHandler(groupController.removeGroup)
// );

groupRouter.get(
  "/:groupId/members",
  wrapRequestHandler(groupController.getGroupMembers)
);

groupRouter.post(
  "/:groupId/requests",
  wrapRequestHandler(groupController.sendGroupJoinRequest)
);

groupRouter.get(
  "/:groupId/pending-requests",
  wrapRequestHandler(groupController.getPendingGroupJoinRequests)
);

groupRouter.patch(
  "/requests/:requestId",
  wrapRequestHandler(changeFriendRequestStatusValidator),
  wrapRequestHandler(groupController.changeGroupJoinRequestStatus)
);

groupRouter.delete(
  "/:groupId/members/:memberId",
  wrapRequestHandler(groupController.removeMemberFromGroup)
);

// groupRouter.get(
//   "/:groupId/posts",
//   wrapRequestHandler(groupController.getGroupPosts)
// );

//Only admin can change group status

groupRouter.patch(
  "/:groupId/status",
  wrapRequestHandler(changeGroupStatusValidator),
  wrapRequestHandler(groupController.changeGroupStatus)
);

export default groupRouter;
