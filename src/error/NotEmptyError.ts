import HttpStatusCodes from "@src/common/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Custom error class representing an error when a required field is empty.
 * Extends the RouteError class.
 * @class NotEmptyError
 * @extends RouteError
 */

class NotEmptyError extends RouteError {
  /**
   * Public constructor.
   * @param fieldName - The name of the field that is empty.
   */

  public constructor(fieldName: string) {
    const message = NotEmptyError.createMessage(fieldName);
    super(HttpStatusCodes.UNPROCESSABLE_ENTITY, message);
  }

  /**
   * Creates an error message indicating that the specified field cannot be empty.
   * @param fieldName - The name of the field that cannot be empty.
   * @returns The error message string.
   */

  private static createMessage(fieldName: string): string {
    return `${fieldName} cannot be empty.`;
  }
}

export default NotEmptyError;
