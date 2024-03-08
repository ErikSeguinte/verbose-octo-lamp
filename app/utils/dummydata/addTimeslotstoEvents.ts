import { promises as fs } from "fs";
import { DateTime } from "luxon";

import { availabilityJson, AvailabilityType } from "@/models/Availabilities";
import { eventsJson, EventType } from "@/models/Event";

const availabilityFile = [
  process.cwd() + "/utils/dummydata/availabilities.json",
  "utf-8",
] as const;
const eventFile = [
  process.cwd() + "/utils/dummydata/events.json",
  "utf-8",
] as const;
const eventFile2 = process.cwd() + "/utils/dummydata/events2.json";

async function readAvailabilities(): Promise<AvailabilityType[]> {
  const file = await fs.readFile(...availabilityFile);
  const json = JSON.parse(file) as availabilityJson[];
  const availabilities = json.map((a) => {
    const slots = a.timeslots.map((dt) => {
      return DateTime.fromISO(dt);
    });
    const aObj = { ...a, timeslots: slots };
    return new AvailabilityType({ ...aObj });
  });
  return availabilities;
}

async function readEvents(): Promise<EventType[]> {
  const file = await fs.readFile(...eventFile);
  const json = JSON.parse(file, EventType.reviver) as eventsJson[];
  const events = json.map((e) => {
    const eObj = { ...e };
    const newEvent = new EventType(eObj);
    return newEvent;
  });
  return events;
}

async function writeEvents(events: EventType[]): Promise<void> {
  fs.writeFile(eventFile2, JSON.stringify(events, EventType.replacer), "utf-8");
}

async function main() {
  const [availabilities, events] = await Promise.all([
    readAvailabilities(),
    readEvents(),
  ]);

  for (const e of events) {
    const id = e.id;
    const filteredAvailabilities = availabilities.filter(
      (a) => a.event.$oid == id.$oid
    );

    for (const a of filteredAvailabilities) {
      const user = a.user;
      for (const dt of a.timeslots) {
        const slot = e.timeSlots.get(dt.toISO() as string);
        slot?.add(user);
      }
    }
  }

  writeEvents(Array.from(events.values()));
}

main().then();
