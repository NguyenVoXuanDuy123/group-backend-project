import { PostVisibilityLevel } from "@src/enums/post.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateDate } from "@src/helpers/validation";
import commentRepository from "@src/repositories/comment.repository";
import reactionRepository from "@src/repositories/reaction.repository";
import PostModel, { IPostEditHistory, IPost } from "@src/schema/post.schema";
import UserModel from "@src/schema/user.schema";
import { ProjectionType, Types } from "mongoose";

class PostRepository {
  public async createPost(post: Partial<IPost>) {
    return await PostModel.create(post);
  }

  public async checkPostExistsById(postId: string | Types.ObjectId) {
    return !!(await this.findPostById(postId, { _id: 1 }));
  }

  public async findPostById(
    postId: string | Types.ObjectId,
    projection: ProjectionType<IPost> = {}
  ) {
    return await PostModel.findById(postId, projection).lean();
  }

  public async updatePostById(
    postId: string | Types.ObjectId,
    post: Partial<IPost>
  ) {
    return await PostModel.findByIdAndUpdate(postId, { $set: post });
  }

  public async pushPostHistory(
    postId: string | Types.ObjectId,
    editHistory: Partial<IPostEditHistory>
  ) {
    return await PostModel.findByIdAndUpdate(postId, {
      $push: { editHistory: editHistory },
    });
  }

  public async removePostById(postId: string | Types.ObjectId) {
    // Remove all comments on the post
    await commentRepository.removeCommentsByPostId(postId);

    // Remove all reactions on the post
    await reactionRepository.removeReactionsByTargetIds([
      new Types.ObjectId(postId),
    ]);

    // Remove the post
    return await PostModel.findByIdAndDelete(postId);
  }

  public async getNewFeeds(
    userId: string,
    beforeDate: string | undefined,
    limit: number | undefined
  ) {
    if (beforeDate) {
      //if date is not valid, method below will throw an error
      validateDate(beforeDate);
    }

    // Default limit is 10
    if (!limit) {
      limit = 10;
    }

    const user = await UserModel.findById(userId, {
      friends: 1,
      groups: 1,
    }).lean();

    if (!user) {
      throw new ApiError(ApiErrorCodes.USER_NOT_FOUND);
    }
    const friendIds = user.friends;
    const groupIds = user.groups;

    const feeds = await PostModel.aggregate<Record<string, never>>([
      {
        $match: {
          $or: [
            {
              $and: [
                {
                  author: {
                    $in: [...friendIds, user._id],
                  },
                  visibilityLevel: {
                    $ne: "group",
                  },
                },
              ],
            },
            {
              group: {
                $in: groupIds,
              },
            },
          ],
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
        $limit: limit,
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
        $lookup: {
          from: "groups",
          localField: "group",
          foreignField: "_id",
          as: "group",
        },
      },
      {
        $unwind: {
          path: "$group",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          group: {
            $cond: {
              if: {
                $eq: ["$group", null],
              },
              then: null,
              else: {
                name: "$group.name",
                _id: "$group._id",
                admin: "$group.admin",
              },
            },
          },
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
    return feeds;
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
