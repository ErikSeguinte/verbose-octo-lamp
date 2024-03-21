import { DateTime } from "luxon";
import React from "react";

import { EventDTO } from "@/models/Event";

import Table, { TableHead, TableHeadWeekDay } from "./tableSubcomponents/Table";

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
  userId,
}: {
  eventItem: EventDTO;
  usingForm: boolean;
  readonly?: boolean;
  timezone?: string;
  userId?: string;
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

  return (
    <>
      <div className="px-12 w-screen justify-around">
        <Table
          eventItem={eventItem}
          readonly={readonly}
          tableData={rows}
          timezone={timezone}
          userId={userId}
          usingForm={usingForm}
        >
          <TableHead endDate={localend} startDate={localStart} />
          <TableHeadWeekDay
            endDate={localend}
            startDate={localStart}
            timezone={timezone as string}
          />
        </Table>
      </div>
    </>
  );
};

export default TimeTable;
