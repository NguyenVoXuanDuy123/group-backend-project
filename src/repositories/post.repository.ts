import { PostVisibilityLevel } from "@src/enums/post.enum";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { validateDate } from "@src/helpers/validation";
import CommentModel from "@src/schema/comment.schema";
import PostModel, { IPostEditHistory, IPost } from "@src/schema/post.schema";
import ReactionModel from "@src/schema/reaction.schema";
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
    edit_history: Partial<IPostEditHistory>
  ) {
    return await PostModel.findByIdAndUpdate(postId, {
      $push: { edit_history },
    });
  }

  public async deletePostById(postId: string | Types.ObjectId) {
    // Delete all comments on the post
    await CommentModel.deleteMany({ post: postId });

    // Delete all reactions on the post
    await ReactionModel.deleteMany({ target: postId });

    // Delete the post
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
                    $in: [friendIds, user._id],
                  },
                  visibility_level: {
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
          created_at: {
            $lt: new Date(beforeDate ? beforeDate : new Date()),
          },
        },
      },
      {
        $sort: {
          created_at: -1,
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
              },
            },
          },
          author: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            avatar: 1,
            username: 1,
          },
          content: 1,
          images: 1,
          visibility_level: 1,
          created_at: 1,
          updated_at: 1,
          edit_history: 1,
        },
      },
    ]);
    return feeds;
  }

  public async getPostsByUserIdOrGroupId(
    userId: string | undefined,
    groupId: string | undefined,
    visibility_level: PostVisibilityLevel[],
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
          visibility_level: {
            $in: visibility_level,
          },
        },
      },
      {
        $match: {
          created_at: {
            $lt: new Date(beforeDate ? beforeDate : new Date()),
          },
        },
      },
      {
        $sort: {
          created_at: -1,
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
        $unwind: {
          path: "$author",
        },
      },
      {
        $project: {
          // if visibility level is group, we need to populate group details
          group: {
            $cond: {
              if: {
                $eq: ["$group", null],
              },
              then: null,
              else: {
                name: "$group.name",
                _id: "$group._id",
              },
            },
          },
          author: {
            _id: 1,
            first_name: 1,
            last_name: 1,
            avatar: 1,
            username: 1,
          },
          content: 1,
          images: 1,
          visibility_level: 1,
          created_at: 1,
          updated_at: 1,
          edit_history: 1,
        },
      },
    ]);
    return posts;
  }
}

export default new PostRepository();
