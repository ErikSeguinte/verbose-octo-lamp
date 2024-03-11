import { EventType } from "@/models/Event";

export const sortMethod = {
  "Event Name": (a: EventType, b: EventType) => {
    const aName = a.eventName.toLowerCase();
    const bName = b.eventName.toLocaleLowerCase();
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  },
  "Start Date": (a: EventType, b: EventType) => {
    const aDate = a.startDate;
    const bDate = b.startDate;

    if (aDate.toMillis() > bDate.toMillis()) {
      return 1;
    } else if (bDate.toMillis() > aDate.toMillis()) {
      return -1;
    } else {
      const aName = a.eventName.toLowerCase();
      const bName = b.eventName.toLocaleLowerCase();
      return aName < bName ? -1 : aName > bName ? 1 : 0;
    }
  },
} as const;

export type sortMethodKeys = keyof typeof sortMethod;
export type sortMethodValues =
  | (typeof sortMethod)["Start Date"]
  | (typeof sortMethod)["Event Name"];
