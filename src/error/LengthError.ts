import HttpStatusCodes from "@src/common/HttpStatusCodes";
import RouteError from "@src/error/RouteError";

/**
 * Represents an HTTP 422 when a value length is invalid.
 */
export class LengthError extends RouteError {
  public constructor(
    fieldName: string,
    minLength?: number,
    maxLength?: number
  ) {
    const message = LengthError.generateMessage(
      fieldName,
      minLength,
      maxLength
    );
    super(HttpStatusCodes.BAD_REQUEST, message);
  }

  private static generateMessage(
    fieldName: string,
    minLength?: number,
    maxLength?: number
  ): string {
    if (minLength !== undefined && maxLength !== undefined) {
      return `The value of ${fieldName} must be between ${minLength} and ${maxLength} characters.`;
    } else if (minLength !== undefined) {
      return `The value of ${fieldName} must be at least ${minLength} characters.`;
    } else if (maxLength !== undefined) {
      return `The value of ${fieldName} must be no more than ${maxLength} characters.`;
    } else {
      return `Invalid length constraints provided for ${fieldName}.`;
    }
  }
}

export default LengthError;
