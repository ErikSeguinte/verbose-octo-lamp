"use server";
import { Document } from "mongodb";
import { ulid } from "ulid";
import { z } from "zod";

import {
  EventCreate,
  EventFromDoc,
  eventFromDocSchema,
  EventQuery,
  eventToDocSchema,
} from "@/models/Event";

import clientPromise from "./database";

// see https://github.com/vercel/next.js/pull/62821

export async function getEventsDb<T extends Document>() {
  const events = (await clientPromise).db("octolamp").collection<T>("events");
  return events;
}

export async function findOneEvent({
  query,
}: {
  query: EventQuery;
}): Promise<EventFromDoc | null> {
  const q = eventToDocSchema.partial().parse(query);
  const events = await getEventsDb();
  const eventDoc = await events.findOne(q);
  return eventDoc ? eventFromDocSchema.parse(eventDoc) : null;
}

export async function createEvent(dto: EventCreate): Promise<EventFromDoc> {
  const eventDocCreateSchema = eventToDocSchema.omit({ _id: true });
  type EventDocCreateInput = z.input<typeof eventDocCreateSchema>;
  type EventDocCreateOutput = z.infer<typeof eventDocCreateSchema>;

  const q: EventDocCreateInput = {
    ...dto,
    inviteCode: ulid(),
    participants: new Set<string>(),
  };
  const events = await getEventsDb<EventDocCreateOutput>();
  const query: EventDocCreateOutput = eventDocCreateSchema.parse(q);
  const { insertedId } = await events.insertOne(query);
  const newEvent = await events.findOne({ _id: insertedId });

  return eventFromDocSchema.parse({ ...newEvent });
}

export async function findAllEvents() {
  const events = await getEventsDb<EventFromDoc>();

  const eventDocs = await events.find({}).toArray();
  return eventDocs ? eventFromDocSchema.array().parse(eventDocs) : null;
}
