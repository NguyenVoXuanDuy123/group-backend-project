import dotenv from "dotenv";
dotenv.config();
/**
 * Environments variables declared here.
 */

/* eslint-disable node/no-process-env */
export default {
  Port: process.env.PORT ?? 0,
  CookieProps: {
    Secret: process.env.COOKIE_SECRET ?? "",
  },
  Mongo: {
    Uri: (process.env.MONGO_URI as string) ?? "",
  },
} as const;
