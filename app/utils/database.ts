import { EventType } from "@/models/Event";
import { DateTime as Luxdt } from "luxon";
import { notFound } from "next/navigation";
import { ObjectId } from "mongodb";

const eventData: EventType[] = [
  new EventType({
    eventName: "Fake BSFF recording",
    startDate: Luxdt.fromObject({ year: 2024, month: 5, day: 1 }).setZone(
      "utc",
      {
        keepLocalTime: true,
      }
    ),
    endDate: Luxdt.fromObject({ year: 2024, month: 5, day: 7 }).setZone("utc", {
      keepLocalTime: true,
    }),
    eventId: new ObjectId("65db61ae5d4b9ff749d35562"),
  }),
];

export const fakeMap = new Map();
eventData.forEach((eventItem: EventType) => {
  fakeMap.set(eventItem.eventId?.toHexString, eventItem);
});

export function getEventData(eventId: string) {
  const oid = new ObjectId(eventId);
  const eventItem: EventType = fakeMap.get(oid.toHexString);
  if (!eventItem) {
    notFound();
  }
  return eventItem;
}
