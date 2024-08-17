import HttpStatusCodes from "@src/constant/HttpStatusCodes";

/**
 * Represents an API error code.
 *
 * This class is designed to be extended by other classes that represent specific API errors.
 */

class ApiErrorCodes {
  /** Generic API error codes */
  public static readonly INTERNAL_SERVER_ERROR = new ApiErrorCodes(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    "Internal server error"
  );

  // This error should never occur, but when it does, it's crucial to investigate the root cause.
  // For instance, when fetching a post from the database, if the post's visibility level is set to 'group'
  // but the group ID is null or the group is not found,
  // it's essential to review the code and identify the issue.
  public static readonly CRITICAL_DATA_INTEGRITY_ERROR = new ApiErrorCodes(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    "Something went wrong, please contact the administrator."
  );

  /** Image upload errors */

  public static readonly INVALID_IMAGE_FORMAT = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Invalid image format. Supported formats are JPEG, PNG, and JPG."
  );

  public static readonly IMAGE_SIZE_TOO_LARGE = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Image size is too large. Maximum allowed size is 5MB."
  );

  public static readonly NO_IMAGE_ATTACHED = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "No image attached."
  );

  /**  Authentication and authorization errors */
  public static readonly UNAUTHORIZED = new ApiErrorCodes(
    HttpStatusCodes.UNAUTHORIZED,
    "Unauthorized"
  );

  public static readonly FORBIDDEN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Forbidden"
  );

  public static readonly PASSWORD_CONFIRM_PASSWORD_MISMATCH = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Password and confirm password do not match"
  );

  public static readonly INVALID_CREDENTIALS = new ApiErrorCodes(
    HttpStatusCodes.UNAUTHORIZED,
    "Login credentials are incorrect. Please check your username and password and try again."
  );

  public static readonly USER_NOT_AUTHENTICATED = new ApiErrorCodes(
    HttpStatusCodes.UNAUTHORIZED,
    "User not authenticated"
  );

  public static readonly USER_BANNED = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "User is banned"
  );
  /** User errors */

  public static readonly USER_NOT_FOUND = new ApiErrorCodes(
    HttpStatusCodes.NOT_FOUND,
    "User not found"
  );

  /** Friend request errors */

  public static readonly INVALID_FRIEND_REQUEST_STATUS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Friend status must be either 'accepted', 'rejected' if the user is the receiver of the request, or 'cancelled' if the user is the sender."
  );

  public static readonly FRIEND_REQUEST_NOT_FOUND = new ApiErrorCodes(
    HttpStatusCodes.NOT_FOUND,
    "Friend request not found."
  );

  public static readonly CANNOT_CHANGE_FRIEND_REQUEST_STATUS =
    new ApiErrorCodes(
      HttpStatusCodes.BAD_REQUEST,
      "Once a friend request is accepted, rejected, or cancelled, its status cannot be changed."
    );

  public static readonly CANNOT_SEND_FRIEND_REQUEST_TO_SELF = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Cannot send a friend request to self."
  );

  public static readonly FRIEND_REQUEST_ALREADY_SENT = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "A friend request has already been sent to this user."
  );

  public static readonly BOTH_USERS_NOT_FRIENDS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Both users are not friends of each other."
  );

  public static readonly CANNOT_SEND_FRIEND_REQUEST_TO_SENDER =
    new ApiErrorCodes(
      HttpStatusCodes.BAD_REQUEST,
      "Cannot send a friend request to the user who have already sent you a friend request."
    );

  public static readonly BOTH_USER_ALREADY_FRIENDS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Can not send the friend request because both users are already friends of each other."
  );

  public static readonly CHANGE_STATUS_FRIEND_REQUEST_FORBIDDEN =
    new ApiErrorCodes(
      HttpStatusCodes.FORBIDDEN,
      "Only the sender of the friend request can cancel the request, and only the receiver of the friend request can accept or reject the request."
    );

  /** Group errors */
  public static readonly INVALID_GROUP_VISIBILITY_LEVEL = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Group visibility level must be either 'public' or 'private'."
  );

  public static readonly GROUP_NOT_FOUND = new ApiErrorCodes(
    HttpStatusCodes.NOT_FOUND,
    "Group not found."
  );

  public static readonly UPDATE_GROUP_FORBIDDEN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the admin of the group can update the group."
  );

  public static readonly DELETE_GROUP_FORBIDDEN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the admin of the group or site-admin can delete the group."
  );

  public static readonly GROUP_MEMBERS_NOT_VISIBLE = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the members of the group can view the members of the group."
  );

  public static readonly CANNOT_REMOVE_GROUP_ADMIN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Cannot remove the admin of the group."
  );

  public static readonly REMOVE_MEMBER_FORBIDDEN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the admin of the group can remove members from the group."
  );

  public static readonly USER_NOT_IN_GROUP = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "User is not a member of this group."
  );

  /** Group join request errors */
  public static readonly INVALID_GROUP_JOIN_REQUEST_STATUS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Group join request status must be either 'accepted', 'rejected' if the user is the admin of the group, or 'cancelled' if the user is the requester."
  );

  public static readonly GROUP_JOIN_REQUEST_NOT_FOUND = new ApiErrorCodes(
    HttpStatusCodes.NOT_FOUND,
    "Group join request not found."
  );

  public static readonly CHANGE_GROUP_JOIN_REQUEST_STATUS_FORBIDDEN =
    new ApiErrorCodes(
      HttpStatusCodes.FORBIDDEN,
      "Only the user who sent the group join request can cancel the request, and only the admin of the group can accept or reject the request."
    );

  public static readonly GROUP_JOIN_REQUEST_NOT_VISIBLE = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the admin of the group can view the group join requests."
  );

  public static readonly GROUP_JOIN_REQUEST_ALREADY_SENT = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "The user has already sent a group request to this group."
  );

  public static readonly ALREADY_GROUP_MEMBER = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "This user is already a member of this group."
  );

  public static readonly CANNOT_CHANGE_GROUP_REQUEST_STATUS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Once a group request is accepted, rejected, or cancelled, its status cannot be changed."
  );

  public static readonly GROUP_ADMIN_CANNOT_SEND_GROUP_REQUEST =
    new ApiErrorCodes(
      HttpStatusCodes.FORBIDDEN,
      "The group admin cannot send a group request."
    );

  /** Post errors */
  public static readonly INVALID_POST_VISIBILITY_LEVEL = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Post visibility level must be either 'public' or 'friend' for posts on home (wall) , or 'group' for posts in a group."
  );

  public static readonly VISIBILITY_LEVEL_MUST_BE_GROUP = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Visibility level must be 'group' when creating a post in a group (when group ID is provided)."
  );

  public static readonly GROUP_ID_REQUIRED_WHEN_VISIBILITY_LEVEL_IS_GROUP =
    new ApiErrorCodes(
      HttpStatusCodes.BAD_REQUEST,
      "Group ID is required when visibility level is 'group'."
    );

  public static readonly POST_NOT_FOUND = new ApiErrorCodes(
    HttpStatusCodes.NOT_FOUND,
    "Post not found."
  );

  public static readonly POST_NOT_VISIBLE_TO_USER = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Post is not visible to the user."
  );

  public static readonly UPDATE_POST_FORBIDDEN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the author of the post can update the post."
  );

  public static readonly DELETE_POST_FORBIDDEN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the author of the post, the admin of the group or site-admin can delete the post."
  );

  /** Comment errors */
  public static readonly COMMENT_NOT_FOUND = new ApiErrorCodes(
    HttpStatusCodes.NOT_FOUND,
    "Comment not found."
  );

  public static readonly UPDATE_COMMENT_FORBIDDEN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the author of the comment can update the comment."
  );

  public static readonly DELETE_COMMENT_FORBIDDEN = new ApiErrorCodes(
    HttpStatusCodes.FORBIDDEN,
    "Only the author of the comment, the author of the post, the admin of the group or site-admin can delete the comment."
  );
  /** Reaction errors */
  public static readonly INVALID_REACTION_TYPE = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Invalid reaction type. Reaction type must be one of 'like', 'love', 'haha', or 'angry'."
  );

  public static readonly USER_NOT_REACTED = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "User has not reacted to this post or this comment."
  );

  private constructor(
    public readonly httpStatusCode: HttpStatusCodes,
    public readonly message: string
  ) {}
}

export default ApiErrorCodes;
