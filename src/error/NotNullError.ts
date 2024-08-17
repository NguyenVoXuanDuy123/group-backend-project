import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Represents an HTTP 422 when a required value is null.
 */
class NotNullError extends RouteError {
  public constructor(fieldNames: string[]) {
    const responseCode = 1;
    const message = NotNullError.createMessage(fieldNames);
    super(responseCode, HttpStatusCodes.UNPROCESSABLE_ENTITY, message);
  }

  private static createMessage(fieldNames: string[]): string {
    return (
      "The following fields are required (not null): " + fieldNames.join(", ")
    );
  }
}

export default NotNullError;
