import { UserRole, UserStatus } from "@src/enums/user.enum";
import { model, Model, Schema, Types } from "mongoose";

// Define the Notification interface
interface INotification {
  message: string;
  date: Date;
}

// Define the User interface extending Document
export interface IUser {
  last_name: string;
  first_name: string;
  username: string;
  password: string;
  bio: string;
  avatar: string;
  friends: Types.ObjectId[];
  groups: Types.ObjectId[];
  role: UserRole;
  status: UserStatus;
  notifications: INotification[];
  created_at: Date;
  updated_at: Date;
}

// Define the User Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    last_name: { type: String, required: true },
    first_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    friends: [{ type: Schema.Types.ObjectId, ref: "users" }],
    groups: [{ type: Schema.Types.ObjectId, ref: "groups" }],
    role: {
      type: String,
      enum: UserRole,
      default: UserRole.USER,
    },
    status: {
      type: String,
      enum: UserStatus,
      default: UserStatus.ACTIVE,
    },
    notifications: [
      {
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
      },
    ],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Create the User model
const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

export default UserModel;
