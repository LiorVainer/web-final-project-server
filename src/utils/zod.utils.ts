import mongoose from "mongoose";
import { ZodType, z } from "zod";

export const ObjectIdSchema: ZodType<
  mongoose.Types.ObjectId,
  z.ZodTypeDef,
  string
> = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  })
  .transform((val) => new mongoose.Types.ObjectId(val));

export const ObjectIdToString: ZodType<
  string,
  z.ZodTypeDef,
  mongoose.Types.ObjectId
> = z.instanceof(mongoose.Types.ObjectId).transform((val) => val.toHexString());
