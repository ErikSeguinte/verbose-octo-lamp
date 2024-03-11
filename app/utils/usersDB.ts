"use server";
import { promises as fs } from "fs";
import { Document, ObjectId } from "mongodb";
import { z } from "zod";

import { oid } from "@/models/common";
import {
  UserCreate,
  userCreateSchema,
  UserDoc,
  UserDocSchema,
  UserDTO,
  UserQuery,
  UserType} from "@/models/Users";
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
    "utf8"
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
  const users = (await clientPromise)
    .db("octolamp")
    .collection<T>("users");
  return users;
};

export const saveUser = async (user: UserType) => {
  const users = await getUserDB();

  const doc = await users.updateOne(
    { email: user.email },
    { $set: { discord: user.discord, name: user.name } },
    { upsert: true }
  );
  return String(doc);
};
export interface UserDocument {
  _id: ObjectId;
  email: string;
  discord: string;
  name: string;
}

export async function findUser({
  query,
}: {
  query: UserQuery

}): Promise<UserDTO | null> {

  const q = {
    ...(query.discord ? {discord: query.discord as string}: {}),
    ...(query.email ? {email: query.email}: {}),
    ...(query.name ? {name: query.name}: {}),
    ...(query.id ? {_id: new ObjectId(query.id)}: {}),
  }

  const users = await getUserDB<UserDoc>();

  const userDoc = await users.findOne(q)
  return userDoc ? UserDTO.convertFromDoc(userDoc) : null

}

export async function createUser(dto: UserCreate): Promise<UserDTO> {
  const q = userCreateSchema.parse(dto)
  const userDocCreateSchema = UserDocSchema.omit({_id: true})
  type userDocCreate = z.infer<typeof userDocCreateSchema>
  const users = await getUserDB<userDocCreate>()

  const { insertedId }  = await users.insertOne({...q})
  
  return UserDTO.convertFromDoc({...dto, _id:insertedId} as UserDoc)
}