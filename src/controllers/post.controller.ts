import { APIRequest, APIResponse } from "@src/types/api.types";

class PostController {
  public async createPost(req: APIRequest, res: APIResponse) {
    return res.status(200).json({ message: "Post created successfully" });
  }
}

export default new PostController();
