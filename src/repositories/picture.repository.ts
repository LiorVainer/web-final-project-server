import mongoose, { Document, Schema } from "mongoose";
import { Picture } from "../models/picture.model";

const PictureMongoSchema = new Schema(
  {
    picture: { type: String, required: true }, //! give it a type of picture
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PictureRepository = mongoose.model<Picture>(
  "Pictures",
  PictureMongoSchema
);
export type PictureDocument = Document<unknown, {}, Picture> &
  Picture &
  Required<{
    _id: string;
  }> & {
    __v: number;
  };
