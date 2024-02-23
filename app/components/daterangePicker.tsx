"use client"
import React from 'react'
import {useState} from "react"
import { DatePickerInput } from '@mantine/dates';
import { IconCalendar } from '@tabler/icons-react';
import { rem } from '@mantine/core';



const DaterangePicker = () => {
    const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
    const icon = <IconCalendar style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
    return (
      <DatePickerInput
        type="range"
        label="Pick dates range"
        placeholder="Pick dates range"
        value={value}
        onChange={setValue}
        leftSection={icon}
        leftSectionPointerEvents="none"
      />
  )
}

export default DaterangePicker