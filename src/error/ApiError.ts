import RouteError from "@src/error/RouteError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";

/**
 * Represents a generic API error.
 */
class ApiError extends RouteError {
  public constructor(ApiErrorCodes: ApiErrorCodes) {
    super(
      ApiErrorCodes.errorCode,
      ApiErrorCodes.httpStatusCode,
      ApiErrorCodes.message
    );
  }
}

export default ApiError;
