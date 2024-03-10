"use server";
import { promises as fs } from "fs";
import { ObjectId } from "mongodb";

import { oid } from "@/models/common";
import { UserType } from "@/models/Users";
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
  const us = await getUserDB();
  const us2 = us.find({});
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

const getUserDB = async () => {
  const users = (await clientPromise)
    .db("octolamp")
    .collection<UserDocument>("users");
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
  _id: ObjectId
  email: string,
  discord: string,
  name: string
}