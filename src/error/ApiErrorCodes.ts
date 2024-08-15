import HttpStatusCodes from "@src/constant/HttpStatusCodes";

/**
 * Represents an API error code.
 *
 * This class is designed to be extended by other classes that represent specific API errors.
 */

class ApiErrorCodes {
  public static readonly INTERNAL_SERVER_ERROR = new ApiErrorCodes(
    HttpStatusCodes.INTERNAL_SERVER_ERROR,
    "Internal server error"
  );

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

  public static readonly USERS_ALREADY_FRIENDS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Both users are already friends of each other."
  );

  public static readonly INVALID_FRIEND_REQUEST_STATUS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Friend status must be either 'accepted', 'rejected' if the user is the receiver of the request, or 'cancelled' if the user is the sender."
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

  public static readonly INVALID_GROUP_VISIBILITY_LEVEL = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Group visibility level must be either 'public' or 'friends'."
  );

  public static readonly GROUP_REQUEST_ALREADY_SENT = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "The user has already sent a group request to this group."
  );

  public static readonly ALREADY_GROUP_MEMBER = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "This member are already a member of this group."
  );

  public static readonly CANNOT_CHANGE_GROUP_REQUEST_STATUS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Once a group request is accepted, rejected, or cancelled, its status cannot be changed."
  );

  public static readonly INVALID_GROUP_JOIN_REQUEST_STATUS = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Group join request status must be either 'accepted', 'rejected' if the user is the admin of the group, or 'cancelled' if the user is the requester."
  );

  public static readonly CANNOT_REMOVE_GROUP_ADMIN = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Cannot remove the admin of the group."
  );

  public static readonly USER_NOT_IN_GROUP = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "User is not a member of this group."
  );

  public static readonly GROUP_ADMIN_CANNOT_SEND_GROUP_REQUEST =
    new ApiErrorCodes(
      HttpStatusCodes.BAD_REQUEST,
      "The group admin cannot send a group request."
    );

  public static readonly INVALID_POST_VISIBILITY_LEVEL = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Post visibility level must be either 'public' or 'friends' for post in personal timeline. or 'group' for post in group."
  );

  public static readonly VISIBILITY_LEVEL_MUST_BE_GROUP = new ApiErrorCodes(
    HttpStatusCodes.BAD_REQUEST,
    "Visibility level must be 'group' when creating a post in a group."
  );

  public static readonly GROUP_ID_REQUIRED_WHEN_VISIBILITY_LEVEL_IS_GROUP =
    new ApiErrorCodes(
      HttpStatusCodes.BAD_REQUEST,
      "Group ID is required when visibility level is 'group'."
    );

  private constructor(
    public readonly httpStatusCode: HttpStatusCodes,
    public readonly message: string
  ) {}
}

export default ApiErrorCodes;
