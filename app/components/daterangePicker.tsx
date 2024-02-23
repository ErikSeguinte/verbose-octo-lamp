"use client";
import React from "react";
import { useState, Dispatch } from "react";
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
    <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
  );
  return (
    <DatePickerInput
      type="range"
      label="Pick dates range"
      placeholder="Pick dates range"
      value={dates}
      onChange={setDates}
      leftSection={icon}
      leftSectionPointerEvents="none"
    />
  );
};

export default DaterangePicker;
