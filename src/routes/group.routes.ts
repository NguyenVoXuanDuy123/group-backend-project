import groupController from "@src/controllers/group.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import { createGroupValidator } from "@src/middlewares/group.middleware";
import { AuthenticationValidator } from "@src/middlewares/util.middleware";
import { Router } from "express";

const groupRouter = Router();

groupRouter.post(
  "/",
  wrapRequestHandler(createGroupValidator),
  wrapRequestHandler(AuthenticationValidator),
  groupController.createGroup
);

groupRouter.patch(
  "/:groupId",
  wrapRequestHandler(AuthenticationValidator),
  groupController.updateGroup
);

groupRouter.get(
  "/:groupId",
  wrapRequestHandler(AuthenticationValidator),
  groupController.getGroupById
);

groupRouter.post(
  "/requests",
  wrapRequestHandler(AuthenticationValidator),
  groupController.sendGroupRequest
);

export default groupRouter;
