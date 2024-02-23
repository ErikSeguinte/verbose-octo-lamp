"use client"
import React from 'react'
import {useState} from "react"
import { DatePickerInput } from '@mantine/dates';


const DaterangePicker = () => {
    const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
    return (
      <DatePickerInput
        type="range"
        label="Pick dates range"
        placeholder="Pick dates range"
        value={value}
        onChange={setValue}
      />
  )
}

export default DaterangePicker