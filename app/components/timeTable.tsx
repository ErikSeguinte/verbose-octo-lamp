import { notFound } from "next/navigation";
import React from "react";

import { AvailabilityType } from "@/models/Availabilities";
import { EventType } from "@/models/Event";
import { getAvailabilityById } from "@/utils/availabilitiesDB";
import { getEventfromId } from "@/utils/eventsDB";

import Table, { TableHead } from "./tableSubcomponents/Table";

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
  eventId,
  usingForm = true,
  readonly = false,
  slots,
}: {
  availabilityId?: string;
  usingForm: boolean;
  readonly?: boolean;
  eventId?: string;
  slots?: Set<string>;
}) => {
  let eventItem: EventType | undefined = undefined;
  let timeslots: Set<string> | undefined = undefined;
  if (slots) {
    timeslots = slots;
  } else if (availabilityId) {
    const availability = (await getAvailabilityById(
      availabilityId,
    )) as AvailabilityType;
    timeslots = new Set<string>(
      availability.timeslots.map((dt) => {
        return dt.toUTC().toISO({}) as string;
      }),
    );
    eventItem = await getEventfromId(availability.event.$oid as string);
  }

  if (eventId) {
    eventItem = await getEventfromId(eventId as string);
  }

  if (!eventItem) {
    notFound();
  }

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
      <div className="px-12 width-screen overflow-x-auto">
        <Table
          eventId={eventId}
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
