import NewsfeedModel from "@src/schema/newsfeed.schema";
import { PostDetailType } from "@src/types/post.types";
import { Types } from "mongoose";

class NewsfeedRepository {
  public async pushNewsfeed(
    ownerIds: Types.ObjectId[],
    postId: Types.ObjectId | string,
    authorId: Types.ObjectId,
    // When the post is created in a group, the groupId is also passed
    createdAt: Date,
    groupId?: Types.ObjectId
  ) {
    await Promise.all(
      ownerIds.map(
        async (ownerId) =>
          await NewsfeedModel.create({
            owner: ownerId,
            post: postId,
            author: authorId,
            ...(groupId && { group: groupId }),
            createdAt,
            updatedAt: createdAt,
          })
      )
    );
  }

  public async removeNewsfeedByPostId(postId: string | Types.ObjectId) {
    await NewsfeedModel.deleteMany({ post: postId });
  }

  public async removeNewsfeedByOwnerIdAndAuthorId(
    ownerId: string | Types.ObjectId,
    authorId: string | Types.ObjectId
  ) {
    await NewsfeedModel.deleteMany({ owner: ownerId, author: authorId });
  }

  public async removeNewsfeedByOwnerIdAndGroupId(
    ownerId: string | Types.ObjectId,
    groupId: string | Types.ObjectId
  ) {
    await NewsfeedModel.deleteMany({ owner: ownerId, group: groupId });
  }

  public async getNewsfeed(
    ownerId: string | Types.ObjectId,
    beforeDate: string | undefined,
    limit: number | undefined
  ) {
    const feeds = await NewsfeedModel.aggregate<PostDetailType>([
      {
        $match: {
          owner: new Types.ObjectId(ownerId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "post",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: "$post",
      },
      {
        $match: {
          createdAt: {
            $lt: new Date(beforeDate || new Date()),
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
          localField: "post.author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $lookup: {
          from: "groups",
          localField: "post.group",
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
        $project: {
          _id: "$post._id",
          content: "$post.content",
          images: "$post.images",
          visibilityLevel: "$post.visibilityLevel",
          editHistory: "$post.editHistory",
          createdAt: "$post.createdAt",
          updatedAt: "$post.updatedAt",
          author: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            avatar: 1,
            username: 1,
          },
          group: {
            _id: 1,
            name: 1,
          },
        },
      },
    ]);

    return feeds;
  }
}

export default new NewsfeedRepository();
