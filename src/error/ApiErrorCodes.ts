import HttpStatusCodes from "@src/constant/HttpStatusCodes";

/**
 * Represents an API error code.
 *
 * This class is designed to be extended by other classes that represent specific API errors.
 */

class ApiErrorCodes {
  /** Input validation errors 1-1000*/

  // 1 and 2 are already used in NotNullError and NotEmptyError

  public static readonly INVALID_ID = new ApiErrorCodes(
    3,
    HttpStatusCodes.UNPROCESSABLE_ENTITY,
    "Id must be valid ObjectId (24-character hex string)"
  );

  /** Generic API error codes 1001-2000*/
  public static readonly INTERNAL_SERVER_ERROR = new ApiErrorCodes(
    1001,
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    "Something went wrong, please contact the administrator."
  );

  /**
   * This error should never occur, but when it does, it's crucial to investigate the root cause.
   *  For instance, when fetching a post from the database, if the post's visibility level is set to 'group'
   *  but the group ID is null or the group is not found,
   *  it's essential to review the code and identify the issue.
   */

  public static readonly CRITICAL_DATA_INTEGRITY_ERROR = new ApiErrorCodes(
    1002,
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    "Something went wrong, please contact the administrator."
  );

  public static readonly ROUTE_NOT_FOUND = new ApiErrorCodes(
    1003,
    HttpStatusCodes.NOT_FOUND,
    "Route not found"
  );

  /**  Authentication 2001 - 3000*/
  public static readonly FORBIDDEN = new ApiErrorCodes(
    2001,
    HttpStatusCodes.FORBIDDEN,
    "Forbidden"
  );

  public static readonly INVALID_PASSWORD_LENGTH = new ApiErrorCodes(
    2002,
    HttpStatusCodes.BAD_REQUEST,
    "Password must be at least 6 characters long"
  );

  public static readonly INVALID_USERNAME_LENGTH = new ApiErrorCodes(
    2003,
    HttpStatusCodes.BAD_REQUEST,
    "Username must be at least 6 characters long and at most 20 characters long"
  );

  public static readonly USERNAME_ALREADY_TAKEN = new ApiErrorCodes(
    2004,
    HttpStatusCodes.CONFLICT,
    "Username is already taken"
  );

  public static readonly PASSWORD_CONFIRM_PASSWORD_MISMATCH = new ApiErrorCodes(
    2005,
    HttpStatusCodes.BAD_REQUEST,
    "Password and confirm password do not match"
  );

  public static readonly INVALID_CREDENTIALS = new ApiErrorCodes(
    2006,
    HttpStatusCodes.UNAUTHORIZED,
    "Login credentials are incorrect. Please check your username and password and try again."
  );

  public static readonly USER_NOT_AUTHENTICATED = new ApiErrorCodes(
    2007,
    HttpStatusCodes.UNAUTHORIZED,
    "User not authenticated"
  );

  public static readonly USER_BANNED = new ApiErrorCodes(
    2008,
    HttpStatusCodes.FORBIDDEN,
    "User is banned"
  );

  public static readonly ADMIN_ROLE_REQUIRED = new ApiErrorCodes(
    2009,
    HttpStatusCodes.FORBIDDEN,
    "Admin role required to perform this action"
  );

  public static readonly INVALID_USERNAME = new ApiErrorCodes(
    2010,
    HttpStatusCodes.BAD_REQUEST,
    "Username can only contain alphanumeric characters."
  );

  /** Media upload errors  3001 - 4000*/

  public static readonly INVALID_IMAGE_FORMAT = new ApiErrorCodes(
    3001,
    HttpStatusCodes.UNSUPPORTED_MEDIA_TYPE,
    "Invalid image format. Supported formats are JPEG, PNG, and JPG."
  );

  public static readonly IMAGE_SIZE_TOO_LARGE = new ApiErrorCodes(
    3002,
    HttpStatusCodes.BAD_REQUEST,
    "Image size is too large. Maximum allowed size is 5MB."
  );

  public static readonly NO_IMAGE_ATTACHED = new ApiErrorCodes(
    3003,
    HttpStatusCodes.BAD_REQUEST,
    "No image attached."
  );

  /** User errors 4001 - 5000*/

  public static readonly USER_NOT_FOUND = new ApiErrorCodes(
    4001,
    HttpStatusCodes.NOT_FOUND,
    "User not found"
  );

  public static readonly INVALID_USER_STATUS = new ApiErrorCodes(
    4002,
    HttpStatusCodes.BAD_REQUEST,
    "User status must be either 'active' or 'banned'."
  );

  public static readonly CANNOT_CHANGE_ADMIN_STATUS = new ApiErrorCodes(
    4003,
    HttpStatusCodes.FORBIDDEN,
    "Cannot change the status of an admin user."
  );

  /** Friend request errors 5001 - 6000*/

