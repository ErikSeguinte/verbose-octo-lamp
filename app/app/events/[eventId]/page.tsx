import AvailabilityProvider from "@c/tableSubcomponents/AvailabilityProvider";
import { Paper, Space, TypographyStylesProvider } from "@mantine/core";
import { DateTime } from "luxon";
import { notFound } from "next/navigation";
import React from "react";

import MaxProse from "@/components/MaxProse";
import TimeTable from "@/components/timeTable";
import { eventDTOSchema, EventQuery, EventQuerySchema } from "@/models/Event";
import { UserAdvancedQuery, userAdvancedQuerySchema } from "@/models/Users";
import { findOneEvent } from "@/utils/eventsDB";
import { queryUsers } from "@/utils/usersDB";
import { tryParse } from "@/utils/utils";

import CopyButton_ from "./copyButton";
import ParticipantList from "./ParticipantList";

export async function generateMetadata({
  params,
}: {
  params: { eventId: string };
}) {
  let query = tryParse<EventQuery>({ _id: params.eventId }, EventQuerySchema);
  const result = await findOneEvent(query);
  if (!result) {
    notFound();
  }
  const eventItem = eventDTOSchema.parse(result);
  return {
    title: `Verbose Octolamp - ${eventItem.eventName} details`,
  };
}

const Page = async ({
  params,
  searchParams,
}: {
  params: { eventId: string };
  searchParams: { timezone: string };
}) => {
  const parsedEventQuery = tryParse<EventQuery>(
    {
      _id: params.eventId,
    },
    EventQuerySchema,
  );

  const eventItem = await findOneEvent(parsedEventQuery);
  if (!eventItem) return notFound();
  const invitecode = eventItem.inviteCode;
  const inviteLink: string = `${process.env.BASE_URL as string}/invite/${invitecode}`;
  const parsedUserQuery = tryParse<UserAdvancedQuery>(
    { _id: { $in: Array.from(eventItem.participants) } },
    userAdvancedQuerySchema,
  );

  const participants = await queryUsers({ query: parsedUserQuery });

  const startDate = DateTime.fromISO(eventItem.startDate);
  const endDate = DateTime.fromISO(eventItem.endDate);
  return (
    <section>
      <MaxProse>
        <TypographyStylesProvider>
          <h1 className="text-center ">{eventItem?.eventName}</h1>
          <h2 className="text-center mb-8">
            {startDate.toLocal().toLocaleString(DateTime.DATE_FULL)}
            &nbsp;&ndash;&nbsp;
            {endDate.toLocal().toLocaleString(DateTime.DATE_FULL)}
          </h2>

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

      {eventItem.participants.size > 1 ? (
        <AvailabilityProvider
          availability={eventItem.timeslots}
          maxSize={eventItem.participants.size}
        >
          <TimeTable
            eventItem={eventItem}
            readonly={true}
            timezone={searchParams.timezone ? searchParams.timezone : undefined}
            usingForm={false}
          />
        </AvailabilityProvider>
      ) : (
        <></>
      )}
    </section>
  );
};

export default Page;
