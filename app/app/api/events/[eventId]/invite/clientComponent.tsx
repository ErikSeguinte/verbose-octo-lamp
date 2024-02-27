"use client";
import {
  Code,
  Space,
  Table,
  TableData,
  TypographyStylesProvider,
} from "@mantine/core";
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

import TimezoneSelect from "@/components/TimezoneSelect";

function rowify(localSlots: DateTime[]) {
  const table = [];

  for (let i = 0; i < 24; i++) {
    for (let j = 0; j <= 30; j + 30) {
      const row = localSlots.filter((slot) => {
        return slot.hour == i && slot.minute == 30;
      });
      const tableRow: string[] = row.map((item) => {
        return `${item.hour}:${item.minute}`;
      });
      table.push(tableRow);
    }
  }
  return table;
}

const ClientComponent = ({ timeSlots }: { timeSlots: string[] }) => {
  const [tableData, setTableData] = useState({});
  const [localSlots, setLocalSlots] = useState([]);
  const d = useMemo(() => {
    return rowify(localSlots);
  }, [localSlots]);

  useEffect(() => {
    let l = timeSlots.map((s) => DateTime.fromISO(s).toLocal());
    const start = DateTime.fromISO(l[0].toISODate()).plus({ day: 1 });
    const end = DateTime.fromISO(l[l.length - 1].toISODate());
    l = l.filter((slot) => {
      return slot > start && slot < end;
    });
    setLocalSlots(l);

    // setTableData(data)
  }, [timeSlots]);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>("");

  useEffect(() => {
    const table: TableData = {
      body: d,
    };
    setTableData(table);
  }, [d]);
  return (
    <div>
      <TypographyStylesProvider>
        <h2> Select your timezone. </h2>
        <p>
          Events often span multiple timezones. To ensure that availabilities
          are properly synchronized, please ensure that the correct timezone is
          chosen below. The select box will have attempted its best guess at
          your current timezone based on your browser settings. The textbox
          itself is searchable, as there are a metric shit-ton of timezones, so
          it may be easier to start typing and filtering them. Timezones are in
          the format <Code>America/Los Angeles</Code> or{" "}
          <Code>Europe/London</Code>.
        </p>
      </TypographyStylesProvider>
      <Space h="md" />
      <div className="">
        <TimezoneSelect
          selectedTimezone={selectedTimezone}
          setSelectedTimezone={setSelectedTimezone}
        />

        <Table data={tableData} />
      </div>
      {/* <p>{JSON.stringify(timeSlots)}</p> */}
    </div>
  );
};

export default ClientComponent;
