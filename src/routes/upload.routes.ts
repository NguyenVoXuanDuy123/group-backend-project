import upload from "@src/configs/multer.config";
import EnvVars from "@src/constant/EnvVars";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { Router } from "express";

const uploadRouter = Router();

uploadRouter.post(
  "/",
  upload.single("image"),
  (req: APIRequest, res: APIResponse) => {
    if (!req.file) {
      throw new ApiError(ApiErrorCodes.NO_IMAGE_ATTACHED);
    }
    const fileName = req.file.filename;
    const imageUrl = `localhost:` + EnvVars.Port + `/images/${fileName}`;
    res.json({
      message: "File uploaded successfully",
      result: {
        url: imageUrl,
        size: req.file.size + " bytes",
        mimetype: req.file.mimetype,
      },
    });
  }
);

export default uploadRouter;
