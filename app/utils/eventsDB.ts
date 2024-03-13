"use server";
import { Document } from "mongodb";
import { ulid } from "ulid";
import { z } from "zod";

import {
  EventDoc,
  eventDocSchema,
  EventDTO,
  EventDTOInput,
  eventDTOSchema,
  EventQuery,
  eventSortType,
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
}): Promise<EventDTO | null> {
  const q = eventDocSchema.partial().parse(query);
  const events = await getEventDB();
  const eventDoc = await events.findOne(q);
  return eventDoc ? eventDTOSchema.parse(eventDoc) : null;
}

export async function createEvent(dto: EventQuery): Promise<EventDTO> {
  const eventDocCreateSchema = eventDocSchema.omit({ _id: true });
  type EventDocCreateOutput = z.infer<typeof eventDocCreateSchema>;

  const q = tryParse<EventDocCreateOutput>(
    {
      ...dto,
      inviteCode: ulid(),
      participants: new Set<string>(),
      timeslots: {},
    },
    eventDocCreateSchema,
  );
  const events = await getEventDB<EventDocCreateOutput>();
  const { insertedId } = await events.insertOne(q);
  const newEvent = await events.findOne({ _id: insertedId });
  if (!newEvent) {
    throw new Error();
  }
  const parsedEvent = tryParse<EventDTO, EventDTOInput>(
    newEvent,
    eventDTOSchema,
  );

  return eventDTOSchema.parse(parsedEvent);
}

export async function findAllEvents() {
  const events = await getEventDB<EventDoc>();

  const eventDocs = await events.find({}).toArray();
  return eventDocs ? eventDTOSchema.array().parse(eventDocs) : null;
}

export async function queryEvents({
  query,
  sort,
}: {
  query?: EventQuery;
  sort: eventSortType;
}): Promise<Array<EventDTO> | null> {
  const q = query ? tryParse<EventDoc>(query, eventDocSchema) : {};
  const events = await getEventDB<EventDoc>();
  const results = await events.find(q).sort(sort).toArray();
  if (results) {
    const eventDocs = eventDTOSchema.array().parse(results);
    return eventDocs;
  } else return null;
}
