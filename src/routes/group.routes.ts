import groupController from "@src/controllers/group.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import {
  createGroupValidator,
  sendGroupJoinRequestValidator,
} from "@src/middlewares/group.middleware";
import {
  changeFriendRequestStatusValidator,
  removeGroupMemberValidator,
} from "@src/middlewares/user.middleware";
import { AuthenticationValidator } from "@src/middlewares/util.middleware";
import { Router } from "express";

const groupRouter = Router();

groupRouter.post(
  "/",
  wrapRequestHandler(createGroupValidator),
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(groupController.createGroup)
);

groupRouter.patch(
  "/:groupId",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(groupController.updateGroup)
);

groupRouter.get(
  "/:groupId",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(groupController.getGroupById)
);

groupRouter.get(
  "/:groupId/members",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(groupController.getGroupMembers)
);

groupRouter.post(
  "/requests",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(sendGroupJoinRequestValidator),
  wrapRequestHandler(groupController.sendGroupRequest)
);

groupRouter.patch(
  "/requests/:requestId",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(changeFriendRequestStatusValidator),
  wrapRequestHandler(groupController.changeGroupRequestStatus)
);

groupRouter.delete(
  "/:groupId/members/:memberId",
  wrapRequestHandler(AuthenticationValidator),
  wrapRequestHandler(groupController.removeMemberFromGroup)
);

export default groupRouter;
