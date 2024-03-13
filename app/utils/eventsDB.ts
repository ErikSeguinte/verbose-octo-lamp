"use server";
import { Document } from "mongodb";
import { ulid } from "ulid";
import { z } from "zod";

import {
  EventFromDoc,
  eventFromDocSchema,
  EventQuery,
  eventSortType,
  EventToDoc,
  eventToDocSchema,
} from "@/models/Event";

import clientPromise from "./database";
import { tryParse } from "./utils";

// see https://github.com/vercel/next.js/pull/62821

export async function getEventDB<T extends Document>() {
  const events = (await clientPromise).db("octolamp").collection<T>("events");
  return events;
}

export async function findOneEvent({
  query,
}: {
  query: EventQuery;
}): Promise<EventFromDoc | null> {
  const q = eventToDocSchema.partial().parse(query);
  const events = await getEventDB();
  const eventDoc = await events.findOne(q);
  return eventDoc ? eventFromDocSchema.parse(eventDoc) : null;
}

export async function createEvent(dto: EventQuery): Promise<EventFromDoc> {
  const eventDocCreateSchema = eventToDocSchema.omit({ _id: true });
  type EventDocCreateOutput = z.infer<typeof eventDocCreateSchema>;

  const q = tryParse<EventQuery, EventDocCreateOutput>(
    {
      ...dto,
      inviteCode: ulid(),
      participants: new Set<string>(),
    },
    eventDocCreateSchema,
  );
  const events = await getEventDB<EventDocCreateOutput>();
  const { insertedId } = await events.insertOne(q);
  const newEvent = await events.findOne({ _id: insertedId });

  return eventFromDocSchema.parse({ ...newEvent });
}

export async function findAllEvents() {
  const events = await getEventDB<EventFromDoc>();

  const eventDocs = await events.find({}).toArray();
  return eventDocs ? eventFromDocSchema.array().parse(eventDocs) : null;
}

export async function queryEvents({
  query,
  sort,
}: {
  query?: EventQuery;
  sort: eventSortType;
}): Promise<Array<EventFromDoc> | null> {
  const q = query
    ? tryParse<EventQuery, EventToDoc>(query, eventToDocSchema)
    : {};
  const events = await getEventDB<EventToDoc>();
  const results = await events.find(q).sort(sort).toArray();
  if (results) {
    const eventDocs = eventFromDocSchema.array().parse(results);
    return eventDocs;
  } else return null;
}
