import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";

import MaxProse from "@/components/MaxProse";
import { EventFromDoc, eventSortType } from "@/models/Event";
import { queryEvents } from "@/utils/eventsDB";

import ClientSide from "./client";

const nodify = (events: EventFromDoc[]) => {
  return (
    <>
      {events.map((e) => {
        const startDate = DateTime.fromISO(e.startDate);
        const endDate = DateTime.fromISO(e.endDate);
        return (
          <li key={e._id}>
            <Link href={`/events/${e._id}`}> {e.eventName} </Link>
            <br /> {startDate.toLocal().toLocaleString()} -{" "}
            {endDate.toLocal().toLocaleString()}
          </li>
        );
      })}
    </>
  );
};

const Page = async () => {
  const dateSortedEvents = await queryEvents({ sort: eventSortType.startDate });
  const nameSortedEvents = await queryEvents({ sort: eventSortType.name });

  const daySorted = dateSortedEvents ? nodify(dateSortedEvents) : <></>;
  const nameSorted = nameSortedEvents ? nodify(nameSortedEvents) : <></>;
  const sortedEvents = [daySorted, nameSorted] as const;

  return (
    <>
      <MaxProse>
        <ClientSide events={sortedEvents} />
      </MaxProse>
    </>
  );
};

export default Page;
