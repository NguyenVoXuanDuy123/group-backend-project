import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Represents an HTTP 422 when a required value is not a number.
 */
class IsNotNumberError extends RouteError {
  public constructor(fieldName: string) {
    const message = IsNotNumberError.createMessage(fieldName);
    super(HttpStatusCodes.UNPROCESSABLE_ENTITY, message);
  }

  private static createMessage(fieldName: string): string {
    return `The value of ${fieldName} must be a number.`;
  }
}
export default IsNotNumberError;
