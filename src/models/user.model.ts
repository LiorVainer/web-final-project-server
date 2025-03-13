import { z } from "zod";
import { ObjectIdToString } from "../utils/zod.utils";

export const UserSchema = z.object({
  username: z.string(),
  password: z.string(),
  email: z.string(),
  picture: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  refreshTokens: z.string().array().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserWithId = UserSchema.extend({
  _id: ObjectIdToString,
});

export type UserWithId = z.infer<typeof UserWithId>;

export const UserWithoutTimestampsSchema = UserSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export type UserPayload = z.infer<typeof UserWithoutTimestampsSchema>;
