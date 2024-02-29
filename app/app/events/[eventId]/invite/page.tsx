"use server";
import { Title } from "@mantine/core";
import { DateTime } from "luxon";
import React from "react";

import { getAllEventIds, getEventData } from "@/utils/database";

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

  return (
    <>
      <Title>{eventItem.eventName}</Title>
      <Table tableData={rows} />
    </>
  );
};

export default Page;

const Table = async ({
  tableData,
}: {
  tableData: Array<Promise<DateTime[]>>;
}) => {
  function* keygen() {
    for (let k = 0; k >= 0; k = k + 1) {
      yield `row_${k}`;
    }
  }
  const key = keygen();
  const rows = tableData.map((r) => {
    return <TableRow key={key.next().value as string} rowData={r} />;
  });
  return (
    <>
      <table>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

const TableRow = async ({ rowData }: { rowData: Promise<DateTime[]> }) => {
  const r = await rowData;
  return (
    <tr>
      {r.map((slot) => {
        return (
          <th key={slot.toISO()}>
            {slot.toLocaleString(DateTime.TIME_SIMPLE)}
          </th>
        );
      })}
    </tr>
  );
};
