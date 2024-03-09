"use server";
import AvailabilityProvider from "@c/tableSubcomponents/AvailabilityProvider";
import { Paper, Space, TypographyStylesProvider } from "@mantine/core";
import React from "react";

import MaxProse from "@/components/MaxProse";
import TimeTable from "@/components/timeTable";
import { EventType } from "@/models/Event";
import { getAllIds, getEventfromId } from "@/utils/eventsDB";

import CopyButton_ from "./copyButton";
import ParticipantList from "./ParticipantList";

export async function generateStaticParams() {
  const eventIds = await getAllIds();
  return eventIds;
}

const Page = async ({ params }: { params: { eventId: string } }) => {
  const eventItem = (await getEventfromId(params.eventId)) as EventType;
  if (!eventItem) return null;
  const invitecode = eventItem?.inviteCode ? eventItem?.inviteCode : "";
  const inviteLink: string = `http://localhost:3000/${invitecode}`;
  // const slots = await eventItem.getSharedAvailability();
  const slots = undefined;
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
      </AvailabilityProvider>
    </section>
  );
};

export default Page;
