"use server";
import { Document } from "mongodb";
import { z } from "zod";

import {
  UserAdvancedQuery,
  userAdvancedQuerySchema,
  UserCreate,
  userCreateSchema,
  UserDTO,
  UserFromDoc,
  userFromDocSchema,
  UserQuery,
  UserToDoc,
  userToDocSchema,
} from "@/models/Users";
import clientPromise from "@/utils/database";

import { tryParse } from "./utils";

const getUserDB = async <T extends Document>() => {
  const users = (await clientPromise).db("octolamp").collection<T>("users");
  return users;
};

export const saveUser = async (user: UserQuery) => {
  const query = userToDocSchema.omit({ _id: true }).partial().parse(user);
  const users = await getUserDB();

  const doc = await users.findOneAndUpdate(
    { email: query.email },
    {
      $set: {
        ...(query.discord ? { discord: query.discord } : {}),
        ...(query.name ? { name: query.name } : {}),
      },
    },
    { returnDocument: "after", upsert: true },
  );

  if (!doc) throw new Error("Could not save user");

  return userFromDocSchema.parse(doc);
};

export async function findOneUser({
  query,
}: {
  query: UserQuery;
}): Promise<UserDTO | null> {
  const q = userToDocSchema.parse(query);

  const users = await getUserDB<UserToDoc>();

  const userDoc = await users.findOne(q);
  if (userDoc) {
    return userFromDocSchema.parse(userDoc);
  } else {
    return null;
  }
}

export async function createUser(dto: UserCreate): Promise<UserFromDoc> {
  const q = userCreateSchema.parse(dto);
  const userDocCreateSchema = userToDocSchema.omit({ _id: true });
  type userDocCreate = z.infer<typeof userDocCreateSchema>;
  const users = await getUserDB<userDocCreate>();

  const { insertedId } = await users.insertOne({ ...q });

  const userDoc = await users.findOne({ _id: insertedId });
  return userFromDocSchema.parse(userDoc);
}

export async function queryUsers({
  query,
}: {
  query: UserAdvancedQuery;
}): Promise<Array<UserFromDoc> | null> {
  const q = tryParse<UserAdvancedQuery>(query, userAdvancedQuerySchema);
  const users = await getUserDB<UserAdvancedQuery>();
  const results = await users.find(q).toArray();
  if (results) {
    const userDocs = userFromDocSchema.array().parse(results);
    return userDocs;
  } else return null;
}

export async function findUsers({ query }: { query: UserQuery }) {
  const partialDocSchema = userToDocSchema.partial();
  const validQuery = partialDocSchema.parse(query);

  const users = await getUserDB<UserToDoc>();

  const userDocs = await users.find(validQuery).toArray();
  if (userDocs) {
    return userFromDocSchema.array().parse(userDocs);
  } else return null;
}
