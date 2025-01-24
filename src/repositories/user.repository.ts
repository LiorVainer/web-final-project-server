import { refresh } from "../controllers/auth.controller";
import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";
import { ObjectIdSchema, ObjectIdToString } from "../utils/zod.utils";
import { User } from "../models/user.model";

const UserMongoSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    pictureId: { type: String, required: true },
    refreshTokens: { type: [String], default: [] },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const UserRepository = mongoose.model<User>("Users", UserMongoSchema);
export type UserDocument = Document<unknown, {}, User> &
  User &
  Required<{
    _id: string;
  }> & {
    __v: number;
  };
