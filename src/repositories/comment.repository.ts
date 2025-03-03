import mongoose, { Document, Schema } from "mongoose";
import { Comment } from "../models/comment.model";

const CommentMongoSchema = new Schema(
  {
    recommendationId: { type: String, required: true },
    userId: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const CommentRepository = mongoose.model<Comment>(
  "Comments",
  CommentMongoSchema
);
export type CommentDocument = Document<unknown, {}, Comment> &
  Comment &
  Required<{
    _id: string;
  }> & {
    __v: number;
  };
