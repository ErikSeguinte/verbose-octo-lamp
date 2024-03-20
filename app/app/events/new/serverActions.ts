"use server";
import { revalidatePath } from "next/cache";

import {
  EventDTO,
  EventQuery,
  EventQueryInput,
  EventQuerySchema,
} from "@/models/Event";
import { UserCreate, userCreateSchema, UserDTO } from "@/models/Users";
import { createEvent } from "@/utils/eventsDB";
import { saveUser } from "@/utils/usersDB";
import { tryParse } from "@/utils/utils";
import { redirect } from "next/navigation";

export const handleSubmit = async (
  user: UserCreate,
  event: EventQueryInput
) => {
  const userQuery = tryParse<UserCreate>(user, userCreateSchema);
  const savedUser: UserDTO = await saveUser(userQuery);

  const eventQuery = tryParse<EventQuery>(
    { ...event, organizer: savedUser._id },
    EventQuerySchema
  );

  const savedEvent: EventDTO = await createEvent(eventQuery);
  revalidatePath("/events", "page");
  redirect("/events");
};
