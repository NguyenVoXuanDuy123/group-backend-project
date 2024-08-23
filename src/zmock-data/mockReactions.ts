/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { faker } from "@faker-js/faker";
import { ReactionTargetType, ReactionType } from "@src/enums/post.enum";
import CommentModel from "@src/schema/comment.schema";
import PostModel from "@src/schema/post.schema";
import ReactionModel, { IReaction } from "@src/schema/reaction.schema";
import UserModel from "@src/schema/user.schema";
import { randomDate } from "@src/zmock-data/helper";
import { Document, Types } from "mongoose";

export const mockReactions = async () => {
  const users = await UserModel.find();
  const reactions: (Document<unknown, object, IReaction> &
    IReaction &
    Required<{ _id: Types.ObjectId }>)[] = [];
  const reactionTypes = Object.values(ReactionType);

  for (const user of users) {
    // Fetch posts from friends and groups
    const friendPosts = await PostModel.find({ author: { $in: user.friends } });
    const groupPosts = await PostModel.find({ group: { $in: user.groups } });
    const postsToReactOn = [...friendPosts, ...groupPosts];

    for (const post of postsToReactOn) {
      // Check if the user has already reacted to the post
      const existingReaction = await ReactionModel.findOne({
        user: user._id,
        target: post._id,
        target_type: ReactionTargetType.POST,
      });

      if (!existingReaction) {
        if (faker.number.float({ min: 0, max: 1 }) < 0.8) {
          const randomReaction = faker.helpers.arrayElement(reactionTypes);
          const date = randomDate(post.created_at);

          const reaction = new ReactionModel({
            type: randomReaction,
            user: user._id,
            target: post._id,
            target_type: ReactionTargetType.POST,
            created_at: date,
            updated_at: date,
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
                target_type: ReactionTargetType.COMMENT,
              });

              if (!existingCommentReaction) {
                const randomReaction =
                  faker.helpers.arrayElement(reactionTypes);
                const date = randomDate(comment.created_at);

                const commentReaction = new ReactionModel({
                  type: randomReaction,
                  user: user._id,
                  target: comment._id,
                  target_type: ReactionTargetType.COMMENT,
                  created_at: date,
                  updated_at: date,
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
        target_type: ReactionTargetType.POST,
      });

      if (!existingReaction) {
        const randomReaction = faker.helpers.arrayElement(reactionTypes);
        const date = randomDate(post.created_at);

        const reaction = new ReactionModel({
          type: randomReaction,
          user: user._id,
          target: post._id,
          target_type: ReactionTargetType.POST,
          created_at: date,
          updated_at: date,
        });

        await reaction.save(); // Save the reaction to the database
        reactions.push(reaction);
      }
    }
  }
};
