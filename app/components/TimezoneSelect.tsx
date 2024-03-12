"use client";
import { Checkbox, LoadingOverlay, Paper, Select, Stack } from "@mantine/core";
import classNames from "classnames";
import { DateTime } from "luxon";
import { useCallback, useEffect, useState } from "react";

import {
  timezoneActionTypes,
  timezoneDispatchTypes,
  timezoneState,
  useTimezoneContext,
} from "./TimezoneProvider";

const Timezone = ({ text }: { text?: string }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setIsAcknowledged] = useState<boolean>(false);
  const [timezoneInfo, timezoneDispatch] = useTimezoneContext();
  const selectBoxDispatch = (value: timezoneState) => {
    const dispatch: timezoneDispatchTypes = {
      newString: value,
      type: timezoneActionTypes.SET,
    };
    timezoneDispatch(dispatch);
    setSearchValue(value.timezone as string);
  };

  // Initial Setup

  const loadDataOnlyOnce = useCallback(() => {
    let dispatch: timezoneDispatchTypes = { type: timezoneActionTypes.FETCH };

    timezoneDispatch(dispatch);
    if (!timezoneInfo.timezone) {
      const local = DateTime.now().zoneName;
      setSearchValue(local);
    }
    if (timezoneInfo.isAcknowledged) {
      setIsAcknowledged(true);
    }
    setIsLoading(false);
  }, [timezoneDispatch, timezoneInfo.isAcknowledged, timezoneInfo.timezone]);

  useEffect(() => {
    loadDataOnlyOnce();
  }, [loadDataOnlyOnce]);

  return (
    <>
      <Paper p="1rem" radius="md" shadow="md" withBorder>
        <Stack pos="relative">
          <LoadingOverlay
            overlayProps={{ blur: 2, radius: "sm" }}
            visible={isLoading}
            zIndex={1000}
          />
          <p className={classNames({ hidden: !text })}>{text}</p>
          <Select
            className=""
            data={Intl.supportedValuesOf("timeZone")}
            label="Please select your timezone"
            limit={100}
            searchValue={searchValue}
            styles={{ wrapper: { width: "auto" } }}
            value={searchValue}
            clearable
            searchable
            withAsterisk
            onSearchChange={setSearchValue}
            onChange={(v) => {
              selectBoxDispatch({ timezone: v as string });
            }}
          />

          <Checkbox
            checked={timezoneInfo.isAcknowledged}
            label="I acknowledge that the above selection is correct."
            onChange={(s) => {
              const dispatch: timezoneDispatchTypes = {
                newString: { isAcknowledged: s.target.checked },
                type: timezoneActionTypes.SET,
              };
              timezoneDispatch(dispatch);
            }}
          />
          <Checkbox
            checked={timezoneInfo.toSave}
            label="Remember my timezone."
            onChange={() => {
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
    </>
  );
};

export default Timezone;
