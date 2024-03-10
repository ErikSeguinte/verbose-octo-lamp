"use server";
import { promises as fs } from "fs";
import { DateTime } from "luxon";
import { Collection, ObjectId, OptionalId } from "mongodb";

import { eventsJson, EventType, timeSlots } from "@/models/Event";

import clientPromise from "./database";

export interface EventDocument {
  _id: ObjectId;
  startDate: Date;
  endDate: Date;
  eventName: string;
  organiser: ObjectId;
  participants: ObjectId[];
  inviteCode: ObjectId;
  timeSlots: Map<string, Set<ObjectId>>;
}

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

export const readFile = async () => {
  const eventsFile = await fs.readFile(
    process.cwd() + "/utils/dummydata/events.json",
    "utf8"
  );
  const events: eventsJson[] = JSON.parse(eventsFile, EventType.reviver);
  // console.log(events)
  return events.map((e) => {
    return EventType.fromJson(e);
  });
};

export const getEventfromId = async (id: string) => {
  const events = await getAllMapped();
  return events.get(id);
};

const getEventsDb = async () => {
  const events = (await clientPromise).db("octolamp").collection<EventDocument>("events");
  return events;
};

const getInsertEventsDb = async ( ) => {
  const events = (await clientPromise)
        .db("octolamp")
        .collection<OptionalId<EventDocument>>("events")
  return events
}

export const saveNewEvent = async (event: EventType) => {
  const events = await getInsertEventsDb();

  const doc = await events.insertOne({
    endDate: event.endDate.toJSDate(),
    eventName: event.eventName,
    inviteCode: new ObjectId(),
    organiser: new ObjectId(event.organizer.$oid),
    participants: new Array<ObjectId>(),
    startDate: event.startDate.toJSDate(),
    timeSlots: new Map<string, Set<ObjectId>>(),
  });
  return doc;
};

export const saveNewEventJSON = async (event:string) => {
  return saveNewEvent(JSON.parse(event, EventType.reviver))
}