"use client";
import { Dispatch, useEffect, useState } from "react";
import { DateTime } from "luxon";
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
  }, [localTimezone, setSelectedTimezone]);

  return (
    <div className="flex flex-col justify-center items-center">
      <br />

      <Select
        data={Intl.supportedValuesOf("timeZone")}
        label="Please select your timezone"
        limit={100}
        searchValue={searchValue}
        styles={{ wrapper: { width: 600 } }}
        value={selectedTimezone}
        clearable
        searchable
        withAsterisk
        onChange={(_value) => setSelectedTimezone(_value)}
        onSearchChange={setSearchValue}
      />

      <h1>{selectedTimezone}</h1>
    </div>
  );
};

export default Timezone;
