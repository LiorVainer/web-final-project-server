import mongoose, { Document, Schema } from "mongoose";
import { Recommendation } from "../models/recommendation.model";

const RecommendationMongoSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    likes: [{ type: [String], default: [] }],
    comments: { type: [String], default: [] },
    pictureId: { type: String, required: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

// Create and export the Recommendation model
export const RecommendationRepository = mongoose.model<Recommendation>(
  "Recommendations",
  RecommendationMongoSchema
);

// Optionally, you can also define a type for the document:
export type RecommendationDocument = Document<unknown, {}, Recommendation> &
  Recommendation & {
    __v: number;
  };
