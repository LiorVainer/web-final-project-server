import mongoose, { Document, Schema } from "mongoose";
import { Match } from "../models/match.model";

const MatchMongoSchema = new Schema(
  {
    homeTeam: { type: String, required: true },
    awayTeam: { type: String, required: true },
    date: { type: Date, required: true },
    competition: { type: String, required: true },
    country: { type: String, required: true },
    stadium: { type: String, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const MatchRepository = mongoose.model<Match>(
  "Matches",
  MatchMongoSchema
);
export type MatchDocument = Document<unknown, {}, Match> &
  Match &
  Required<{
    _id: string;
  }>;
