import newsfeedRepository from "@src/repositories/newsfeed.repository";
import { Types } from "mongoose";

class NewsfeedService {
  public async pushNewsfeed(
    userIds: Types.ObjectId[],
    postId: Types.ObjectId,
    authorId: Types.ObjectId,
    groupId?: Types.ObjectId
  ) {
    await newsfeedRepository.pushNewsfeed(
      userIds,
      postId,
      authorId,
      new Date(),
      groupId
    );
  }
}

export default new NewsfeedService();