  public static readonly INVALID_FRIEND_REQUEST_STATUS = new ApiErrorCodes(
    5001,
    HttpStatusCodes.BAD_REQUEST,
    "Friend status must be either 'accepted', 'rejected' if the user is the receiver of the request, or 'cancelled' if the user is the sender."
  );

  public static readonly FRIEND_REQUEST_NOT_FOUND = new ApiErrorCodes(
    5002,
    HttpStatusCodes.NOT_FOUND,
    "Friend request not found."
  );

  public static readonly CANNOT_CHANGE_FRIEND_REQUEST_STATUS =
    new ApiErrorCodes(
      5003,
      HttpStatusCodes.BAD_REQUEST,
      "Once a friend request is accepted, rejected, or cancelled, its status cannot be changed."
    );

  public static readonly CANNOT_SEND_FRIEND_REQUEST_TO_SELF = new ApiErrorCodes(
    5004,
    HttpStatusCodes.BAD_REQUEST,
    "Cannot send a friend request to self."
  );

  public static readonly FRIEND_REQUEST_ALREADY_SENT = new ApiErrorCodes(
    5005,
    HttpStatusCodes.BAD_REQUEST,
    "A friend request has already been sent to this user."
  );

  public static readonly BOTH_USERS_NOT_FRIENDS = new ApiErrorCodes(
    5006,
    HttpStatusCodes.BAD_REQUEST,
    "Both users are not friends of each other."
  );

  public static readonly CANNOT_SEND_FRIEND_REQUEST_TO_SENDER =
    new ApiErrorCodes(
      5007,
      HttpStatusCodes.BAD_REQUEST,
      "Cannot send a friend request to the user who have already sent you a friend request."
    );

  public static readonly BOTH_USER_ALREADY_FRIENDS = new ApiErrorCodes(
    5008,
    HttpStatusCodes.BAD_REQUEST,
    "Can not send the friend request because both users are already friends of each other."
  );

  public static readonly CHANGE_STATUS_FRIEND_REQUEST_FORBIDDEN =
    new ApiErrorCodes(
      5009,
      HttpStatusCodes.FORBIDDEN,
      "Only the sender of the friend request can cancel the request, and only the receiver of the friend request can accept or reject the request."
    );

  /** Group errors 6001 - 7000*/
  public static readonly INVALID_GROUP_VISIBILITY_LEVEL = new ApiErrorCodes(
    6001,
    HttpStatusCodes.BAD_REQUEST,
    "Group visibility level must be either 'public' or 'private'."
  );

  public static readonly GROUP_NOT_FOUND = new ApiErrorCodes(
    6002,
    HttpStatusCodes.NOT_FOUND,
    "Group not found."
  );

  public static readonly UPDATE_GROUP_FORBIDDEN = new ApiErrorCodes(
    6003,
    HttpStatusCodes.FORBIDDEN,
    "Only the admin of the group can update the group."
  );

  public static readonly DELETE_GROUP_FORBIDDEN = new ApiErrorCodes(
    6004,
    HttpStatusCodes.FORBIDDEN,
    "Only the admin of the group or site-admin can delete the group."
  );

  public static readonly GROUP_MEMBERS_NOT_VISIBLE = new ApiErrorCodes(
    6005,
    HttpStatusCodes.FORBIDDEN,
    "Only the members of the group can view the members of the group."
  );

  public static readonly CANNOT_REMOVE_GROUP_ADMIN = new ApiErrorCodes(
    6006,
    HttpStatusCodes.FORBIDDEN,
    "Cannot remove the admin of the group."
  );

  public static readonly REMOVE_MEMBER_FORBIDDEN = new ApiErrorCodes(
    6007,
    HttpStatusCodes.FORBIDDEN,
    "Only the admin of the group can remove members from the group."
  );

  public static readonly USER_NOT_IN_GROUP = new ApiErrorCodes(
    6008,
    HttpStatusCodes.BAD_REQUEST,
    "User is not a member of this group."
  );

  public static readonly GROUP_NOT_APPROVED = new ApiErrorCodes(
    6009,
    HttpStatusCodes.FORBIDDEN,
    "This action cannot be performed because the group is not approved yet or rejected."
  );

  public static readonly CANNOT_CHANGE_GROUP_STATUS = new ApiErrorCodes(
    6010,
    HttpStatusCodes.BAD_REQUEST,
    "Once a group is approved or rejected, its status cannot be changed."
  );

  public static readonly INVALID_GROUP_STATUS = new ApiErrorCodes(
    6011,
    HttpStatusCodes.BAD_REQUEST,
    "Group status must be either 'approved' or 'rejected'."
  );

  /** Group join request errors 7001 - 8000*/
  public static readonly INVALID_GROUP_JOIN_REQUEST_STATUS = new ApiErrorCodes(
    7001,
    HttpStatusCodes.BAD_REQUEST,
    "Group join request status must be either 'accepted', 'rejected' if the user is the admin of the group, or 'cancelled' if the user is the requester."
  );

  public static readonly GROUP_JOIN_REQUEST_NOT_FOUND = new ApiErrorCodes(
    7002,
    HttpStatusCodes.NOT_FOUND,
    "Group join request not found."
  );

