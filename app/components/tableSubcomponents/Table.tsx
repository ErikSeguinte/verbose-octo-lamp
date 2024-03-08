"use client";
import { Stack } from "@mantine/core";
import { DateTime, Interval } from "luxon";
import { ReactNode } from "react";

import TimezoneProvider from "@/components/TimezoneProvider";

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
  slots,
  usingForm = true,
  readonly = true,
}: {
  children: ReactNode;
  tableData: serializedTableData[];
  slots?: Set<string>;
  usingForm?: boolean;
  readonly?: boolean;
}) => {
  function* keygen() {
    for (let k = 0; k >= 0; k = k + 1) {
      yield `row_${k}`;
    }
  }
  const key = keygen();
  const rows = tableData.map((r) => {
    return (
      <TableRow
        key={key.next().value as string}
        readonly={readonly}
        rowData={r}
        slots={slots}
      />
    );
  });
  return (
    <TimezoneProvider>
      <MouseEventProvider>
        <Canvas readonly={readonly} usingForm={usingForm}>
          <table className="select-none p-8 mb-20 table-auto">
            <thead>{children}</thead>
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
  slots?: Set<string>;
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
      const s = d.toISO() as string;
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

export const TableHead = ({ rowData }: { rowData: string[] }) => {
  const r = rowData;
  const dtr = rowData.map((s) => {
    return [DateTime.fromISO(s), s] as const;
  });

  const format = (dt: DateTime) => {
    return (
      <div className="flex">
        <Stack className="justify-center" gap={2}>
          <span className="text-center"> {dt.monthShort} </span>
          <span className="text-3xl text-center m-auto"> {dt.day} </span>
          <span className="text-xs"> {dt.year}</span>
        </Stack>
      </div>
    );
  };
  return (
    <tr key={r[0][1]}>
      {dtr.map(([dt, s]) => {
        return <th key={s}>{format(dt)}</th>;
      })}
    </tr>
  );
};

export default Table;
