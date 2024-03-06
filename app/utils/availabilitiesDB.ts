

"use server";
import { promises as fs} from "fs";
import { DateTime } from "luxon";

import { AvailabilityType } from "@/models/Availabilities";
import { oid } from "@/models/common";

// export const getAllEvents = async () => {
//   const events = await readFile();
//   return events;
// };

// export const getAllIds = async (): Promise<string[]> => {
//   const events = await readFile();
//   return events.map((u) => u.id["$oid"]);
// };

export const getAllMapped = async () => {
  const availabilities = await readFile();
  const map: Map<string, AvailabilityType> = new Map();
  availabilities.forEach((a: AvailabilityType) => {
    map.set(a.id["$oid"] as string, a as AvailabilityType);
  });
  return map;
};

export type availabilityJson = {
  id: oid
    event: oid,
    user: oid,
    timeslots: string[]
};

export const readFile = async ():Promise<AvailabilityType[]> => {
  const availabilitiesFile = await fs.readFile(
    process.cwd() + "/utils/dummydata/availabilities.json",
    "utf8"
  );
  const availabilities: availabilityJson[] = JSON.parse(availabilitiesFile);
  return availabilities.map((a) => {
    const aList = a.timeslots.map((dt)=>DateTime.fromISO(dt))
    const aObj = {...a, timeslots: aList}
    return new AvailabilityType ({...aObj});
  });
};

// export const getUserFromId = async (id: string) => {
//   const availabilities = await getAllMapped();
//   return availabilities.get(id);
// };

export const query = async ({user, event}:{user:oid, event:oid}) =>{
    const availabilities = await readFile()
    const filtered = availabilities.filter((a)=>{
        return a.event.$oid == event.$oid && a.user.$oid == user.$oid
    })
    return filtered
}

export const getAvailabilityById = async (id:string) => {
  const a = await getAllMapped()
  return a.get(id)
}