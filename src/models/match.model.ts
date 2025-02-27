import { z } from "zod";
import { ObjectIdToString } from "../utils/zod.utils";

export const MatchSchema = z.object({
  homeTeam: z.string(),
  awayTeam: z.string(),
  date: z.date(),
  competition: z.string(),
  country: z.string(),
  stadium: z.string(),
  createdAt: z.date(),
});

export type Match = z.infer<typeof MatchSchema>;

export const MatchWithId = MatchSchema.extend({
  _id: ObjectIdToString,
});

export type MatchWithId = z.infer<typeof MatchWithId>;

export const MatchWithoutTimestampsSchema = MatchSchema.omit({
  createdAt: true,
});

export type MatchPayload = z.infer<typeof MatchWithoutTimestampsSchema>;
