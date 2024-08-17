import { GroupVisibilityLevel } from "@src/enums/group.enum";
import {
  PostVisibilityLevel,
  ReactionTargetType,
  ReactionType,
} from "@src/enums/post.enum";
import { UserRole } from "@src/enums/user.enum";
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
import { Types } from "mongoose";

class PostService {
  public async createPost(
    authorID: string,
    createPostRequest: CreatePostRequestType
  ) {
    const post: Partial<IPost> = {
      author: new Types.ObjectId(authorID),
      group: createPostRequest.groupId
        ? new Types.ObjectId(createPostRequest.groupId)
        : null,
      visibility_level: createPostRequest.visibilityLevel,
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
    if (post.visibility_level === PostVisibilityLevel.GROUP) {
      if (!groupId) {
        // there is no way when a post has a group visibility level,
        // but group is null
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }
      group = await groupRepository.findGroupById(groupId, {
        name: 1,
        visibility_level: 1,
        members: 1,
      });

      if (!group) {
        // there is no way when a post has a group visibility level,
        // but the group cannot be found
        throw new ApiError(ApiErrorCodes.CRITICAL_DATA_INTEGRITY_ERROR);
      }
      /**
       *
       * in case visibility_level = group user only can see the post if
       * 1. user role is site-admin
       * 2. group is public
       * 3. user is a member of the group (group admin is also a member)
       *
       */
      if (!isInternalCall) {
        const canSeePost =
          senderRole === UserRole.ADMIN ||
          group.visibility_level === GroupVisibilityLevel.PUBLIC ||
          group.members.some((member) => member.equals(senderId));

        if (!canSeePost) {
          throw new ApiError(ApiErrorCodes.POST_IS_NOT_VISIBLE_TO_USER);
        }
      }
    }

    // check when visibility level is friends
    const author = await userRepository.findById(authorId, {
      _id: 1,
      first_name: 1,
      last_name: 1,
      friends: 1,
      username: 1,
      avatar: 1,
    });

    if (post.visibility_level === PostVisibilityLevel.FRIEND) {
      if (!author) {
        // there is no way the post exists without an author
        throw new ApiError(ApiErrorCodes.POST_IS_NOT_VISIBLE_TO_USER);
      }

      let canSeePost = false;

      /**
       * in case visibility_level = friend user can see the post if
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
          throw new ApiError(ApiErrorCodes.POST_IS_NOT_VISIBLE_TO_USER);
        }
      }
    }
    // if the post is public, no need to check anything
    return {
      ...rest,
      reactionCount: await reactionRepository.getReactionCountByTargetId(
        rest._id
      ),
      commentCount: await commentRepository.getCommentCountByPostId(rest._id),
      group: group && {
        id: group._id,
        name: group.name,
        visibility_level: group.visibility_level,
      },
      author: author && {
        id: author._id,
        first_name: author.first_name,
        last_name: author.last_name,
        username: author.username,
        avatar: author.avatar,
      },
      userReaction: await reactionRepository.getReactionsByTargetIdAndUserId(
        rest._id,
        senderId,
        {
          _id: 0,
          type: 1,
        }
      ),
    };
  }

  public async updatePost(
    senderId: string,
    postID: string,
    updatePostRequest: UpdatePostRequestType
  ) {
    const post = await postRepository.findPostById(postID, {
      author: 1,
      content: 1,
      images: 1,
    });

    if (!post) {
      throw new ApiError(ApiErrorCodes.POST_NOT_FOUND);
    }

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
        edited_at: new Date(),
      };

      await postRepository.pushPostHistory(postID, postHistory);
    }

    await postRepository.updatePostById(
      postID,
      removeNullValues({
        content: updatePostRequest.content,
        images: updatePostRequest.images,
        visibility_level: updatePostRequest.visibilityLevel,
      })
    );

    return this.getPostById(postID, senderId, UserRole.USER, true);
  }

  public async deletePost(
    senderId: string,
    postID: string,
    senderRole: UserRole
  ) {
    const post = await postRepository.findPostById(postID, {
      group: 1,
      visibility_level: 1,
      author: 1,
    });

    if (!post) {
      throw new ApiError(ApiErrorCodes.POST_NOT_FOUND);
    }
    /**
     * sender can only delete post if:
     * 1. sender is the author of the post
     * 2. sender is an site admin
     * 3. sender is the admin of the group where the post is posted
     */

    if (post.author.equals(senderId) || senderRole === UserRole.ADMIN) {
      await postRepository.deletePostById(postID);
      return;
    }

    // if the post visibility level is group, admin of the group can delete the post
    if (post.visibility_level === PostVisibilityLevel.GROUP) {
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
        await postRepository.deletePostById(postID);
        return;
      }
    }

    throw new ApiError(ApiErrorCodes.DELETE_POST_FORBIDDEN);
  }

  public async reactToPost(
    postID: string,
    senderId: string,
    type: ReactionType
  ) {
    // if the post does not exist, or not visible to the sender
    // the method below will throw an error
    // so that we reuse the method to check if the post exists and visible to the sender
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
    senderRole: UserRole
  ) {
    // if the post does not exist, or not visible to the sender
    // the method below will throw an error
    // so that we reuse the method to check if the post exists and visible to the sender
    await this.getPostById(postID, senderId, senderRole);

    return await reactionRepository.getReactionsByTargetId(postID);
  }

  public async createCommentToPost(
    senderId: string,
    postID: string,
    createCommentRequest: CreateCommentRequestType
  ) {
    // if the post does not exist, or not visible to the sender
    // the method below will throw an error
    // so that we reuse the method to check if the post exists and visible to the sender
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
    senderRole: UserRole
  ) {
    // if the post does not exist, or not visible to the sender
    // the method below will throw an error
    // so that we reuse the method to check if the post exists and visible to the sender

    await this.getPostById(postID, senderId, senderRole);
    // return await commentRepository.getCommentDetailsByPostId(postID);
  }
}

export default new PostService();
