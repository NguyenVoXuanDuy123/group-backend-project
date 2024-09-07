import searchController from "@src/controllers/search.controller";
import { wrapRequestHandler } from "@src/helpers/handlers";
import { Router } from "express";

const searchRouter = Router();

searchRouter.get("", wrapRequestHandler(searchController.search));

export default searchRouter;
