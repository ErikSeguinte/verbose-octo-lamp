"use client";
import React from "react";
import { Dispatch, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import { rem } from "@mantine/core";

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
    <IconCalendar stroke={1.5} style={{ width: rem(18), height: rem(18) }} />
  );
  return (
    <DatePickerInput
      label="Pick dates range"
      leftSection={icon}
      leftSectionPointerEvents="none"
      placeholder="Pick dates range"
      type="range"
      value={dates}
      onChange={setDates}
    />
  );
};

export default DaterangePicker;
