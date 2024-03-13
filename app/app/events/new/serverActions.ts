"use server";
import { EventFromDoc, EventQuery, eventQuerySchema } from "@/models/Event";
import { UserCreate, userCreateSchema, UserDTO } from "@/models/Users";
import { createEvent } from "@/utils/eventsDB";
import { saveUser } from "@/utils/usersDB";
import { tryParse } from "@/utils/utils";

export const handleSubmit = async (user: UserCreate, event: EventQuery) => {
  const userQuery = tryParse<UserCreate, UserCreate>(user, userCreateSchema);
  const savedUser: UserDTO = await saveUser(userQuery);

  const eventQuery = tryParse<EventQuery, EventQuery>(
    { ...event, organizer: savedUser._id },
    eventQuerySchema,
  );

  const savedEvent: EventFromDoc = await createEvent(eventQuery);

  return savedEvent;
};
