import { z } from "zod";
import { ObjectIdToString } from "../utils/zod.utils";

const PictureSchema = z.object({
  picture: z.any(),
  createdAt: z.date(),
});

export type Picture = z.infer<typeof PictureSchema>;

export const PictureWithId = PictureSchema.extend({
  _id: ObjectIdToString,
});

export type PictureWithId = z.infer<typeof PictureWithId>;

export const PictureWithoutTimestampsSchema = PictureSchema.omit({
  createdAt: true,
});

export type PicturePayload = z.infer<typeof PictureWithoutTimestampsSchema>;
