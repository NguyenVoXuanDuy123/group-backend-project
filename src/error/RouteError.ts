import HttpStatusCodes from "@src/constant/HttpStatusCodes";

/**
 * Error with status code and message
 */
class RouteError extends Error {
  public status: HttpStatusCodes;
  public errorCode: number;

  public constructor(
    errorCode: number,
    status: HttpStatusCodes,
    message: string
  ) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

// **** Export default **** //

export default RouteError;
