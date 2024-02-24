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
  const [saveTimezoneChecked, setSaveTimezoneChecked] =
    useState<boolean>(false);

  const saveTimezone = (checked: boolean) => {
    if (checked) {
      selectedTimezone &&
        window.localStorage.setItem("localTimezone", selectedTimezone!);
    } else {
      window.localStorage.removeItem("localTimezone");
    }
  };

  useEffect(() => {
    const localTime = DateTime.local();
    setLocalTimezone(localTime.zoneName);
    setSelectedTimezone(localTimezone);
    setSearchValue(localTimezone);
  }, [localTimezone, setSelectedTimezone]);

  const handleCheck = () => {
    const newState = !saveTimezoneChecked;
    setSaveTimezoneChecked((state: boolean) => {
      return !state;
    });
    saveTimezone(newState);
  };
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
            onSearchChange={setSearchValue}
            onChange={(_value) => {
              setSelectedTimezone(_value);
              saveTimezone(saveTimezoneChecked);
            }}
          />

          <Checkbox
            className="pl-5 "
            label="I acknowledge that the above selection is correct."
            defaultChecked
          />
          <Checkbox
            checked={saveTimezoneChecked}
            className="pl-5 "
            label="Remember my timezone."
            onChange={handleCheck}
          />
        </Stack>
        <div></div>
        <br />
      </Paper>
    </div>
  );
};

export default Timezone;
