import morgan from "morgan";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";
import BaseRouter from "@src/routes/index.routes";
import HttpStatusCodes from "@src/constant/HttpStatusCodes";
import RouteError from "@src/error/RouteError";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import EnvVars from "@src/constant/EnvVars";
import connectMongoDBSession from "connect-mongodb-session";
import "./configs/passport.config"; // import to run passport config
import { UPLOAD_DIR } from "@src/constant/dir";
import databaseConfig from "@src/configs/database.config";
import cors from "cors";
import ApiError from "@src/error/ApiError";
import ApiErrorCodes from "@src/error/ApiErrorCodes";
import { APIRequest, ErrorAPIResponse } from "@src/types/api.types";
import trimRequestBody from "@src/helpers/sanitation";
// import "./zmock-data/fake-data";
import fs from "fs";

// **** Variables **** //

const app = express();

// **** Setup **** //

databaseConfig.connectDB();

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Basic middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your frontend's URL
    credentials: true, // This allows the server to accept cookies from the frontend
  })
);
app.use(express.json());
app.use(cookieParser(EnvVars.CookieProps.Secret));
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(UPLOAD_DIR));
// Show routes called in console during development

app.use(morgan("dev"));

// **** Security **** //
app.use(helmet());
// **** trim request body **** //
app.use(trimRequestBody);

// **** Passportjs set up **** //
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: EnvVars.Mongo.Uri,
  collection: "mySessions",
});

app.use(
  session({
    secret: EnvVars.CookieProps.Secret,
    resave: false,
    saveUninitialized: true,
    store,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// **** Routes **** //
app.use("/api", BaseRouter);

// if no route is matched by now, it must be a 404
app.use((_: Request, res: Response, next: NextFunction) => {
  next(new ApiError(ApiErrorCodes.ROUTE_NOT_FOUND));
});

// error handler
app.use(
  (
    err: Error,
    _: APIRequest,
    res: ErrorAPIResponse,
    next: NextFunction
  ): void => {
    let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    let errCode = 1001; // error code for unknown error
    if (err instanceof RouteError) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      status = err.status;
      errCode = err.errorCode;
    }

    // handle mongoose cast error for invalid id
    if (err.message.includes("Cast to ObjectId failed for value")) {
      const apiError = new ApiError(ApiErrorCodes.INVALID_ID);
      res.status(ApiErrorCodes.INVALID_ID.httpStatusCode).json({
        errorCode: apiError.errorCode,
        message: apiError.message,
      });
    }
    console.error(err);

    res.status(status).json({
      errorCode: errCode,
      message: err.message,
    });
    next();
  }
);

export default app;
