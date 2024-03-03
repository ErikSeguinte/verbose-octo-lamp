import { promises as fs } from "fs";
import { DateTime as Luxdt } from "luxon";
import { notFound } from "next/navigation";

import { EventType } from "@/models/Event";

const eventData: EventType[] = [
  new EventType({
    endDate: Luxdt.fromObject({ day: 2, month: 5, year: 2024 }).setZone("utc", {
      keepLocalTime: true,
    }),
    eventId: "65db61ae5d4b9ff749d35562",
    eventName: "Fake BSFF recording",
    startDate: Luxdt.fromObject({ day: 1, month: 5, year: 2024 }).setZone(
      "utc",
      {
        keepLocalTime: true,
      }
    ),
  }),
  new EventType({
    endDate: Luxdt.fromObject({ day: 30, month: 7, year: 2024 }).setZone(
      "utc",
      {
        keepLocalTime: true,
      }
    ),
    eventId: "65dfae8e8e8d5a55271b4e32",
    eventName: "Fake Arcadia recording 2",
    startDate: Luxdt.fromObject({ day: 1, month: 6, year: 2024 }).setZone(
      "utc",
      {
        keepLocalTime: true,
      }
    ),
  }),

  new EventType({
    endDate: Luxdt.fromISO("2023-07-23T12:47:12Z"),
    eventName: "Front-line systemic ability",
    id: { $oid: "65e4d62efc13ae01a7cd3c5f" },
    startDate: Luxdt.fromISO("2023-06-28T12:47:12Z"),
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
  return eventData.map((i) => i.eventId as string);
}

export async function getAllEvents() {
  return eventData;
}

type eventsJson = {
  id: {$oid:string},
  startDate: string,
  endDate: string,
  eventName: string
}

export const Events = {
  async getAllEvents(){
    const events = await this.readFile();
    return events
  },

  async getAllIds(): Promise<string[]> {
    const events = await this.readFile()
    return events.map((e)=>e.id["$oid"])
  },

  async getAllMapped() {
    const events = await this.readFile()
    const map = new Map()
    events.forEach((e: EventType)=>{
      map.set(e.id["$oid"], e)
    })
    return map
  },

  async readFile() {
    const eventsFile = await fs.readFile(process.cwd() + "/utils/dummydata/events.json", "utf8")
    const events: eventsJson[] = JSON.parse(eventsFile)
    return events.map((e)=>{
      return EventType.fromJson({...e})
    })
  }

}