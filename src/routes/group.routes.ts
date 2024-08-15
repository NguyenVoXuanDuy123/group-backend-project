import groupController from "@src/controllers/group.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import {
  createGroupValidator,
  sendGroupJoinRequestValidator,
} from "@src/middlewares/group.middleware";
import { changeFriendRequestStatusValidator } from "@src/middlewares/user.middleware";

import { Router } from "express";

const groupRouter = Router();

groupRouter.post(
  "/",
  wrapRequestHandler(createGroupValidator),
  wrapRequestHandler(groupController.createGroup)
);

groupRouter.patch("/:groupId", wrapRequestHandler(groupController.updateGroup));

groupRouter.get("/:groupId", wrapRequestHandler(groupController.getGroupById));

groupRouter.get(
  "/:groupId/members",
  wrapRequestHandler(groupController.getGroupMembers)
);

groupRouter.post(
  "/requests",
  wrapRequestHandler(sendGroupJoinRequestValidator),
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

export default groupRouter;
