import { Title } from "@mantine/core";
import React from "react";

import TimeTable from "@/components/timeTable";
import { getAllEvents } from "@/utils/eventsDB";

type Props = {
  params: { inviteCode: string };
};

export async function generateMetadata({ params }: Props) {
  const events = await getAllEvents();
  const eventItem = events.filter((e) => e.inviteCode == params.inviteCode)[0];

  return {
    title: `Verbose Octolamp - ${eventItem.eventName} invitation form`,
  };
}

export async function generateStaticParams() {
  const event = await getAllEvents();
  return event.map((e) => e.inviteCode);
}

const Page = async ({ params }: { params: { inviteCode: string } }) => {
  const events = await getAllEvents();
  const eventItem = events.filter((e) => (e.inviteCode = params.inviteCode))[0];

  return (
    <>
      <Title order={1}>{eventItem.eventName}</Title>
      <TimeTable
        eventId={eventItem.id.$oid as string}
        readonly={false}
        usingForm={true}
      />
    </>
  );
};

export default Page;
