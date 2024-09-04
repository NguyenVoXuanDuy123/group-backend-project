import { UserRole, UserStatus } from "@src/enums/user.enums";
import { model, Model, Schema, Types } from "mongoose";

// Define the User interface extending Document
export interface IUser {
  lastName: string;
  firstName: string;
  username: string;
  password: string;
  bio: string;
  avatar: string;
  friends: Types.ObjectId[];
  groups: Types.ObjectId[];
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User Schema
const UserSchema: Schema<IUser> = new Schema(
  {
    lastName: { type: String, required: true },
    firstName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String, default: "" },
    friends: [{ type: Schema.Types.ObjectId, ref: "users" }],
    groups: [{ type: Schema.Types.ObjectId, ref: "groups" }],
    avatar: { type: String, default: "" },
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
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);

UserSchema.index({ username: 1 });

// Create the User model
const UserModel: Model<IUser> = model<IUser>("User", UserSchema);

export default UserModel;
