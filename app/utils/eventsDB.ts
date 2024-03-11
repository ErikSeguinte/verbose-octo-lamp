"use server";
import { Document, ObjectId, } from "mongodb";
import { ulid } from "ulid";
import { z } from "zod";

import {
  EventCreate,
  eventCreateSchema,
  EventDoc,
  eventDocSchema,
  EventDTO,
  EventQuery,
  eventQuerySchema,
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
}): Promise<EventDTO | null> {
  const validQuery = eventQuerySchema.parse(query);

  const partialDoc = eventDocSchema.partial();
  type partialDoc = z.infer<typeof partialDoc>;

  const q: partialDoc = partialDoc.parse({
    ...validQuery,
    ...(validQuery.id ? { _id: new ObjectId(validQuery.id) } : {}),
  });

  const events = await getEventsDb<EventDoc>();

  const eventDoc = await events.findOne(q);
  return eventDoc ? EventDTO.convertFromDoc(eventDoc) : null;
}

export async function createEvent(dto: EventCreate): Promise<EventDTO> {
  const validDTO = eventCreateSchema.parse(dto);
  const eventDocCreateSchema = eventDocSchema.omit({ _id: true });
  type EventDocCreate = z.infer<typeof eventDocCreateSchema>;
  const q = eventDocCreateSchema.parse({
    ...validDTO,
    inviteCode: ulid(),
    organizer: new ObjectId(validDTO.organizer),
  });
  const events = await getEventsDb<EventDocCreate>();

  const { insertedId } = await events.insertOne({ ...q });

  return EventDTO.convertFromDoc({ ...q, _id: insertedId } as EventDoc);
}

export async function findEvents({ query }: { query: EventQuery }) {
  const validQuery = eventQuerySchema.parse(query);

  const partialDoc = eventDocSchema.partial();
  type partialDoc = z.infer<typeof partialDoc>;

  const q: partialDoc = partialDoc.parse({
    ...validQuery,
    ...(validQuery.id ? { _id: new ObjectId(validQuery.id) } : {}),
  });

  const events = await getEventsDb<EventDoc>();

  const eventDocs = await z
    .array(eventDocSchema)
    .promise()
    .parse(events.find({ q }).toArray());
  return eventDocs
    ? eventDocs.map((doc) => EventDTO.convertFromDoc(doc))
    : null;
}
