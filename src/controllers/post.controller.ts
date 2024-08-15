import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import postService from "@src/services/post.service";
import { APIRequest, APIResponse } from "@src/types/api.types";
import { CreatePostRequestType } from "@src/types/post.types";
import { UserSessionType } from "@src/types/user.types";

class PostController {
  public async createPost(
    req: APIRequest<CreatePostRequestType>,
    res: APIResponse
  ) {
    const { _id } = req.user as UserSessionType;
    await postService.createPost(_id, req.body);
    res.status(HttpStatusCodes.OK).json({
      message: "Create post successful",
    });
  }

  public async reactToPost(req: APIRequest, res: APIResponse) {
    const { _id } = req.user as UserSessionType;
    await postService.reactToPost(_id, req.params.postId);
    res.status(HttpStatusCodes.OK).json({
      message: "React to post successful",
    });
  }
}

export default new PostController();
