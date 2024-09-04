import { GroupVisibilityLevel } from "@src/enums/group.enums";
import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enum";
import { UserRole } from "@src/enums/user.enums";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

import { removeNullValues } from "@src/helpers/removeNullValue";
import commentRepository from "@src/repositories/comment.repository";
import groupRepository from "@src/repositories/group.repository";
import postRepository from "@src/repositories/post.repository";
import reactionRepository from "@src/repositories/reaction.repository";
import userRepository from "@src/repositories/user.repository";
import { IPostEditHistory, IPost } from "@src/schema/post.schema";
import commentService from "@src/services/comment.service";
import reactionService from "@src/services/reaction.service";
import { CreateCommentRequestType } from "@src/types/comment.types";
import {
  CreatePostRequestType,
  UpdatePostRequestType,
} from "@src/types/post.types";
import { PaginationQueryType } from "@src/types/util.types";
import { Types } from "mongoose";

class PostService {
  public async createPost(
    authorID: string,
    createPostRequest: CreatePostRequestType
  ) {
    if (createPostRequest.visibilityLevel === PostVisibilityLevel.GROUP) {
      const group = await groupRepository.findGroupById(
        createPostRequest.groupId!
      );
      if (!group) {
        throw new ApiError(ApiErrorCodes.GROUP_NOT_FOUND);
      }

      // only group members can create a post in the group
      if (!group.members.some((member) => member.equals(authorID))) {
        throw new ApiError(ApiErrorCodes.USER_NOT_IN_GROUP);
      }
    }

    const post: Partial<IPost> = {
      author: new Types.ObjectId(authorID),
      group: createPostRequest.groupId
        ? new Types.ObjectId(createPostRequest.groupId)
        : null,
      visibilityLevel: createPostRequest.visibilityLevel,
      content: createPostRequest.content,
      images: createPostRequest.images || [],
    };
    const { _id } = await postRepository.createPost(post);

    return this.getPostById(_id, authorID, UserRole.USER, true);
  }

  public async getPostById(
    postId: string | Types.ObjectId,
    senderId: string,
    senderRole: UserRole = UserRole.USER,
    // if internal call = true, we can skip some checks to improve performance
    isInternalCall = false
  ) {
    let group = null;
    const post = await postRepository.findPostById(postId, {
      __v: 0,
    });

    if (!post) {
      throw new ApiError(ApiErrorCodes.POST_NOT_FOUND);
    }
    const { author: authorId, group: groupId, ...rest } = post;

    // check when visibility level is group
    if (post.visibilityLevel === PostVisibilityLevel.GROUP) {
      if (!groupId) {
        // there is no way when a post has a group visibility level,
        // but group is null
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }
      group = await groupRepository.findGroupById(groupId, {
        name: 1,
        visibilityLevel: 1,
        members: 1,
      });

      if (!group) {
        // there is no way when a post has a group visibility level,
        // but the group cannot be found
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }
      /**
       *
       * in case visibilityLevel = 'group'
       * user only can see the post if one of the following conditions is met:
       * 1. user role is site-admin
       * 2. group is public
       * 3. user is a member of the group (group admin is also a member)
       *
       */
      if (!isInternalCall) {
        const canSeePost =
          senderRole === UserRole.ADMIN ||
          group.visibilityLevel === GroupVisibilityLevel.PUBLIC ||
          group.members.some((member) => member.equals(senderId));

        if (!canSeePost) {
          throw new ApiError(ApiErrorCodes.POST_NOT_VISIBLE_TO_USER);
        }
      }
    }

    // check when visibility level is friends
    const author = await userRepository.getUserById(authorId, {
      _id: 1,
      firstName: 1,
      lastName: 1,
      friends: 1,
      username: 1,
      avatar: 1,
    });

    if (post.visibilityLevel === PostVisibilityLevel.FRIEND) {
      if (!author) {
        // there is no way the post exists without an author
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }

      let canSeePost = false;

      /**
       * In case visibilityLevel = friend
       * user only can see the post if one of the following conditions is met:
       * 1. user role is site-admin
       * 2. user is the author of the post
       * 3. user is a friend of the author
       */

      if (!isInternalCall) {
        canSeePost =
          author._id.equals(senderId) ||
          senderRole === UserRole.ADMIN ||
          author.friends.some((friend) => friend.equals(senderId));
        if (!canSeePost) {
          throw new ApiError(ApiErrorCodes.POST_NOT_VISIBLE_TO_USER);
        }
      }
    }

    const { reactionCount, reactionSummary, userReaction, commentCount } =
      await this.getPostOrCommentInfo(rest._id, senderId);

    // if the post is public, no need to check anything
    return {
      ...rest,
      reactionCount,
      reactionSummary,
      commentCount,
      group: group && {
        _id: group._id,
        name: group.name,
      },
      author: author && {
        _id: author._id,
        firstName: author.firstName,
        lastName: author.lastName,
        username: author.username,
        avatar: author.avatar,
      },
      userReaction,
    };
  }

