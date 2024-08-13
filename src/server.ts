/**
 * Setup express server.
 */

// import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import express, { Request, Response, NextFunction } from "express";

import "express-async-errors";

import BaseRouter from "@src/routes/index.routes";

import HttpStatusCodes from "@src/common/HttpStatusCodes";
import databaseService from "@src/services/database.service";
import RouteError from "@src/error/RouteError";
import session from "express-session";
import passport from "passport";
import cookieParser from "cookie-parser";
import EnvVars from "@src/common/EnvVars";
import connectMongoDBSession from "connect-mongodb-session";
import "./configs/passport.config"; // import to run passport config
// **** Variables **** //

const app = express();

// **** Setup **** //

databaseService.connectDB();

// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

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

// Add APIs, must be after middleware

app.use("/api", BaseRouter);

app.use((_: Request, res: Response, next: NextFunction) => {
  next(new RouteError(HttpStatusCodes.NOT_FOUND, "Route not found"));
});

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction): void => {
  let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  if (err instanceof RouteError) {
    status = err.status;
  }
  console.error(err);
  res.status(status).json({ error: err.message });
  next();
});

export default app;
