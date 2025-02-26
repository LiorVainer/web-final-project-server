import mongoose, {Document, Schema} from "mongoose";
import {Comment, Recommendation} from "../models/recommendation.model";

// Create a Mongoose subdocument schema for Comment.
// Note: Mongoose automatically creates an _id for top-level documents,
// but for subdocuments we define _id explicitly to match the Zod schema.
const CommentMongoSchema = new Schema<Comment>({
    _id: {type: String, required: true},
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    content: {type: String, required: true},
    createdAt: {type: Date, required: true, default: Date.now},
});

// Create the Recommendation Mongoose schema
const RecommendationMongoSchema = new Schema<Recommendation>({
    _id: {type: String, required: true},
    matchId: {type: Schema.Types.ObjectId, ref: 'Match', required: true},
    createdBy: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    description: {type: String, required: true},
    likes: [{type: String}],
    comments: {type: [CommentMongoSchema], default: []},
    pictureId: {type: String},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
});

// Create and export the Recommendation model
export const RecommendationRepository = mongoose.model<Recommendation>(
    "Recommendations",
    RecommendationMongoSchema,
);

// Optionally, you can also define a type for the document:
export type RecommendationDocument = Document<unknown, {}, Recommendation> &
    Recommendation & {
    __v: number;
};
