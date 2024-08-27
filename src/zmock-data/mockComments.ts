import { faker } from "@faker-js/faker";
import { PostVisibilityLevel } from "@src/enums/post.enum";
import CommentModel, { IComment } from "@src/schema/comment.schema";

import PostModel from "@src/schema/post.schema";
import UserModel from "@src/schema/user.schema";
import { randomDate } from "@src/zmock-data/helper";
import { Document, Types } from "mongoose";

export const mockComments = async () => {
  console.log("Mocking comments...");
  const users = await UserModel.find();
  const comments: (Document<unknown, object, IComment> &
    IComment & { _id: Types.ObjectId })[] = [];

  for (const user of users) {
    // Get all friends' posts
    const friendPosts = await PostModel.find({
      author: { $in: user.friends },
      visibility_level: { $ne: PostVisibilityLevel.GROUP }, // Exclude posts with visibility level 'group'
    });
    // Get all posts from groups the user is a member of
    const groupPosts = await PostModel.find({ group: { $in: user.groups } });

    const userPosts = await PostModel.find({ author: user._id });

    const postsToCommentOn = [...friendPosts, ...groupPosts, ...userPosts];

    // 50% chance to comment on friends' or group posts
    postsToCommentOn.forEach((post) => {
      if (faker.datatype.boolean()) {
        const date = randomDate(post.created_at);

        comments.push(
          new CommentModel({
            content: faker.lorem.sentence(),
            author: user._id,
            post: post._id,
            created_at: date,
            updated_at: date,
          })
        );
      }
    });

    // Randomly select 10 public posts and comment on them
    const publicPosts = await PostModel.aggregate([
      { $match: { visibility_level: "public" } },
      { $sample: { size: 10 } },
    ]);

    publicPosts.forEach((post) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const date = randomDate(post.created_at);

      comments.push(
        new CommentModel({
          content: faker.lorem.sentence(),
          author: user._id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          post: post._id,
          created_at: date,
          updated_at: date,
        })
      );
    });
  }

  for (const comment of comments) {
    await comment.save();
  }

  console.log("End mocking comments");
};
