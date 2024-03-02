"use client";
import { Stack } from "@mantine/core";
import { DateTime } from "luxon";
import { ReactNode } from "react";

import TimezoneProvider from "@/components/TimezoneProvider";
import Timezone from "@/components/TimezoneSelect";

import Form from "./(form)/Form";
import Canvas from "./Canvas";
import Cell from "./Cell";
import MouseEventProvider from "./MouseEventProvider";

const Table = ({
  children,
  tableData,
}: {
  children: ReactNode;
  tableData: Array<string[]>;
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

const TableRow = ({ rowData }: { rowData: string[] }) => {
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
