"use server";
import { promises as fs } from "fs";

import { oid } from "@/models/common";
import { UserType } from "@/models/Users";

export const getAllEvents = async () => {
  const events = await readFile();
  return events;
};

export const getAllIds = async (): Promise<string[]> => {
  const events = await readFile();
  return events.map((u) => u.id["$oid"]);
};

export const getAllMapped = async () => {
  const users = await readFile();
  const map: Map<string, UserType> = new Map();
  users.forEach((u: UserType) => {
    map.set(u.id["$oid"] as string, u as UserType);
  });
  return map;
};

export type userJson = {
  id: oid
    name: string
    email: string
    discord: string
};

export const readFile = async () => {
  const usersFile = await fs.readFile(
    process.cwd() + "/utils/dummydata/users.json",
    "utf8"
  );
  const users: userJson[] = JSON.parse(usersFile);
  return users.map((u) => {
    u.discord = u.discord? u.discord: ""
    return new UserType({...u});
  });
};

export const getUserFromId = async (id: string) => {
  const users = await getAllMapped();
  return users.get(id);
};