  public async updatePost(
    senderId: string,
    senderRole: UserRole,
    postID: string,
    updatePostRequest: UpdatePostRequestType
  ) {
    // if the post does not exist, or not visible to the sender
    // the method below will throw an error
    await this.getPostById(postID, senderId, senderRole);

    // if it comes here, post 100% exists, so we can safely cast it to IPost
    const post = (await postRepository.findPostById(postID, {
      author: 1,
      content: 1,
      images: 1,
      visibilityLevel: 1,
    })) as IPost;

    //if the post visibility level is group, the visibility level cannot be changed
    if (post.visibilityLevel === PostVisibilityLevel.GROUP) {
      throw new ApiError(ApiErrorCodes.INVALID_UPDATE_POST_visibilityLevel);
    }

    // only the author of the post can update the post
    if (!post.author.equals(senderId)) {
      throw new ApiError(ApiErrorCodes.UPDATE_POST_FORBIDDEN);
    }

    // if the content or images are changed, we need to push the history
    if (
      post.content !== updatePostRequest.content ||
      post.images.toString() !== updatePostRequest.images?.toString()
    ) {
      const postHistory: Partial<IPostEditHistory> = {
        content: post.content,
        images: post.images,
        editedAt: new Date(),
      };
      await postRepository.pushPostHistory(postID, postHistory);
    }

    await postRepository.updatePostById(
      postID,
      removeNullValues({
        content: updatePostRequest.content,
        images: updatePostRequest.images,
        visibilityLevel: updatePostRequest.visibilityLevel,
      })
    );

    return this.getPostById(postID, senderId, UserRole.USER, true);
  }

  public async removePost(
    senderId: string,
    postID: string,
    senderRole: UserRole
  ) {
    const post = await postRepository.findPostById(postID, {
      group: 1,
      visibilityLevel: 1,
      author: 1,
    });

    if (!post) {
      throw new ApiError(ApiErrorCodes.POST_NOT_FOUND);
    }
    /**
     * sender can only remove post if one of the following conditions is met:
     * 1. sender is the author of the post
     * 2. sender is an site admin
     * 3. sender is the admin of the group where the post is posted
     */

    if (post.author.equals(senderId) || senderRole === UserRole.ADMIN) {
      await postRepository.removePostById(postID);
      return;
    }

    // if the post visibility level is group, admin of the group can remove the post
    if (post.visibilityLevel === PostVisibilityLevel.GROUP) {
      if (!post.group) {
        // there is no way when a post has a group visibility level,
        // but group is null
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }

      const group = await groupRepository.findGroupById(post.group, {
        admin: 1,
      });

      if (!group) {
        // there is no way when a post has a group visibility level,
        // but the group cannot be found
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }

      if (group.admin.equals(senderId)) {
        await postRepository.removePostById(postID);
        return;
      }
    }

    throw new ApiError(ApiErrorCodes.REMOVE_POST_FORBIDDEN);
  }

  public async reactToPost(
    postID: string,
    senderId: string,
    type: ReactionType
  ) {
    /**
     * If the post does not exist, or not visible to the sender
     * the method below will throw an error
     * so that we reuse the method to check if the post exists and visible to the sender
     */
    await this.getPostById(postID, senderId);

    const react = await reactionService.createReaction(
      postID,
      senderId,
      ReactionTargetType.POST,
      type
    );

    return react;
  }

  public async removeReactionFromPost(postID: string, userID: string) {
    if (!(await postRepository.checkPostExistsById(postID))) {
      throw new ApiError(ApiErrorCodes.POST_NOT_FOUND);
    }
    await reactionService.removeReactionFromPost(
      postID,
      userID,
      ReactionTargetType.POST
    );
  }

  public async getReactionsFromPost(
    postID: string,
    senderId: string,
    senderRole: UserRole,
    type: ReactionType
  ) {
    /**
     * If the post does not exist, or not visible to the sender
     * the method below will throw an error
     * so that we reuse the method to check if the post exists and visible to the sender
     */
    await this.getPostById(postID, senderId, senderRole);
    if (Object.values(ReactionType).indexOf(type) === -1) {
      throw new ApiError(ApiErrorCodes.INVALID_REACTION_TYPE);
    }
    return await reactionRepository.getReactionsByTargetId(postID, type);
  }

  public async createCommentToPost(
    senderId: string,
    postID: string,
    createCommentRequest: CreateCommentRequestType
  ) {
    /**
     * If the post does not exist, or not visible to the sender
     * the method below will throw an error
     * so that we reuse the method to check if the post exists and visible to the sender
     */
    await this.getPostById(postID, senderId);

    return await commentService.createComment(
      senderId,
      postID,
      createCommentRequest
    );
  }

  public async getCommentsFromPost(
    postID: string,
    senderId: string,
    senderRole: UserRole,
    paginationQuery: PaginationQueryType
  ) {
    /**
     * If the post does not exist, or not visible to the sender
     * the method below will throw an error
     * so that we reuse the method to check if the post exists and visible to the sender
     */
    await this.getPostById(postID, senderId, senderRole);
    const { beforeDate, limit } = paginationQuery;
    const comments = await commentRepository.getCommentsByPostId(
      postID,
      beforeDate,
      Number(limit)
    );

    return await Promise.all(
      comments.map(async (comment) => {
        const { reactionCount, reactionSummary, userReaction } =
          await this.getPostOrCommentInfo(comment._id, senderId);

        return {
          ...comment,
          reactionCount,
          reactionSummary,
          userReaction,
        };
      })
    );
  }

  public getPostOrCommentInfo = async (
    targetId: string | Types.ObjectId,
    senderId: string | Types.ObjectId
  ) => {
    const [reactionCount, reactionSummary, userReaction, commentCount] =
      await Promise.all([
        reactionRepository.getReactionCountByTargetId(targetId),
        reactionRepository.getReactionSummaryByTargetId(targetId),
        reactionRepository.getReactionsByTargetIdAndUserId(targetId, senderId, {
          _id: 0,
          type: 1,
        }),
        commentRepository.getCommentCountByPostId(targetId),
      ]);

    return { reactionCount, reactionSummary, userReaction, commentCount };
  };
}

export default new PostService();
