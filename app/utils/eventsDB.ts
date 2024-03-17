"use server";
import { Set as ImmutableSet } from "immutable";
import { Document, ObjectId } from "mongodb";
import { ulid } from "ulid";
import { z } from "zod";

import {
  EventDoc,
  EventDocInput,
  eventDocSchema,
  EventDTO,
  EventDTOInput,
  eventDTOSchema,
  EventQuery,
  EventQueryInput,
  EventQuerySchema,
  eventSortType,
} from "@/models/Event";

import clientPromise from "./database";
import { tryParse } from "./utils";

// see https://github.com/vercel/next.js/pull/62821

export async function getEventDB<T extends Document = EventDoc>() {
  const events = (await clientPromise).db("octolamp").collection<T>("events");
  return events;
}

export async function findOneEvent(
  query: EventQuery,
): Promise<EventDTO | null> {
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

export async function updateEvent(query: EventQuery) {
  const q = tryParse<EventDoc>(query, eventDocSchema);

  const events = await getEventDB();
  const result = events.findOneAndUpdate({ _id: q._id }, { q });
  const eventDoc: EventDTO = tryParse<EventDTO>(result, eventDTOSchema);

  return eventDoc;
}

export async function updateParticipants(query: EventQuery) {
  const eventDocQuerySchema = eventDocSchema.partial();
  type EventDocQuery = z.infer<typeof eventDocQuerySchema>;
  type EventDocQueryInput = z.input<typeof eventDocQuerySchema>;
  const q = tryParse<EventDocQuery, EventDocQueryInput>(
    query,
    eventDocQuerySchema,
  );

  const events = await getEventDB();
  const result = await events.findOne({ _id: new ObjectId(q._id) });
  if (!result || !result.participants || !q.participants) {
    throw new Error();
  }

  const updatedParticipants = new Set([
    ...result.participants,
    ...q.participants,
  ]);
  result.participants = Array.from(updatedParticipants);

  const updatedcandidate = tryParse<EventDoc, EventDocInput>(
    result,
    eventDocSchema,
  );
  const updatedResult = await events.findOneAndUpdate(
    { _id: updatedcandidate._id },
    { $set: { participants: updatedcandidate.participants } },
    { returnDocument: "after" },
  );
  if (!updatedResult) {
    throw new Error();
  }
  const updatedDoc = tryParse<EventDTO, EventDTOInput>(
    updatedResult,
    EventQuerySchema,
  );
  return updatedDoc;
}

export const updateTimeslots = async ({
  eventId,
  userId,
  selectedTimeslots,
}: {
  eventId: string;
  userId: string;
  selectedTimeslots: string[];
}) => {
  const query = tryParse<EventQuery, EventQueryInput>(
    { _id: eventId },
    EventQuerySchema,
  );
  const eventDoc = await findOneEvent(query);
  if (!eventDoc) throw Error("Event not found.");
  const eventItem = tryParse<EventDTO, EventDTOInput>(eventDoc, eventDTOSchema);
  if (eventItem.timeslots) {
    const timeslots = ImmutableSet(ImmutableSet.fromKeys(eventItem.timeslots));
    const selectedSet = ImmutableSet(selectedTimeslots);
    timeslots.subtract(selectedSet).forEach((key) => {
      eventItem.timeslots[key].delete(userId);
      if (eventItem.timeslots[key].size === 0) {
        delete eventItem.timeslots[key];
      }
    });
  }
  for (let key of selectedTimeslots) {
    if (eventItem.timeslots[key]) {
      eventItem.timeslots[key].add(userId);
    } else {
      eventItem.timeslots[key] = new Set([userId]);
    }
  }

  const events = await getEventDB<EventDoc>();
  const newDoc = tryParse<EventDoc, EventDocInput>(eventItem, eventDocSchema);

  const newEventItem = await events.findOneAndReplace(
    { _id: newDoc._id },
    newDoc,
  );
  if (!newEventItem) throw Error("Could not replace document");

  return tryParse<EventDTO, EventDTOInput>(newEventItem, eventDTOSchema);
};
