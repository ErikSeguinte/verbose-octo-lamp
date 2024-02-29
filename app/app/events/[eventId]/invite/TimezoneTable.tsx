"use server";
import { Stack } from "@mantine/core";
import { DateTime } from "luxon";
import { ReactNode } from "react";

import Cell from "./Cell";

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

  return (
    <tr key={r[0].toFormat("hhmm")}>
      {r.map((slot) => {
        const dt = slot.toISO({ includeOffset: false }) as string;
        return (
          <>
            <Cell dateString={dt} key={slot.toISO()} />
          </>
        );
      })}
    </tr>
  );
};

export const TableHead = async ({
  rowData,
}: {
  rowData: Promise<DateTime[]>;
}) => {
  const r = await rowData;

  const format = (dt: DateTime) => {
    return (
      <>
        <div className="flex">
          <Stack className="justify-center" gap={2}>
            <span className="text-center"> {dt.monthShort} </span>
            <span className="text-3xl text-center m-auto"> {dt.day} </span>
            <span className="text-xs"> {dt.year}</span>
          </Stack>
        </div>
      </>
    );
  };
  return (
    <tr key={r[0].toISODate()}>
      {r.map((slot) => {
        return <th key={slot.toISO()}>{format(slot)}</th>;
      })}
    </tr>
  );
};

export default Table;
