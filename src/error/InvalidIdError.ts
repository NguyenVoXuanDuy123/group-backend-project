import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Represents an HTTP 422 when id is invalid.
 * id must be a valid ObjectId which is a 24-character hex string.
 */
class InvalidIdError extends RouteError {
  public constructor(fieldNames: string[]) {
    const responseCode = 3;
    const message = InvalidIdError.createMessage(fieldNames);
    super(responseCode, HttpStatusCodes.UNPROCESSABLE_ENTITY, message);
  }

  private static createMessage(fieldNames: string[]): string {
    return (
      "The following fields must be valid ObjectId (24-character hex string): " +
      fieldNames.join(", ")
    );
  }
}

export default InvalidIdError;
