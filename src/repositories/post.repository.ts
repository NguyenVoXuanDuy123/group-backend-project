import { PostVisibilityLevel } from "@src/enums/post.enum";
import { validateDate } from "@src/helpers/validation";
import commentRepository from "@src/repositories/comment.repository";
import newsfeedRepository from "@src/repositories/newsfeed.repository";
import reactionRepository from "@src/repositories/reaction.repository";
import PostModel, { PostEditHistory, Post } from "@src/schema/post.schema";
import { ProjectionType, Types } from "mongoose";

class PostRepository {
  public async createPost(post: Partial<Post>) {
    return await PostModel.create(post);
  }

  public async checkPostExistsById(postId: string | Types.ObjectId) {
    return !!(await this.findPostById(postId, { _id: 1 }));
  }

  public async findPostById(
    postId: string | Types.ObjectId,
    projection: ProjectionType<Post> = {}
  ) {
    return await PostModel.findById(postId, projection).lean();
  }

  public async updatePostById(
    postId: string | Types.ObjectId,
    post: Partial<Post>
  ) {
    return await PostModel.findByIdAndUpdate(postId, { $set: post });
  }

  public async pushPostHistory(
    postId: string | Types.ObjectId,
    editHistory: Partial<PostEditHistory>
  ) {
    return await PostModel.findByIdAndUpdate(postId, {
      $push: { editHistory: editHistory },
    });
  }

  public async removePostById(postId: string | Types.ObjectId) {
    // Remove all post in newsfeed collection of friends or group members
    await newsfeedRepository.removeNewsfeedByPostId(postId);

    // Remove all comments on the post
    await commentRepository.removeCommentsByPostId(postId);

    // Remove all reactions on the post
    await reactionRepository.removeReactionsByTargetIds([
      new Types.ObjectId(postId),
    ]);

    // Remove the post
    return await PostModel.findByIdAndDelete(postId);
  }

  public async getPostsByUserIdOrGroupId(
    userId: string | undefined,
    groupId: string | undefined,
    visibilityLevel: PostVisibilityLevel[],
    beforeDate: string | undefined,
    limit: number | undefined
  ) {
    if (beforeDate) {
      //if date is not valid, method below will throw an error
      validateDate(beforeDate);
    }

    const posts = await PostModel.aggregate<Record<string, never>>([
      {
        $match: {
          $or: [
            {
              author: new Types.ObjectId(userId),
            },
            {
              group: new Types.ObjectId(groupId),
            },
          ],
          visibilityLevel: {
            $in: visibilityLevel,
          },
        },
      },
      {
        $match: {
          createdAt: {
            $lt: new Date(beforeDate ? beforeDate : new Date()),
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: limit || 10,
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          author: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
            username: 1,
          },
          content: 1,
          images: 1,
          visibilityLevel: 1,
          createdAt: 1,
          updatedAt: 1,
          editHistory: 1,
        },
      },
    ]);
    return posts;
  }
}

export default new PostRepository();
