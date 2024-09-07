/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { faker } from "@faker-js/faker";
import { SEED } from "@src/constant/dir";
import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enum";
import CommentModel from "@src/schema/comment.schema";
import PostModel from "@src/schema/post.schema";
import ReactionModel, { Reaction } from "@src/schema/reaction.schema";
import UserModel from "@src/schema/user.schema";
import { randomDate } from "@src/zmock-data/helper";
import { Document, Types } from "mongoose";

export const mockReactions = async () => {
  console.log("Mocking reactions...");
  faker.seed(SEED + 5);
  const users = await UserModel.find();
  const reactions: (Document<unknown, object, Reaction> &
    Reaction &
    Required<{ _id: Types.ObjectId }>)[] = [];
  const reactionTypes = [
    ...Array(40).fill(ReactionType.LIKE), // 40% like
    ...Array(40).fill(ReactionType.LOVE), // 40% love
    ...Array(15).fill(ReactionType.HAHA), // 15% haha
    ...Array(5).fill(ReactionType.ANGRY), // 5% angry
  ];

  for (const user of users) {
    // Fetch posts from friends and groups
    const friendPosts = await PostModel.find({
      author: { $in: user.friends },
      visibilityLevel: { $ne: PostVisibilityLevel.GROUP }, // Exclude posts with visibility level 'group'
    });
    // Get all posts from groups the user is a member of
    const groupPosts = await PostModel.find({ group: { $in: user.groups } });

    const userPosts = await PostModel.find({ author: user._id });

    const postsToReactOn = [...friendPosts, ...groupPosts, ...userPosts];

    for (const post of postsToReactOn) {
      // Check if the user has already reacted to the post
      const existingReaction = await ReactionModel.findOne({
        user: user._id,
        target: post._id,
        targetType: ReactionTargetType.POST,
      });

      if (!existingReaction) {
        // 70% that user will react to the post
        if (faker.number.float({ min: 0, max: 1 }) < 0.7) {
          const randomReaction = faker.helpers.arrayElement(reactionTypes);
          const date = randomDate(post.createdAt);

          const reaction = new ReactionModel({
            _id: faker.database.mongodbObjectId(),
            type: randomReaction,
            user: user._id,
            target: post._id,
            targetType: ReactionTargetType.POST,
            createdAt: date,
            updatedAt: date,
          });

          await reaction.save(); // Save the reaction to the database
          reactions.push(reaction);

          // 50% chance to react to 1 or 2 comments on this post
          if (faker.datatype.boolean()) {
            const randomComments = await CommentModel.aggregate([
              { $match: { post: post._id } },
              { $sample: { size: 2 } }, // Randomly pick up to 2 comments
            ]);

            for (const comment of randomComments) {
              const existingCommentReaction = await ReactionModel.findOne({
                user: user._id,
                target: comment._id,
                targetType: ReactionTargetType.COMMENT,
              });

              if (!existingCommentReaction) {
                const randomReaction =
                  faker.helpers.arrayElement(reactionTypes);
                const date = randomDate(comment.createdAt);

                const commentReaction = new ReactionModel({
                  _id: faker.database.mongodbObjectId(),
                  type: randomReaction,
                  user: user._id,
                  target: comment._id,
                  targetType: ReactionTargetType.COMMENT,
                  createdAt: date,
                  updatedAt: date,
                });

                await commentReaction.save(); // Save the comment reaction to the database
                reactions.push(commentReaction);
              }
            }
          }
        }
      }
    }

    // Randomly select 20 public posts and react to them
    const randomPublicPosts = await PostModel.aggregate([
      { $match: { visibilityLevel: "public" } }, // Filter for public posts
      { $sample: { size: 20 } }, // Randomly pick 20 posts
    ]);

    for (const post of randomPublicPosts) {
      const existingReaction = await ReactionModel.findOne({
        user: user._id,
        target: post._id,
        targetType: ReactionTargetType.POST,
      });

      if (!existingReaction) {
        const randomReaction = faker.helpers.arrayElement(reactionTypes);
        const date = randomDate(post.createdAt);

        const reaction = new ReactionModel({
          _id: faker.database.mongodbObjectId(),
          type: randomReaction,
          user: user._id,
          target: post._id,
          targetType: ReactionTargetType.POST,
          createdAt: date,
          updatedAt: date,
        });

        await reaction.save(); // Save the reaction to the database
        reactions.push(reaction);
      }
    }
  }
  console.log("Reactions have been mocked!");
};
