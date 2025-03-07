import { z } from 'zod';
import { ObjectIdToString, zodDate } from '../utils/zod.utils';

export const UserSchema = z.object({
    username: z.string(),
    password: z.string(),
    email: z.string(),
    pictureId: z.string(),
    createdAt: zodDate,
    updatedAt: zodDate,
    refreshTokens: z.string().array().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserWithId = UserSchema.extend({
    _id: ObjectIdToString,
});

export const PublicUserSchema = UserSchema.omit({
    password: true,
    refreshTokens: true,
});

export type PublicUser = z.infer<typeof PublicUserSchema>;

export type UserWithId = z.infer<typeof UserWithId>;

export const UserWithoutTimestampsSchema = UserSchema.omit({
    createdAt: true,
    updatedAt: true,
});

export type UserPayload = z.infer<typeof UserWithoutTimestampsSchema>;
