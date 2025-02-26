import mongoose, {Schema} from "mongoose";
import {Match} from "../models/match.model";

export const MatchMongoSchema = new Schema<Match>({
    _id: {type: String, required: true},
    homeTeam: {type: String, required: true},
    awayTeam: {type: String, required: true},
    date: {type: Date, required: true},
    competition: {type: String, required: true},
    country: {type: String, required: true},
    stadium: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
});

export const MatchRepository = mongoose.model<Match>('Match', MatchMongoSchema);