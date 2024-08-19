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
import { APIRequest, APIResponse } from "@src/types/api.types";

// **** Variables **** //

const app = express();

// **** Setup **** //

databaseConfig.connectDB();

// Basic middleware

/*
 * The types for cors is not working properly
 * So I have to disable the eslint rule for this line
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors<Request>());
app.use(express.json());
app.use(cookieParser(EnvVars.CookieProps.Secret));
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(UPLOAD_DIR));
// Show routes called in console during development

app.use(morgan("dev"));

// Security
app.use(helmet());

// Passport middleware
const MongoDBStore = connectMongoDBSession(session);

const store = new MongoDBStore({
  uri: EnvVars.Mongo.Uri,
  collection: "my_sessions",
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
  (err: Error, _: APIRequest, res: APIResponse, next: NextFunction): void => {
    let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
    let errCode = 1001; // error code for unknown error
    if (err instanceof RouteError) {
      status = err.status;
      errCode = err.errorCode;
    }
    console.error(err);
    res.status(status).json({ errorCode: errCode, message: err.message });
    next();
  }
);

export default app;
