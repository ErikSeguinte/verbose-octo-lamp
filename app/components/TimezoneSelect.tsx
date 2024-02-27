"use client";
import { Checkbox, Paper, Select, Stack } from "@mantine/core";
import { DateTime } from "luxon";
import { Dispatch, useEffect, useState } from "react";

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

  const saveTimezone = (checked: boolean, tz: string | null) => {
    if (checked) {
      tz && window.localStorage.setItem("localTimezone", tz);
    } else {
      window.localStorage.removeItem("localTimezone");
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("localTimezone")) {
      const localTime = DateTime.local();
      setLocalTimezone(localTime.zoneName);
    } else {
      setLocalTimezone(localStorage.getItem("localTimezone")!);
      setSaveTimezoneChecked(true);
    }
    setSelectedTimezone(localTimezone);
    setSearchValue(localTimezone);
  }, [localTimezone, setSelectedTimezone]);

  const handleCheck = () => {
    const newState = !saveTimezoneChecked;
    setSaveTimezoneChecked((state: boolean) => {
      return !state;
    });
    saveTimezone(newState, selectedTimezone);
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
              saveTimezone(saveTimezoneChecked, _value);
            }}
          />

          <Checkbox
            className="pl-5 "
            label="I acknowledge that the above selection is correct."
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
