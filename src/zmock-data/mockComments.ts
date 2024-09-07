import { faker } from "@faker-js/faker";
import { SEED } from "@src/constant/dir";
import { NotificationType } from "@src/enums/notification.enums";
import { PostVisibilityLevel } from "@src/enums/post.enum";
import CommentModel, { Comment } from "@src/schema/comment.schema";

import PostModel from "@src/schema/post.schema";
import UserModel from "@src/schema/user.schema";
import notificationService from "@src/services/notification.service";
import { randomDate } from "@src/zmock-data/helper";
import { Document, Types } from "mongoose";

export const mockComments = async () => {
  console.log("Mocking comments...");
  const users = await UserModel.find();
  const comments: (Document<unknown, object, Comment> &
    Comment & { _id: Types.ObjectId })[] = [];
  faker.seed(SEED + 4);
  for (const user of users) {
    // Get all friends' posts
    const friendPosts = await PostModel.find({
      author: { $in: user.friends },
      visibilityLevel: { $ne: PostVisibilityLevel.GROUP }, // Exclude posts with visibility level 'group'
    });
    // Get all posts from groups the user is a member of
    const groupPosts = await PostModel.find({ group: { $in: user.groups } });

    const userPosts = await PostModel.find({ author: user._id });

    const postsToCommentOn = [...friendPosts, ...groupPosts, ...userPosts];

    // 50% chance to comment on friends' or group posts
    postsToCommentOn.forEach((post) => {
      if (faker.datatype.boolean()) {
        const date = randomDate(post.createdAt);

        comments.push(
          new CommentModel({
            _id: faker.database.mongodbObjectId(),
            content: faker.lorem.sentence(),
            author: user._id,
            post: post._id,
            createdAt: date,
            updatedAt: date,
          })
        );
      }
    });

    // Randomly select 10 public posts and comment on them
    const publicPosts = await PostModel.aggregate([
      { $match: { visibilityLevel: "public" } },
      { $sample: { size: 10 } },
    ]);

    publicPosts.forEach((post) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const date = randomDate(post.createdAt);

      comments.push(
        new CommentModel({
          _id: faker.database.mongodbObjectId(),
          content: faker.lorem.sentence(),
          author: user._id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          post: post._id,
          createdAt: date,
          updatedAt: date,
        })
      );
    });
  }

  for (const comment of comments) {
    const post = await PostModel.findById(comment.post);
    await notificationService.pushNotification({
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      receiver: post!.author,
      sender: comment.author,
      type: NotificationType.COMMENT,
      isRead: true,
      relatedEntity: comment._id,
    });
    await comment.save();
  }

  console.log("End mocking comments");
};
