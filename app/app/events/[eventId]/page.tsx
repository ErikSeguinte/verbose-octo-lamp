import AvailabilityProvider from "@c/tableSubcomponents/AvailabilityProvider";
import { Paper, Space, TypographyStylesProvider } from "@mantine/core";
import { notFound } from "next/navigation";
import React from "react";
import { ZodError } from "zod";
import { fromZodError, isValidationErrorLike } from "zod-validation-error";

import MaxProse from "@/components/MaxProse";
import TimeTable from "@/components/timeTable";
import {
  eventDTOSchema,
  EventQuery,
  eventQuerySchema,
  EventType,
} from "@/models/Event";
import { findEvents, findOneEvent } from "@/utils/eventsDB";

import CopyButton_ from "./copyButton";
import ParticipantList from "./ParticipantList";

export async function generateMetadata({
  params,
}: {
  params: { eventId: string };
}) {
  try {
    var query = eventQuerySchema.parse({ id: params.eventId });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      console.log(validationError.toString());
      notFound();
    }
  }
  const eventItem = await eventDTOSchema
    .promise()
    .parse(findOneEvent({ query }));
  return {
    title: `Verbose Octolamp - ${eventItem.eventName} details`,
  };
}

export async function generateStaticParams() {
  const query: EventQuery = {};
  const events = await findEvents({ query });
  return events ? events.map((e) => e.inviteCode) : [];
}

const Page = async ({ params }: { params: { eventId: string } }) => {
  try {
    var query = eventQuerySchema.parse({ id: params.eventId });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      notFound();
    }
  }
  const eventItem = await findOneEvent({ query });
  if (!eventItem) return notFound();
  const invitecode = eventItem.inviteCode;
  const inviteLink: string = `http://localhost:3000/invite/${invitecode}`;
  return (
    <section>
      <MaxProse>
        <TypographyStylesProvider>
          <h1 className="text-center ">Event name: {eventItem?.eventName}</h1>

          <Paper bg="var(--mantine-color-blue-light)" p="1rem" shadow="lg">
            <h2 className="text-center">Invite Link</h2>
            <Paper bg="white" className="b-2" p="0.5rem" ta="center">
              {inviteLink}
            </Paper>
            <CopyButton_ value={inviteLink} />
          </Paper>
        </TypographyStylesProvider>
      </MaxProse>

      {/* <MaxProse>
        <Space h="md" />
        <Paper>
          <ParticipantList event={eventItem as EventType} />
        </Paper>
      </MaxProse>

      <AvailabilityProvider
        availability={eventItem.timeSlots}
        maxSize={eventItem.participants.length}
      >
        <TimeTable
          eventId={params.eventId}
          readonly={true}
          slots={slots}
          usingForm={false}
        />
      </AvailabilityProvider> */}
    </section>
  );
};

export default Page;
