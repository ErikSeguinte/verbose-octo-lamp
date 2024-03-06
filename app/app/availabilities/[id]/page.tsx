import React from "react";

import { getAvailabilityById } from "@/utils/availabilitiesDB";
import { getEventData } from "@/utils/database";
import { getAllEvents } from "@/utils/eventsDB";

import TimeTable from "./timeTable";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  const availability = await getAvailabilityById(params.id);
  const eventItem = await getEventData(availability?.event.$oid as string);

  return {
    title: `Verbose Octolamp - ${eventItem.eventName} invitation form`,
  };
}

export async function generateStaticParams() {
  const event = await getAllEvents();
  return event.map((e) => e.inviteCode);
}

const Page = async ({ params }: Props) => {
  return (
    <TimeTable availabilityId={params.id} readonly={false} usingForm={false} />
  );
};

export default Page;
