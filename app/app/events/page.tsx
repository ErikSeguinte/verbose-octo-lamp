import Link from "next/link";
import React from "react";

import MaxProse from "@/components/MaxProse";
import { EventType } from "@/models/Event";
import { getAllEvents } from "@/utils/eventsDB";

import ClientSide from "./client";

export const sortMethod = {
  "Event Name": (a: EventType, b: EventType) => {
    const aName = a.eventName;
    const bName = b.eventName;
    return aName < bName ? -1 : aName > bName ? 1 : 0;
  },
  "Start Date": (a: EventType, b: EventType) =>
    a.startDate.toMillis() - +b.startDate.toMillis(),
} as const;

export type sortMethodKeys = keyof typeof sortMethod;
export type sortMethodValues =
  | (typeof sortMethod)["Start Date"]
  | (typeof sortMethod)["Event Name"];

const sortEvents = function (e: EventType[], compareFn: sortMethodValues) {
  const events = [...e];
  events.sort(compareFn);
  return events;
};

const nodify = (events: EventType[]) => {
  return (
    <>
      {events.map((e) => {
        return (
          <li key={e.eventId}>
            <Link href={`/events/${e.eventId}`}> {e.eventName} </Link>
            <br /> {e.startDate.toLocal().toLocaleString()} -{" "}
            {e.endDate.toLocal().toLocaleString()}
          </li>
        );
      })}
    </>
  );
};

const page = async () => {
  const events = await getAllEvents();

  const daySorted = nodify(sortEvents(events, sortMethod["Start Date"]));
  const nameSorted = nodify(sortEvents(events, sortMethod["Event Name"]));
  const sortedEvents = [daySorted, nameSorted] as const;

  return (
    <>
      <MaxProse>
        <ClientSide events={sortedEvents} />
      </MaxProse>
    </>
  );
};

export default page;
