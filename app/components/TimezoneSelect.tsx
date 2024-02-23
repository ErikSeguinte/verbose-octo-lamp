"use client";
import { DateTime } from "luxon";
import { useEffect, useState, Dispatch } from "react";
import { Select } from "@mantine/core";

const Timezone = ({
  selectedTimezone,
  setSelectedTimezone,
}: {
  selectedTimezone: string | null;
  setSelectedTimezone: Dispatch<string | null>;
}) => {
  const [localTimezone, setLocalTimezone] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const localTime = DateTime.local();
    setLocalTimezone(localTime.zoneName);
    setSelectedTimezone(localTimezone);
    setSearchValue(localTimezone);
  }, [localTimezone]);

  return (
    <div className="flex flex-col justify-center items-center">
      <br />

      <Select
        label="Please select your timezone"
        data={Intl.supportedValuesOf("timeZone")}
        value={selectedTimezone}
        clearable
        searchable
        limit={100}
        onChange={(_value) => setSelectedTimezone(_value)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        styles={{ wrapper: { width: 600 } }}
      />

      <h1>{selectedTimezone}</h1>
    </div>
  );
};

export default Timezone;
