"use server";
import { Document, ObjectId } from "mongodb";
import { ulid } from "ulid";
import { z } from "zod";

import {
  EventCreate,
  eventCreateSchema,
  EventFromDoc,
  eventFromDocSchema,
  EventQuery,
  eventQuerySchema,
  EventToDoc,
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
  const validQuery = eventQuerySchema.parse(query);

  const partialDoc = eventFromDocSchema.partial();
  type partialDoc = z.infer<typeof partialDoc>;

  const q: partialDoc = partialDoc.parse({
    ...validQuery,
    ...(validQuery.id ? { _id: new ObjectId(validQuery.id) } : {}),
  });

  const events = await getEventsDb<EventFromDoc>();

  const eventDoc = await events.findOne(q);
  return eventDoc ? EventDTO.convertFromDoc(eventDoc) : null;
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

  console.log(String(newEvent?.startDate));

  return eventFromDocSchema.parse({ ...newEvent });
}

export async function findEvents({ query }: { query: EventQuery }) {
  const validQuery = eventQuerySchema.parse(query);

  const partialDoc = eventFromDocSchema.partial();
  type partialDoc = z.infer<typeof partialDoc>;

  const q: partialDoc = partialDoc.parse({
    ...validQuery,
    ...(validQuery.id ? { _id: new ObjectId(validQuery.id) } : {}),
  });

  const events = await getEventsDb<EventFromDoc>();

  const eventDocs = await z
    .array(eventFromDocSchema)
    .promise()
    .parse(events.find({ q }).toArray());
  return eventDocs
    ? eventDocs.map((doc) => EventDTO.convertFromDoc(doc))
    : null;
}
