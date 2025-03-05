import { z } from "zod";
import { ObjectIdToString } from "../utils/zod.utils";

const MatchExperienceSchema = z.object({
  homeTeam: z.string(),
  awayTeam: z.string(),
  matchDate: z.date(),
  league: z.string(),
  country: z.string(),
  stadium: z.string(),
  title: z.string(),
  description: z.string(),
  createdBy: z.any(),
  likes: z.array(z.string()),
  comments: z.array(z.string()),
  picture: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MatchExperience = z.infer<typeof MatchExperienceSchema>;

export const MatchExperienceWithId = MatchExperienceSchema.extend({
  _id: ObjectIdToString,
});

export type MatchExperienceWithId = z.infer<typeof MatchExperienceWithId>;

export const MatchExperienceWithoutTimestampsSchema =
  MatchExperienceSchema.omit({
    createdAt: true,
    updatedAt: true,
  });

export type MatchExperiencePayload = z.infer<
  typeof MatchExperienceWithoutTimestampsSchema
>;
