import HttpStatusCodes from "@src/constant/HttpStatusCodes";

/**
 * Error with status code and message
 */
class RouteError extends Error {
  public status: HttpStatusCodes;
  public responseCode: number;

  public constructor(
    responseCode: number,
    status: HttpStatusCodes,
    message: string
  ) {
    super(message);
    this.status = status;
    this.responseCode = responseCode;
  }
}

// **** Export default **** //

export default RouteError;
