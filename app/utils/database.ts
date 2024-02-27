"use server"
import { DateTime as Luxdt } from "luxon";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

import { EventType } from "@/models/Event";

const eventData: EventType[] = [
  new EventType({
    eventName: "Fake BSFF recording",
    startDate: Luxdt.fromObject({ year: 2024, month: 5, day: 1 }).setZone(
      "utc",
      {
        keepLocalTime: true,
      }
    ),
    endDate: Luxdt.fromObject({ year: 2024, month: 5, day: 2 }).setZone("utc", {
      keepLocalTime: true,
    }),
    eventId:  "65db61ae5d4b9ff749d35562",
  }),
];

const fakeMap = new Map();
eventData.forEach((eventItem: EventType) => {
  fakeMap.set(eventItem.eventId, eventItem);
});

export async function getEventData(eventId: string) {
  const eventItem: EventType = fakeMap.get(eventId);
  if (!eventItem) {
    notFound();
  }
  return eventItem;
}
