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
import { useCallback, useEffect, useState } from "react";

import {
  timezoneActionTypes,
  timezoneDispatchTypes,
  useTimezone,
  useTimezoneContext,
  useTimezoneDispatch,
} from "./TimezoneProvider";


const Timezone = () => {
  const [localTimezone, setLocalTimezone] = useState<string>("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);
  const timezoneInfo = useTimezone()
  const timezoneDispatch = useTimezoneDispatch()
  const selectBoxDispatch = (value: string | null) => {
    const newVal = value ? value : "";
    const dispatch: timezoneDispatchTypes = {
      newTimezone: newVal,
      type: timezoneActionTypes.SET,
    };
    timezoneDispatch(dispatch);
    setSearchValue(newVal);
  };

  // Initial Setup

  const loadDataOnlyOnce = useCallback(() => {
    let dispatch: timezoneDispatchTypes = { type: timezoneActionTypes.FETCH };

    timezoneDispatch(dispatch);
    if (!timezoneInfo.timezone) {
      const local = DateTime.now().zoneName;
      setSearchValue(local);
    }
    if (timezoneInfo.checked) {
      setIsAcknowledged(true);
    }
    setIsLoading(false);
  }, [timezoneDispatch, timezoneInfo.checked, timezoneInfo.timezone]);

  useEffect(() => {
    loadDataOnlyOnce();
  }, [loadDataOnlyOnce]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Paper p="1rem" radius="md" shadow="md" withBorder>
        <Stack pos="relative">
          <LoadingOverlay
            overlayProps={{ blur: 2, radius: "sm" }}
            visible={isLoading}
            zIndex={1000}
          />
          <Select
            className=""
            data={Intl.supportedValuesOf("timeZone")}
            label="Please select your timezone"
            limit={100}
            searchValue={searchValue}
            styles={{ wrapper: { width: 400 } }}
            value={searchValue}
            clearable
            searchable
            withAsterisk
            onChange={selectBoxDispatch}
            onSearchChange={setSearchValue}
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
              const dispatch: timezoneDispatchTypes = {
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
