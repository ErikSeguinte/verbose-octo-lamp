"use server";
import { promises as fs } from "fs";

import { oid } from "@/models/common";
import { EventType } from "@/models/Event";

export const getAllEvents = async () => {
  const events = await readFile();
  return events;
};

export const getAllIds = async (): Promise<string[]> => {
  const events = await readFile();
  return events.map((e) => e.id["$oid"]);
};

export const getAllMapped = async () => {
  const events = await readFile();
  const map: Map<string, EventType> = new Map();
  events.forEach((e: EventType) => {
    map.set(e.id["$oid"] as string, e as EventType);
  });
  return map;
};

export type eventsJson = {
  id: { $oid: string };
  startDate: string;
  endDate: string;
  eventName: string;
  organizer: oid;
  participants: oid[];
};

export const readFile = async () => {
  const eventsFile = await fs.readFile(
    process.cwd() + "/utils/dummydata/events.json",
    "utf8"
  );
  const events: eventsJson[] = JSON.parse(eventsFile);
  return events.map((e) => {
    return EventType.fromJson({ ...e });
  });
};

export const getEventfromId = async (id: string) => {
  const events = await getAllMapped();
  return events.get(id);
};
