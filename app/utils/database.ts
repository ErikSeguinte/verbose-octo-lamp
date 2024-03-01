"use server"
import { DateTime as Luxdt } from "luxon";
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
  new EventType({
    endDate: Luxdt.fromObject({ day: 30, month: 7, year: 2024 }).setZone("utc", {
      keepLocalTime: true,
    }),
    eventId:  "65dfae8e8e8d5a55271b4e32",
    eventName: "Fake Arcadia recording 2",
    startDate: Luxdt.fromObject({ day: 1, month: 6, year: 2024 }).setZone(
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

export async function getAllEventIds() {
  return eventData.map((i) => i.eventId)
}

export async function getAllEvents() {
  return eventData
}

