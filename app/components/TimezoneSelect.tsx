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
  const [saveTimezoneChecked, setSaveTimezoneChecked] =
    useState<boolean>(false);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAcknowledged, setIsAcknowledged] = useState<boolean>(false);

  const handleSaveTimezone = (checked: boolean, tz: string | null) => {
    const key = "localTimezone";
    if (checked) {
      tz && window.localStorage.setItem(key, tz);
      sessionStorage.removeItem(key);
    } else {
      tz && sessionStorage.setItem(key, tz);
      localStorage.removeItem(key);
    }
  };

  useEffect(() => {
    if (!getTimezoneFromStorage()) {
      const localTime = DateTime.local();
      setLocalTimezone(localTime.zoneName);
    } else {
      setLocalTimezone(getTimezoneFromStorage());
      setSaveTimezoneChecked(true);
      setIsAcknowledged(true);
    }
    setSelectedTimezone(localTimezone);
    setSearchValue(localTimezone);
    setIsLoading(false);
  }, [localTimezone, setSelectedTimezone]);

  const handleCheck = () => {
    const newState = !saveTimezoneChecked;
    setSaveTimezoneChecked((state: boolean) => {
      const new_state = !state;
      if (new_state == false) {
        localStorage.removeItem("localTimezone");
      }
      return !state;
    });
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <Paper p="2rem" radius="md" shadow="md" withBorder>
        <Stack>
          <LoadingOverlay overlayBlur={2} visible={isLoading} />
          <Select
            className=""
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
            checked={saveTimezoneChecked}
            label="Remember my timezone."
            onChange={handleCheck}
          />

          <Button
            disabled={!isAcknowledged}
            fullWidth
            onClick={() =>
              handleSaveTimezone(saveTimezoneChecked, selectedTimezone)
            }
          >
            Submit
          </Button>
        </Stack>
        <div></div>
        <br />
      </Paper>
    </div>
  );
};

export default Timezone;
