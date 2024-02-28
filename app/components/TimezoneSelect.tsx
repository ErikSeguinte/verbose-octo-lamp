"use client";
import {
  Button,
  Checkbox,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
} from "@mantine/core";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";

import {
  fetchAction,
  setAction,
  timezoneActionTypes,
  TimezoneDispatchTypes,
  toggleAction,
  useTimezone,
  useTimezoneDispatch,
} from "./TimezoneProvider";

const getTimezoneFromStorage = (): string => {
  const key = "localTimezone";
  let timezone: string;

  const tz = localStorage.getItem(key)
    ? localStorage.getItem(key)
    : sessionStorage.getItem(key);

  if (tz) {
    return tz;
  }
  return "";
};

const Timezone = () => {
  const [localTimezone, setLocalTimezone] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
  const timezoneInfo = useTimezone();
  const timezoneDispatch = useTimezoneDispatch();

  // Initial Setup
  useEffect(() => {
    let dispatch: TimezoneDispatchTypes = { type: timezoneActionTypes.FETCH };

    timezoneDispatch(dispatch);
    if (timezoneInfo.timezone) {
      setIsAcknowledged(true);
    }
    setSearchValue(timezoneInfo.timezone);
    setIsLoading(false);
  }, [timezoneDispatch]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Paper p="1rem" radius="md" shadow="md" withBorder>
        <Stack>
          <Select
            className=""
            data={Intl.supportedValuesOf("timeZone")}
            label="Please select your timezone"
            limit={100}
            searchValue={searchValue}
            styles={{ wrapper: { width: 600 } }}
            value={timezoneInfo.timezone}
            clearable
            searchable
            withAsterisk
            onSearchChange={setSearchValue}
            onChange={(_value) => {
              const dispatch: TimezoneDispatchTypes = {
                newTimezone: _value ? _value : "",
                type: timezoneActionTypes.SET,
              };
              timezoneDispatch(dispatch);
            }}
          />

          <Checkbox
            label="I acknowledge that the above selection is correct."
            onChange={() =>
              setIsAcknowledged((state) => {
                return !state;
              })
            }
          />
          <Checkbox
            checked={timezoneInfo.checked}
            label="Remember my timezone."
            onChange={(value) => {
              const dispatch: TimezoneDispatchTypes = {
                type: timezoneActionTypes.TOGGLE,
              };
              timezoneDispatch(dispatch);
            }}
          />
        </Stack>
        <div></div>
        <br />
      </Paper>
    </div>
  );
};

export default Timezone;
