import Link from "next/link";
import React from "react";

import MaxProse from "@/components/MaxProse";
import { EventType } from "@/models/Event";

import ClientSide from "./client";
import { sortMethod, sortMethodValues } from "./utils";

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

const Page = async () => {
  // const events = await getAllEvents();

  // const daySorted = nodify(sortEvents(events, sortMethod["Start Date"]));
  // const nameSorted = nodify(sortEvents(events, sortMethod["Event Name"]));
  // const sortedEvents = [daySorted, nameSorted] as const;

  return (
    <>
      <MaxProse>
        <ClientSide events={sortedEvents} />
      </MaxProse>
    </>
  );
};

export default Page;
