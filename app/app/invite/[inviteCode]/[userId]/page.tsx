import AvailabilityProvider from "@c/tableSubcomponents/AvailabilityProvider";
import { DateTime } from "luxon";
import { notFound } from "next/navigation";
import React from "react";

import TimeTable from "@/components/timeTable";
import {
  eventDocSchema,
  EventQuery,
  EventQueryInput,
  EventQuerySchema,
} from "@/models/Event";
import { cacheEvent, tryParse } from "@/utils/utils";

type params = { inviteCode: string; userId: string };
type searchParams = { timezone: string };

export async function generateMetadata({ params }: { params: params }) {
  const query = tryParse<EventQuery, EventQueryInput>(
    { inviteCode: params.inviteCode },
    EventQuerySchema,
  );
  const result = await cacheEvent(query);
  if (!result) {
    console.error(`page ${(query as EventQuery).inviteCode} not found`);
    notFound();
  }
  const eventItem = eventDocSchema.safeParse(result);
  if (eventItem.success) {
    return {
      title: `Verbose Octolamp - ${eventItem.data.eventName} invitation form`,
    };
  }

  return { title: "verbose Octolamp" };
}

const Page = async ({
  params,
  searchParams,
}: {
  params: params;
  searchParams: searchParams;
}) => {
  let query = tryParse<EventQuery, EventQueryInput>(
    { inviteCode: params.inviteCode },
    EventQuerySchema,
  );

  const eventItem = await cacheEvent(query);
  if (!eventItem) {
    notFound();
  }

  const userslots: Record<string, Set<string>> = {};
  for (let slot of Object.keys(eventItem.timeslots)) {
    if (eventItem.timeslots[slot].has(params.userId)) {
      userslots[slot] = eventItem.timeslots[slot];
    }
  }
  return (
    <>
      <AvailabilityProvider availability={userslots} maxSize={1}>
        <TimeTable
          readonly={false}
          timezone={searchParams.timezone}
          userId={params.userId}
          usingForm={true}
          eventItem={{
            ...eventItem,
            endDate: DateTime.fromISO(eventItem.endDate).toISO({
              includeOffset: false,
            }) as string,
            startDate: DateTime.fromISO(eventItem.startDate).toISO({
              includeOffset: false,
            }) as string,
          }}
        />
      </AvailabilityProvider>
    </>
  );
};

export default Page;
