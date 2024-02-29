"use server";
import { Stack, Title } from "@mantine/core";
import { DateTime } from "luxon";
import React, { ReactNode } from "react";

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

const Table = async ({
  children,
  tableData,
}: {
  children: ReactNode;
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
        <thead>{children}</thead>
        <tbody>{rows}</tbody>
      </table>
    </>
  );
};

const TableRow = async ({ rowData }: { rowData: Promise<DateTime[]> }) => {
  const r = await rowData;
  const f = (dt:DateTime) => {
    if (dt.minute == 0) {
      return dt.toFormat("ha")
    }else {
      return dt.toFormat("h':'mm")
    }
  }
  
  return (
    <tr>
      {r.map((slot) => {
        return (
          <td className="font-mono" key={slot.toISO()}>
            {f(slot)}
          </td>
        );
      })}
    </tr>
  );
};

const TableHead = async ({ rowData }: { rowData: Promise<DateTime[]> }) => {
  const r = await rowData;

  const format = (dt: DateTime) => {
    return (
      <>
        <Stack gap={2}>
          <span> {dt.monthShort} </span>
          <span className="text-3xl"> {dt.day} </span>
          <span className="text-xs"> {dt.year}</span>
        </Stack>
      </>
    );
  };
  return (
    <tr>
      {r.map((slot) => {
        return <th key={slot.toISO()}>{format(slot)}</th>;
      })}
    </tr>
  );
};
