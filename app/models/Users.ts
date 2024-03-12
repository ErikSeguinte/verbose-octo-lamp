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

export const userDocSchema = z.object({
  _id: z.instanceof(ObjectId),
  discord: z.string().optional(),
  email: z.string().email(),
  name: z.string().optional(),
});

export type UserDoc = z.infer<typeof userDocSchema>;

export const userDTOSchema = z.object({
  discord: userDocSchema.shape.discord,
  email: userDocSchema.shape.email,
  id: z.string().refine((s) => ismongoid(s)),
  name: userDocSchema.shape.name,
});

export type UserDTO = z.infer<typeof userDTOSchema>;

export const UserDTO = {
  convertFromDoc(doc: UserDoc): UserDTO {
    const dto: UserDTO = {
      discord: doc.discord,
      email: doc.email,
      id: doc._id.toHexString(),
      name: doc.name,
    };
    return userDTOSchema.parse(dto);
  },

  toDoc(dto: UserDTO): UserDoc {
    const doc: UserDoc = {
      ...dto,
      _id: new ObjectId(dto.id),
    };
    return userDocSchema.parse(doc);
  },
};

export const userAdvancedQuerySchema = z.object({
  _id: z.object({
    $in: userDTOSchema.shape.id.transform((id) => new ObjectId(id)).array(),
  }),
});
export type UserAdvancedQuery = z.infer<typeof userAdvancedQuerySchema>;
export const userQuerySchema = userDTOSchema.partial();
export type UserQuery = z.infer<typeof userQuerySchema>;

export const userCreateSchema = userDTOSchema.omit({ id: true });
export type UserCreate = z.infer<typeof userCreateSchema>;
