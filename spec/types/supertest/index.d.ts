import { IUser } from "@src/schema/user.schema";
import "supertest";

declare module "supertest" {
  export interface Response {
    headers: Record<string, string[]>;
    body: {
      error: string;
      users: IUser[];
    };
  }
}
