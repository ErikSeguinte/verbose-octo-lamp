"use server";
import { revalidatePath } from "next/cache";

import { EventQuery, EventQueryInput, EventQuerySchema } from "@/models/Event";
import { UserQuery, userQuerySchema } from "@/models/Users";
import { updateParticipants, updateTimeslots } from "@/utils/eventsDB";
import { saveUser } from "@/utils/usersDB";
import { tryParse } from "@/utils/utils";

interface submission {
  email: string;
  name: string;
  discord: string;
  eventId: string;
  timezone: string;
}

export async function submitToServer(s: submission) {
  const { discord, email, eventId, name } = s;

  const userQuery = tryParse<UserQuery>(
    { discord, email, name },
    userQuerySchema,
  );
  const user = await saveUser({ ...userQuery });

  const eventQuery = tryParse<EventQuery, EventQueryInput>(
    { _id: eventId, participants: [user._id] },
    EventQuerySchema,
  );
  const eventDoc = await updateParticipants(eventQuery);
  if (!eventDoc) throw Error();

  return user._id;
}

export async function saveTimeslots({
  eventId,
  userId,
  timeslots,
}: {
  eventId: string;
  userId: string;
  timeslots: string[];
}) {
  const doc = await updateTimeslots({
    eventId,
    selectedTimeslots: timeslots,
    userId,
  }).then((doc) => {
    revalidatePath(`/events/${eventId}`);
    return doc;
  });

  return doc;
}
