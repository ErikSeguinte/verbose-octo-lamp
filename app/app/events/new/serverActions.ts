"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export const handleSubmit = async (
  user: UserCreate,
  event: EventQueryInput,
) => {
  const userQuery = tryParse<UserCreate>(user, userCreateSchema);
  const savedUser: UserDTO = await saveUser(userQuery);

  const eventQuery = tryParse<EventQuery>(
    { ...event, organizer: savedUser._id },
    EventQuerySchema,
  );

  const savedEvent: EventDTO = await createEvent(eventQuery);
  if (!savedEvent) throw Error();
  revalidatePath("/events", "page");
  redirect("/events");
};
