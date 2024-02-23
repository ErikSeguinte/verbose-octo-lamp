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
    setSearchValue(localTimezone)
  }, [localTimezone]);

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
        onChange={(_value) => setSelectedTimezone(_value)}
        onSearchChange={setSearchValue}

      />

<h1>{selectedTimezone}</h1>
    </div>
  );
};

export default Timezone;
