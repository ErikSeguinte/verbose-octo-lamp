import { DateTime } from "luxon";
import React from "react";

import { EventDTO } from "@/models/Event";

// import Table, { TableHead } from "./tableSubcomponents/Table";
import Table from "./tableSubcomponents/Table";

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
  eventItem,
  usingForm = true,
  readonly = false,
  timezone,
}: {
  eventItem: EventDTO;
  usingForm: boolean;
  readonly?: boolean;
  timezone?: string;
}) => {
  const times = listTimes();
  const localStart = DateTime.fromISO(eventItem.startDate)
    .setZone("local", {
      keepLocalTime: true,
    })
    .toISO({ includeOffset: false }) as string;
  const localend = DateTime.fromISO(eventItem.endDate)
    .setZone("local", {
      keepLocalTime: true,
    })
    .toISO({ includeOffset: false }) as string;
  const rows: Array<{
    startDate: string;
    endDate: string;
    hour: number;
    min: number;
  }> = times.map((time) => {
    return {
      endDate: localend,
      startDate: localStart,
      ...time,
    };
  });

  // const dtheads = await eventItem.asyncGetAsyncTimeslots({ hour: 0, min: 0 });
  // const heads = dtheads.map((dt) => {
  // return dt.toISO({ includeOffset: false }) as string;
  // });

  return (
    <>
      <div className="px-12 w-screen overflow-x-auto">
        <Table
          eventItem={eventItem}
          readonly={readonly}
          tableData={rows}
          timezone={timezone}
          usingForm={usingForm}
        >
          {/* <TableHead rowData={heads} /> */}
        </Table>
      </div>
    </>
  );
};

export default TimeTable;
