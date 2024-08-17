import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Represents an HTTP 422 when a required value is null.
 */
class NotNullError extends RouteError {
  public constructor(fieldName: string[]) {
    const message = NotNullError.createMessage(fieldName);
    super(HttpStatusCodes.UNPROCESSABLE_ENTITY, message);
  }

  private static createMessage(fieldName: string[]): string {
    return (
      "The following fields are required (not null): " + fieldName.join(", ")
    );
  }
}

export default NotNullError;
