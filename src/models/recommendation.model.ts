import { z } from "zod";
import { ObjectIdToString } from "../utils/zod.utils";


const RecommendationSchema = z.object({
  matchId: z.any(),
  title: z.string(),
  description: z.string(),
  createdBy: z.any(),
  likes: z.array(z.string()),
  comments: z.array(z.string()),
  pictureId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Recommendation = z.infer<typeof RecommendationSchema>;

export const RecommendationWithId = RecommendationSchema.extend({
  _id: ObjectIdToString,
});

export type RecommendationWithId = z.infer<typeof RecommendationWithId>;

export const RecommendationWithoutTimestampsSchema = RecommendationSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export type RecommendationPayload = z.infer<
  typeof RecommendationWithoutTimestampsSchema
>;
