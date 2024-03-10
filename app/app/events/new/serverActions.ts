"use Server";

import { eventsJson, EventType } from "@/models/Event";
import { UserType } from "@/models/Users";
import { saveNewEvent } from "@/utils/eventsDB";
import { saveUser, userJson } from "@/utils/usersDB";

export const handleSubmit = async (user: string, event: string) => {
  const userItem: UserType = new UserType({ ...JSON.parse(user) });
    const eventItem: EventType = new EventType({...JSON.parse(event, EventType.reviver)})
  const userDoc = saveUser(userItem);
//   const eventDoc = saveNewEvent(eventItem);
console.log(event)

};
