import { z } from "zod";
import { ObjectIdToString } from "../utils/zod.utils";

export const CommentSchema = z.object({
  matchExperienceId: z.string(),
  userId: z.string(),
  content: z.string(),
  createdAt: z.date(),
});

export type Comment = z.infer<typeof CommentSchema>;

export const CommentWithId = CommentSchema.extend({
  _id: ObjectIdToString,
});

export type CommentWithId = z.infer<typeof CommentWithId>;

export const CommentWithoutTimestampsSchema = CommentSchema.omit({
  createdAt: true,
});

export type CommentPayload = z.infer<typeof CommentWithoutTimestampsSchema>;
