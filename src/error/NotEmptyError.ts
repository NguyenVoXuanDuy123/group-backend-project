import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Custom error class representing an error when a required field is empty.
 * Extends the RouteError class.
 */

class NotEmptyError extends RouteError {
  public constructor(fieldNames: string[]) {
    const errorCode = 2;
    const message = NotEmptyError.createMessage(fieldNames);
    super(errorCode, HttpStatusCodes.UNPROCESSABLE_ENTITY, message);
  }

  private static createMessage(fieldNames: string[]): string {
    return `The following fields cannot be empty: ${fieldNames.join(", ")}`;
  }
}

export default NotEmptyError;
