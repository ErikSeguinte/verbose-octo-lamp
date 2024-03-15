import { notFound } from "next/navigation";
import React from "react";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import TimeTable from "@/components/timeTable";
import {
  eventDocSchema,
  eventDTOSchema,
  EventQuery,
  EventQueryInput,
  EventQuerySchema,
} from "@/models/Event";
import { findAllEvents, findOneEvent } from "@/utils/eventsDB";
import { tryParse } from "@/utils/utils";
import { DateTime } from "luxon";

type Props = {
  params: { inviteCode: string };
};

export async function generateMetadata({ params }: Props) {
  let query = {};
  try {
    query = eventDTOSchema.partial().parse({ inviteCode: params.inviteCode });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      console.error(validationError.toString());
      notFound();
    }
    ``;
  } finally {
    const result = await findOneEvent({ query });
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
}

export async function generateStaticParams() {
  const events = await findAllEvents();
  return events ? events.map((e) => e.inviteCode) : [];
}

const Page = async ({
  params,
  searchParams,
}: {
  params: { inviteCode: string };
  searchParams: { timezone: string };
}) => {
  let query = tryParse<EventQuery, EventQueryInput>(
    { inviteCode: params.inviteCode },
    EventQuerySchema
  );

  const eventItem = await findOneEvent({ query });
  if (!eventItem) {
    notFound();
  }

  return (
    <>
      <TimeTable
        eventItem={{
          ...eventItem,
          startDate: DateTime.fromISO(eventItem.startDate).toISO({
            includeOffset: false,
          }) as string,
          endDate: DateTime.fromISO(eventItem.endDate).toISO({
            includeOffset: false,
          }) as string,
        }}
        readonly={false}
        timezone={searchParams.timezone}
        usingForm={true}
      />
    </>
  );
};

export default Page;
