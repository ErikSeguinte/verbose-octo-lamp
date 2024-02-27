"use client";
import { rem } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import React, { Dispatch } from "react";

type dateOrNull = Date | null;
type doubleDateOrNull = [dateOrNull, dateOrNull];

const DaterangePicker = ({
  dates,
  setDates,
}: {
  dates: doubleDateOrNull;
  setDates: Dispatch<doubleDateOrNull>;
}) => {
  const icon = (
    <IconCalendar stroke={1.5} style={{ height: rem(18), width: rem(18) }} />
  );
  return (
    <DatePickerInput
      label="Pick dates range"
      leftSection={icon}
      leftSectionPointerEvents="none"
      placeholder="Pick dates range"
      type="range"
      value={dates}
      withAsterisk
      onChange={setDates}
    />
  );
};

export default DaterangePicker;
