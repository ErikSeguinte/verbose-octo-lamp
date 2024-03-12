// import AvailabilityProvider from "@c/tableSubcomponents/AvailabilityProvider";
import { Paper, Space, TypographyStylesProvider } from "@mantine/core";
import { notFound } from "next/navigation";
import React from "react";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

import MaxProse from "@/components/MaxProse";
// import TimeTable from "@/components/timeTable";
import { eventDTOSchema, eventQuerySchema } from "@/models/Event";
import { userAdvancedQuerySchema } from "@/models/Users";
import { findAllEvents, findOneEvent } from "@/utils/eventsDB";
import { findUsers } from "@/utils/usersDB";

import CopyButton_ from "./copyButton";
import ParticipantList from "./ParticipantList";

export async function generateMetadata({
  params,
}: {
  params: { eventId: string };
}) {
  let query = {};
  try {
    query = eventQuerySchema.parse({ id: params.eventId });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      console.error(validationError.toString());
      notFound();
    }
  }
  const result = await findOneEvent({ query });
  if (!result) {
    notFound();
  }
  const eventItem = eventDTOSchema.parse(result);
  return {
    title: `Verbose Octolamp - ${eventItem.eventName} details`,
  };
}

export async function generateStaticParams() {
  const events = await findAllEvents();
  return events ? events.map((e) => e.inviteCode) : [];
}

const Page = async ({ params }: { params: { eventId: string } }) => {
  const parsedEventQuery = ((query) => {
    const result = eventDTOSchema.partial().safeParse(query);
    if (result.success) {
      return result.data;
    }
    return {};
  })({ id: params.eventId });

  const result = await findOneEvent({ query: parsedEventQuery });
  if (!result) return notFound();
  const eventItem = eventDTOSchema.parse(result);
  const invitecode = eventItem.inviteCode;
  const inviteLink: string = `http://localhost:3000/invite/${invitecode}`;

  type advancedQuery = z.input<typeof userAdvancedQuerySchema>;

  const parsedUserQuery = ((query: advancedQuery) => {
    const result = userAdvancedQuerySchema.safeParse(query);
    if (!result.success) {
      if (result.error instanceof ZodError) {
        const validationError = fromZodError(result.error);
        console.error(validationError.toString());
        notFound();
      }
    } else {
      return result.data;
    }
    return {};
  })({ _id: { $in: Array.from(eventItem.participants) } });

  const participants = await findUsers({ query: parsedUserQuery });
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

      <MaxProse>
        <Space h="md" />
        <Paper>
          <ParticipantList
            eventId={eventItem._id}
            participants={participants}
          />
        </Paper>
      </MaxProse>
      {/*
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
