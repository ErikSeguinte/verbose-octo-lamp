"use server";
import { promises as fs } from "fs";
import { Document, ObjectId } from "mongodb";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import { oid } from "@/models/common";
import {
  UserAdvancedQuery,
  userAdvancedQuerySchema,
  UserCreate,
  userCreateSchema,
  UserDoc,
  userDocSchema,
  UserDTO,
  UserQuery,
  userQuerySchema,
  UserType,
} from "@/models/Users";
import clientPromise from "@/utils/database";

export const getAllUsers = async () => {
  const events = await readFile();
  return events;
};

export const getAllIds = async (): Promise<string[]> => {
  const events = await readFile();
  return events.map((u) => u._id["$oid"]);
};

export const getAllMapped = async () => {
  const users = await readFile();
  const map: Map<string, UserType> = new Map();
  users.forEach((u: UserType) => {
    map.set(u._id["$oid"] as string, u as UserType);
  });
  return map;
};

export type userJson = {
  id: oid;
  name: string;
  email: string;
  discord: string;
};

export const readFile = async () => {
  const usersFile = await fs.readFile(
    process.cwd() + "/utils/dummydata/users.json",
    "utf8",
  );
  const users: userJson[] = JSON.parse(usersFile);
  return users.map((u) => {
    u.discord = u.discord ? u.discord : "";
    return new UserType({ ...u });
  });
};

export const getUserFromId = async (id: string) => {
  const users = await getAllMapped();
  return users.get(id);
};

const getUserDB = async <T extends Document>() => {
  const users = (await clientPromise).db("octolamp").collection<T>("users");
  return users;
};

export const saveUser = async (user: UserType) => {
  const users = await getUserDB();

  const doc = await users.updateOne(
    { email: user.email },
    { $set: { discord: user.discord, name: user.name } },
    { upsert: true },
  );
  return String(doc);
};
export interface UserDocument {
  _id: ObjectId;
  email: string;
  discord: string;
  name: string;
}

export async function findOneUser({
  query,
}: {
  query: UserQuery;
}): Promise<UserDTO | null> {
  const q = {
    ...(query.discord ? { discord: query.discord as string } : {}),
    ...(query.email ? { email: query.email } : {}),
    ...(query.name ? { name: query.name } : {}),
    ...(query.id ? { _id: new ObjectId(query.id) } : {}),
  };

  const users = await getUserDB<UserDoc>();

  const userDoc = await users.findOne(q);
  return userDoc ? UserDTO.convertFromDoc(userDoc) : null;
}

export async function createUser(dto: UserCreate): Promise<UserDTO> {
  const q = userCreateSchema.parse(dto);
  const userDocCreateSchema = userDocSchema.omit({ _id: true });
  type userDocCreate = z.infer<typeof userDocCreateSchema>;
  const users = await getUserDB<userDocCreate>();

  const { insertedId } = await users.insertOne({ ...q });

  return UserDTO.convertFromDoc({ ...dto, _id: insertedId } as UserDoc);
}

export async function queryUsers({ query }: { query: UserAdvancedQuery }) {
  const q = ((query: UserAdvancedQuery) => {
    try {
      const q = userAdvancedQuerySchema.parse(query);
      return q;
    } catch (err) {
      if (err instanceof ZodError) {
        const validationError = fromZodError(err);
        console.error(validationError.toString());
      }
    }
  })(query);

  const users = await getUserDB<UserDoc>();

  const results = await users.find({ query: q }).toArray();
  if (results) {
    const userDocs = userDocSchema.array().parse(results);
    return userDocs.map((d) => UserDTO.convertFromDoc(d));
  }
}

export async function findUsers({ query }: { query: UserQuery }) {
  const validQuery = userQuerySchema.parse(query);

  const partialDoc = userDocSchema.partial();
  type partialDoc = z.infer<typeof partialDoc>;

  const q: partialDoc = partialDoc.parse({
    ...validQuery,
    ...(validQuery.id ? { _id: new ObjectId(validQuery.id as string) } : {}),
  });

  const users = await getUserDB<UserDoc>();

  const userDocs = await z
    .array(userDocSchema)
    .promise()
    .parse(users.find({ q }).toArray());
  return userDocs ? userDocs.map((doc) => UserDTO.convertFromDoc(doc)) : null;
}
