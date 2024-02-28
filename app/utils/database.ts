"use server"
import { DateTime as Luxdt } from "luxon";
import { ObjectId } from "mongodb";
import { notFound } from "next/navigation";

import { EventType } from "@/models/Event";

const eventData: EventType[] = [
  new EventType({
    endDate: Luxdt.fromObject({ day: 2, month: 5, year: 2024 }).setZone("utc", {
      keepLocalTime: true,
    }),
    eventId:  "65db61ae5d4b9ff749d35562",
    eventName: "Fake BSFF recording",
    startDate: Luxdt.fromObject({ day: 1, month: 5, year: 2024 }).setZone(
      "utc",
      {
        keepLocalTime: true,
      }
    ),
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
