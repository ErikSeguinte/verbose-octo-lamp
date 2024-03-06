"use server";
import { Title } from "@mantine/core";
import React from "react";

import { AvailabilityType } from "@/models/Availabilities";
import { getAvailabilityById } from "@/utils/availabilitiesDB";
import { getEventData } from "@/utils/database";
import { getAllEvents } from "@/utils/eventsDB";

import Table, { TableHead } from "./tableSubcomponents/Table";

type Props = {
  params: { id: string };
};

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

const TimeTable = async ({
  availabilityId,
  usingForm = true,
  readonly = false,
}: {
  availabilityId: string;
  usingForm: boolean;
  readonly?: boolean;
}) => {
  const availability = (await getAvailabilityById(
    availabilityId,
  )) as AvailabilityType;
  const eventItem = await getEventData(availability.event.$oid as string);
  const timeslots = new Set<string>(
    availability.timeslots.map((dt) => {
      return dt.toUTC().toISO({}) as string;
    }),
  );

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
    <>
      <div className="px-12">
        <Title>{eventItem.eventName}</Title>
        <Table
          readonly={readonly}
          slots={timeslots}
          tableData={rows}
          usingForm={usingForm}
        >
          <TableHead rowData={heads} />
        </Table>
      </div>
    </>
  );
};

export default TimeTable;
