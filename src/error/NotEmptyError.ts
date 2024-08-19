import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Custom error class representing an error when a required field is empty.
 * Extends the RouteError class.
 *
 */

class NotEmptyError extends RouteError {
  public constructor(fieldNames: string[]) {
    const errorCode = 2;
    const message = NotEmptyError.createMessage(fieldNames);
    super(errorCode, HttpStatusCodes.UNPROCESSABLE_ENTITY, message);
  }

  /**
   * Creates an error message indicating that the specified field cannot be empty.
   * @param fieldNames - The name of the field that cannot be empty.
   * @returns The error message string.
   */

  private static createMessage(fieldNames: string[]): string {
    return `The following fields cannot be empty: ${fieldNames.join(", ")}`;
  }
}

export default NotEmptyError;
