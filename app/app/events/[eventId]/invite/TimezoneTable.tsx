"use client";
import { Stack } from "@mantine/core";
import { DateTime, Interval } from "luxon";
import { ReactNode } from "react";

import TimezoneProvider from "@/components/TimezoneProvider";

import Canvas from "./Canvas";
import Cell from "./Cell";
import MouseEventProvider from "./MouseEventProvider";

interface serializedTableData {
  startDate: string,
  endDate: string,
  hour: number,
  min: number
}

function getInterval(startDate:string, endDate:string) {
const start = DateTime.fromISO(startDate)
const end = DateTime.fromISO(endDate)
return Interval.fromDateTimes(start, end.plus({day:1}))
}

const Table = ({
  children,
  tableData,
}: {
  children: ReactNode;
  tableData: serializedTableData[];
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
    <TimezoneProvider>
      <MouseEventProvider>
        <Canvas>
          <table className="select-none p-8">
            <thead>{children}</thead>
            <tbody>{rows}</tbody>
          </table>
        </Canvas>
      </MouseEventProvider>
    </TimezoneProvider>
  );
};

const TableRow = ({ rowData }: { rowData: serializedTableData }) => {
  const interval = getInterval(rowData.startDate, rowData.endDate)
  const cells = []
  let date = DateTime.fromISO(rowData.startDate)
  while (interval.contains(date)) {
    <Cell date={date} key = 
  }
  const dtr = rowData.map((s) => {
    return [DateTime.fromISO(s), s] as const;
  });

  return (
    <tr key={dtr[0][0].toFormat("hhmm")}>
      {dtr.map(([_, string]) => {
        return <Cell dateString={string} key={string} />;
      })}
    </tr>
  );
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
