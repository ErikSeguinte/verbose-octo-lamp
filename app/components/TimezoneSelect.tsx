"use client";

import { Dispatch, useEffect, useState } from "react";
import { Paper, Select, Stack } from "@mantine/core";
import { Checkbox } from "@mantine/core";
import { DateTime } from "luxon";

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

      <Paper radius="md" shadow="md" withBorder>
        <Stack>
          <Select
            className="pl-5 pr-5 pt-2"
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
        </Stack>
        <Checkbox
          className="pl-5 pt-5"
          label="I acknowledge that the above selection is correct."
          defaultChecked
        />
                <Checkbox
          className="pl-5 pt-2"
          label="Remember my timezone."
          defaultChecked
        />
        <div></div>
        <br />
      </Paper>
    </div>
  );
};

export default Timezone;
