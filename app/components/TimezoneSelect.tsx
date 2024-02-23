"use client";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Select } from "@mantine/core";
const Timezone = () => {

  const [localTimezone, setLocalTimezone] = useState<string>("");
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>("");
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    const localTime = DateTime.local();
    setLocalTimezone(localTime.zoneName);
    setSelectedTimezone(localTimezone);
  }, [localTimezone]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1>{selectedTimezone}</h1>
      <br />

      <Select
        label="Please select your timezone"
        placeholder={localTimezone}
        data={Intl.supportedValuesOf("timeZone")}
        searchable
        limit={100}
        onChange={(_value) => setSelectedTimezone(_value)}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
    </div>
  );
};

export default Timezone;
