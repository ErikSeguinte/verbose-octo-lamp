import { ObjectId } from "mongodb";
import ismongoid from "validator/es/lib/isMongoId";
import { z } from "zod";

import { oid } from "./common";

export class UserType {
  _id: oid;
  email: string;
  discord: string;
  name: string;

  constructor({
    id = { $oid: "" },
    email,
    discord = "",
    name = "",
  }: {
    id?: oid;
    email: string;
    discord?: string;
    name?: string;
  }) {
    this._id = id;
    this.email = email;
    this.discord = discord;
    this.name = name;
  }
}

export const userFromDocSchema = z.object({
  _id: z.instanceof(ObjectId).transform((o) => o.toHexString()),
  discord: z
    .string()
    .optional()
    .nullable()
    .transform((s) => s ?? undefined),
  email: z.string().email(),
  name: z
    .string()
    .optional()
    .nullable()
    .transform((s) => s ?? undefined),
});

export type UserFromDoc = z.infer<typeof userFromDocSchema>;

export const userToDocSchema = z.object({
  _id: z
    .string()
    .refine((s) => ismongoid(s))
    .transform((s) => new ObjectId(s)),
  discord: userFromDocSchema.shape.discord,
  email: userFromDocSchema.shape.email,
  name: userFromDocSchema.shape.name,
});

export type UserToDoc = z.infer<typeof userToDocSchema>;

export const userDTOSchema = z.object({
  _id: z.string().refine((s) => ismongoid(s)),
  discord: userFromDocSchema.shape.discord,
  email: userFromDocSchema.shape.email,
  name: userFromDocSchema.shape.name,
});

export type UserDTO = z.infer<typeof userDTOSchema>;

export const userAdvancedQuerySchema = z.object({
  _id: z.object({
    $in: userDTOSchema.shape._id.transform((id) => new ObjectId(id)).array(),
  }),
});
export type UserAdvancedQuery = z.infer<typeof userAdvancedQuerySchema>;
export const userQuerySchema = userDTOSchema.partial();
export type UserQuery = z.infer<typeof userQuerySchema>;

export const userCreateSchema = userDTOSchema.omit({ _id: true });
export type UserCreate = z.infer<typeof userCreateSchema>;
