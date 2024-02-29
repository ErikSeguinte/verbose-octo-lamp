"use server";
import { Title } from "@mantine/core";
import React from "react";

import { getAllEventIds, getEventData } from "@/utils/database";

import Cell from "./Cell";
import Table, { TableHead } from "./TimezoneTable";

type Props = {
  params: { eventId: string };
};

export async function generateMetadata({ params }: Props) {
  const eventId = params.eventId;
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

  const times = listTimes();
  const rows = times.map((t) => {
    return eventItem.asyncGetAsyncTimeslots(t);
  });

  const heads = eventItem.asyncGetAsyncTimeslots({ hour: 0, min: 0 });

  return (
    <>
      <Title>{eventItem.eventName}</Title>
      <Table tableData={rows}>
        <TableHead rowData={heads} />
      </Table>
    </>
  );
};

export default Page;
