import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Represents an HTTP 404 when a value is not found.
 */
class NotFoundError extends RouteError {
  public constructor(fieldName: string) {
    const message = NotFoundError.createMessage(fieldName);
    super(HttpStatusCodes.NOT_FOUND, message);
  }

  private static createMessage(fieldName: string): string {
    return "Could not find " + fieldName;
  }
}

export default NotFoundError;
