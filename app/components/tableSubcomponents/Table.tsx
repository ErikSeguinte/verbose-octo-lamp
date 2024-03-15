"use client";
import { Stack } from "@mantine/core";
import classNames from "classnames";
import { DateTime, Interval } from "luxon";

import TimezoneProvider from "@/components/TimezoneProvider";
import { EventDTO, timeslotToDTO } from "@/models/Event";

import Canvas from "./Canvas";
import Cell from "./Cell";
import MouseEventProvider from "./MouseEventProvider";

interface serializedTableData {
  startDate: string;
  endDate: string;
  hour: number;
  min: number;
}

function getInterval(startDate: string, endDate: string) {
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  return Interval.fromDateTimes(start, end.plus({ day: 1 }));
}

const Table = ({
  children,
  tableData,
  usingForm = true,
  readonly = true,
  eventItem,
  timezone,
}: {
  children: React.ReactNode;
  eventItem: EventDTO;
  tableData: serializedTableData[];
  usingForm?: boolean;
  readonly?: boolean;
  timezone?: string;
}) => {
  function* keygen() {
    for (let k = 0; k >= 0; k = k + 1) {
      yield `row_${k}`;
    }
  }
  const timeslots = eventItem.timeslots;

  const key = keygen();
  const rows = tableData.map((r) => {
    return (
      <TableRow
        key={key.next().value as string}
        readonly={readonly}
        rowData={r}
        slots={timeslots}
      />
    );
  });
  return (
    <TimezoneProvider value={timezone ? timezone : ""}>
      <MouseEventProvider>
        <Canvas
          eventId={eventItem._id}
          readonly={readonly}
          usingForm={usingForm}
        >
          <table className="select-none p-8 mb-20 table-auto border-collapse">
            <thead className="bg-slate-300">{children}</thead>
            <tbody>{rows}</tbody>
          </table>
        </Canvas>
      </MouseEventProvider>
    </TimezoneProvider>
  );
};

const TableRow = ({
  rowData,
  slots,
  readonly = false,
}: {
  rowData: serializedTableData;
  slots?: timeslotToDTO;
  readonly?: boolean;
}) => {
  const interval = getInterval(rowData.startDate, rowData.endDate);
  const startDate = DateTime.fromISO(rowData.startDate).plus({
    hour: rowData.hour,
    minute: rowData.min,
  });
  function* cells() {
    let date = startDate;
    let dateString = rowData.startDate;
    const getNext = (date: DateTime) => {
      const d = date.plus({ day: 1 });
      const s = d.toISO({ includeOffset: false }) as string;
      return [d, s] as const;
    };

    while (interval.contains(date)) {
      yield (
        <Cell
          date={date}
          key={dateString}
          readonly={readonly}
          slots={slots}
        ></Cell>
      );
      [date, dateString] = getNext(date);
    }
  }

  return <tr key={startDate.toFormat("hhmm")}>{Array.from(cells())}</tr>;
};

export const TableHead = ({
  startDate,
  endDate,
  timezone,
}: {
  startDate: string;
  endDate: string;
  timezone: string;
}) => {
  const start = DateTime.fromISO(startDate).setZone(
    timezone ? timezone : "local",
    { keepLocalTime: true }
  );
  const end = DateTime.fromISO(endDate)
    .plus({ days: 1 })
    .setZone(timezone ? timezone : "local", { keepLocalTime: true });
  const interval = Interval.fromDateTimes(start, end);

  function* _cells() {
    let date = start;
    const getNext = (date: DateTime) => {
      const d = date.plus({ day: 1 });
      return d;
    };

    while (interval.contains(date)) {
      yield date as DateTime;
      date = getNext(date);
    }
  }

  const dtr = Array.from(_cells());

  const format = (dt: DateTime) => {
    const classes = classNames(
      "flex",
      "justify-center",
      `dt-date-${dt.toISODate()}`
    );
    return (
      <div className={classes}>
        <Stack className="justify-center" gap={2}>
          <span className="text-center"> {dt.monthShort} </span>
          <span className="text-3xl text-center m-auto"> {dt.day} </span>
          <span className="text-xs"> {dt.year}</span>
        </Stack>
      </div>
    );
  };
  return (
    <tr key="row_0">
      {dtr.map((dt) => {
        return (
          <th
            className="border-slate-950 border-b-1 border-b-4 border-solid border-x border-t-2"
            key={dt.toISODate()}
          >
            {format(dt)}
          </th>
        );
      })}
    </tr>
  );
};

export default Table;
