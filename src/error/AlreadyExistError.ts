import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Represents an HTTP 400 when a value already exists.
 */

class AlreadyExistError extends RouteError {
  public constructor(fieldName: string) {
    const message = AlreadyExistError.createMessage(fieldName);
    super(HttpStatusCodes.BAD_REQUEST, message);
  }

  private static createMessage(fieldName: string): string {
    return `${fieldName} already exists.`;
  }
}

export default AlreadyExistError;
