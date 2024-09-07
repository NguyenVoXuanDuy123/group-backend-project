import { model, Model, Schema, Types } from "mongoose";

type Newsfeed = {
  // user who owns the newsfeed
  owner: Types.ObjectId;
  post: Types.ObjectId;
  // group that post belongs to
  group: Types.ObjectId | null;
  // author of the post
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

const NewsfeedSchema = new Schema<Newsfeed>(
  {
    owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
    post: { type: Schema.Types.ObjectId, ref: "posts", required: true },
    group: { type: Schema.Types.ObjectId, ref: "groups" },
    author: { type: Schema.Types.ObjectId, ref: "users", required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

NewsfeedSchema.index({ owner: 1, author: 1 });
NewsfeedSchema.index({ owner: 1, group: 1 });
NewsfeedSchema.index({ owner: 1, createdAt: -1 });
NewsfeedSchema.index({ post: 1 });

const NewsfeedModel: Model<Newsfeed> = model("newsfeed", NewsfeedSchema);

export default NewsfeedModel;
