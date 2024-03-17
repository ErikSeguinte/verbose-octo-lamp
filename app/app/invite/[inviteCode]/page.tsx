import { TypographyStylesProvider } from "@mantine/core";
import { notFound } from "next/navigation";
import React from "react";

import MaxProse from "@/components/MaxProse";
import {
  eventDocSchema,
  eventDTOSchema,
  EventQuery,
  EventQuerySchema,
} from "@/models/Event";
import { findAllEvents } from "@/utils/eventsDB";
import { cacheEvent, tryParse } from "@/utils/utils";

import { Form } from "./Form";

type Props = {
  params: { inviteCode: string };
};

export async function generateMetadata({ params }: Props) {
  const query = tryParse<EventQuery>(
    { inviteCode: params.inviteCode },
    EventQuerySchema,
  );
  const result = await cacheEvent(query);
  if (!result) {
    console.error(`page ${(query as EventQuery).inviteCode} not found`);
    notFound();
  }
  const eventItem = eventDocSchema.safeParse(result);
  if (!eventItem.success) {
    notFound();
  } else {
    return {
      title: `Verbose Octolamp - ${eventItem.data.eventName} invitation form`,
    };
  }
}

export async function generateStaticParams() {
  const events = await findAllEvents();
  return events ? events.map((e) => e.inviteCode) : [];
}

const Page = async ({ params }: Props) => {
  const query = tryParse<EventQuery>(
    { inviteCode: params.inviteCode },
    EventQuerySchema,
  );
  const result = eventDTOSchema.safeParse(await cacheEvent(query));
  if (!result.success) {
    throw new Error();
  }
  const eventItem = result.data;

  return (
    <MaxProse>
      <TypographyStylesProvider>
        <p>Welcome to Octolamp.</p>

        <p>
          {" "}
          Please fill out the following and on the next page you&rsquo;ll be
          able to fill out your availability.
        </p>

        <p>
          Required fields are followed by{" "}
          <span aria-label="required" className="text-red-600">
            *
          </span>
          .
        </p>
      </TypographyStylesProvider>
      <div>
        <Form event={eventItem} />
      </div>
    </MaxProse>
  );
};

export default Page;
