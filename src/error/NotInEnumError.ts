import RouteError from "@src/error/RouteError";

class NotInEnumError extends RouteError {
  public constructor(fieldName: string, enumValue: string[]) {
    const message = NotInEnumError.createMessage(fieldName, enumValue);
    super(400, message);
  }

  private static createMessage(fieldName: string, enumName: string[]): string {
    return `${fieldName} must be one of the following values: ${enumName.join(
      ", "
    )}  `;
  }
}

export default NotInEnumError;
