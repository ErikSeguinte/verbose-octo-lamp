"use server";

import { fromZodError, ZodError } from "zod-validation-error";

import { eventCreateSchema, EventDTO, EventQuery } from "@/models/Event";
import { UserCreate, userCreateSchema, UserDTO } from "@/models/Users";
import { createEvent } from "@/utils/eventsDB";
import { createUser } from "@/utils/usersDB";

export const handleSubmit = async (user: UserCreate, event: EventQuery) => {
  try {
    var u = userCreateSchema.parse(user);
  } catch (err) {
    const validationError = fromZodError(err as ZodError);
    return validationError.toString();
  }
  const savedUser: UserDTO = await createUser(u);

  try {
    var e = eventCreateSchema.parse({ ...event, organizer: savedUser.id });
  } catch (err) {
    const validationError = fromZodError(err as ZodError);
    return validationError.toString();
  }

  const savedEvent: EventDTO = await createEvent(e);

  return savedEvent;
};
