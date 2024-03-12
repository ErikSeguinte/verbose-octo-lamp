"use server";

import { z } from "zod";
import { fromZodError, ZodError } from "zod-validation-error";

import {
  eventCreateSchema,
  EventDTO,
  eventDTOSchema,
  EventFromDoc,
  EventQuery,
} from "@/models/Event";
import { UserCreate, userCreateSchema, UserDTO } from "@/models/Users";
import { createEvent } from "@/utils/eventsDB";
import { createUser } from "@/utils/usersDB";

export const handleSubmit = async (user: UserCreate, event: EventQuery) => {
  try {
    var u = userCreateSchema.parse(user);
  } catch (err) {
    const validationError = fromZodError(err as ZodError);
    return `Error parsing user. ${validationError.toString()}`;
  }
  const savedUser: UserDTO = await createUser(u);

  const eventInputSchema = eventDTOSchema.omit({
    _id: true,
    inviteCode: true,
    participants: true,
  });
  try {
    var e = eventInputSchema.parse({ ...event, organizer: savedUser.id });
  } catch (err) {
    const validationError = fromZodError(err as ZodError);
    return `Error parsing event. ${validationError.toString()}`;
  }

  const savedEvent: EventFromDoc = await createEvent(e);

  return savedEvent;
};