  public static readonly CHANGE_GROUP_JOIN_REQUEST_STATUS_FORBIDDEN =
    new ApiErrorCodes(
      7003,
      HttpStatusCodes.FORBIDDEN,
      "Only the user who sent the group join request can cancel the request, and only the admin of the group can accept or reject the request."
    );

  public static readonly GROUP_JOIN_REQUEST_NOT_VISIBLE = new ApiErrorCodes(
    7004,
    HttpStatusCodes.FORBIDDEN,
    "Only the admin of the group can view the group join requests."
  );

  public static readonly GROUP_JOIN_REQUEST_ALREADY_SENT = new ApiErrorCodes(
    7005,
    HttpStatusCodes.BAD_REQUEST,
    "The user has already sent a group request to this group."
  );

  public static readonly ALREADY_GROUP_MEMBER = new ApiErrorCodes(
    7006,
    HttpStatusCodes.BAD_REQUEST,
    "This user is already a member of this group."
  );

  public static readonly CANNOT_CHANGE_GROUP_REQUEST_STATUS = new ApiErrorCodes(
    7007,
    HttpStatusCodes.BAD_REQUEST,
    "Once a group request is accepted, rejected, or cancelled, its status cannot be changed."
  );

  public static readonly GROUP_ADMIN_CANNOT_SEND_GROUP_REQUEST =
    new ApiErrorCodes(
      7008,
      HttpStatusCodes.FORBIDDEN,
      "The group admins cannot send a group request to their group."
    );

  /** Post errors 8001 - 9000*/
  public static readonly INVALID_POST_VISIBILITY_LEVEL = new ApiErrorCodes(
    8001,
    HttpStatusCodes.BAD_REQUEST,
    "Post visibility level must be either 'public' or 'friend' for posts on home (wall) , or 'group' for posts in a group."
  );

  public static readonly VISIBILITY_LEVEL_MUST_BE_GROUP = new ApiErrorCodes(
    8002,
    HttpStatusCodes.BAD_REQUEST,
    "Visibility level must be 'group' when creating a post in a group (when group ID is provided)."
  );

  public static readonly GROUP_ID_REQUIRED_WHEN_VISIBILITY_LEVEL_IS_GROUP =
    new ApiErrorCodes(
      8003,
      HttpStatusCodes.BAD_REQUEST,
      "Group ID is required when visibility level is 'group'."
    );

  public static readonly POST_NOT_FOUND = new ApiErrorCodes(
    8004,
    HttpStatusCodes.NOT_FOUND,
    "Post not found."
  );

  public static readonly POST_NOT_VISIBLE_TO_USER = new ApiErrorCodes(
    8005,
    HttpStatusCodes.FORBIDDEN,
    "Post is not visible to the user."
  );

  public static readonly UPDATE_POST_FORBIDDEN = new ApiErrorCodes(
    8006,
    HttpStatusCodes.FORBIDDEN,
    "Only the author of the post can update the post."
  );

  public static readonly DELETE_POST_FORBIDDEN = new ApiErrorCodes(
    8007,
    HttpStatusCodes.FORBIDDEN,
    "Only the author of the post, the admin of the group or site-admin can delete the post."
  );

  public static readonly INVALID_UPDATE_POST_VISIBILITY_LEVEL =
    new ApiErrorCodes(
      8008,
      HttpStatusCodes.FORBIDDEN,
      "If the post is in a group, the visibility level cannot be changed. If the post is on the wall, the visibility level can only be changed to 'public' or 'friend'."
    );

  /** Comment errors 9001 - 10000*/
  public static readonly COMMENT_NOT_FOUND = new ApiErrorCodes(
    9001,
    HttpStatusCodes.NOT_FOUND,
    "Comment not found."
  );

  public static readonly UPDATE_COMMENT_FORBIDDEN = new ApiErrorCodes(
    9002,
    HttpStatusCodes.FORBIDDEN,
    "Only the author of the comment can update the comment."
  );

  public static readonly DELETE_COMMENT_FORBIDDEN = new ApiErrorCodes(
    9003,
    HttpStatusCodes.FORBIDDEN,
    "Only the author of the comment, the author of the post, the admin of the group or site-admin can delete the comment."
  );

  /** Reaction errors 10001 - 11000*/
  public static readonly INVALID_REACTION_TYPE = new ApiErrorCodes(
    10001,
    HttpStatusCodes.BAD_REQUEST,
    "Invalid reaction type. Reaction type must be one of 'like', 'love', 'haha', or 'angry'."
  );

  public static readonly USER_NOT_REACTED = new ApiErrorCodes(
    10002,
    HttpStatusCodes.BAD_REQUEST,
    "User has not reacted to this post or this comment."
  );

  private constructor(
    public readonly errorCode: number,
    public readonly httpStatusCode: HttpStatusCodes,
    public readonly message: string
  ) {}
}

export default ApiErrorCodes;
