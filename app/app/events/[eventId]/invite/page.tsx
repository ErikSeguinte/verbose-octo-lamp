"use server";
import { Title } from "@mantine/core";
import React from "react";

import { getAllEventIds, getEventData } from "@/utils/database";

import Table, { TableHead } from "./TimezoneTable";

type Props = {
  params: { eventId: string };
};

export async function generateMetadata({ params }: Props) {
  const eventItem = await getEventData(params.eventId);

  return {
    title: `Verbose Octolamp - ${eventItem.eventName} invitation form`,
  };
}

function listTimes() {
  const times: Array<{ hour: number; min: number }> = [];
  for (let h = 0; h < 24; h = h + 1) {
    // for (let h = 0; h < 1; h = h + 1) {
    for (let m = 0; m <= 30; m = m + 30) {
      const time = { hour: h, min: m } as const;
      times.push(time);
    }
  }
  return times;
}

export async function generateStaticParams() {
  const eventIds = await getAllEventIds();
  return eventIds;
}

const Page = async ({ params }: Props) => {
  const eventItem = await getEventData(params.eventId);

  const [startDate, endDate] = eventItem.dateStrings;

  const times = listTimes();
  const rows: Array<{
    startDate: string;
    endDate: string;
    hour: number;
    min: number;
  }> = times.map((time) => {
    return { endDate, startDate, ...time };
  });

  const dtheads = await eventItem.asyncGetAsyncTimeslots({ hour: 0, min: 0 });
  const heads = dtheads.map((dt) => {
    return dt.toISO({ includeOffset: false }) as string;
  });

  return (
    <div className="px-12">
      <Title>{eventItem.eventName}</Title>
      <Table tableData={rows}>
        <TableHead rowData={heads} />
      </Table>
    </div>
  );
};

export default Page;
