"use client";
import {
  Button,
  Space,
  TextInput,
  TypographyStylesProvider,
} from "@mantine/core";
import React, { useState } from "react";

import DaterangePicker from "@/components/daterangePicker";
import TimezoneSelect from "@/components/TimezoneSelect";
import { EventType } from "@/models/Event";

const NewEventPage = ({ children }: { children: React.ReactNode }) => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>("");
  const [eventName, setEventName] = useState<string>("");

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const [start, end] = dates;
    const newEvent = EventType.fromJsDates(eventName, start!, end!);

    const message = newEvent.toString();
    alert(message);
  };

  return (
    <div className="m-10">
      {children}

      <Space h="md" />
      <div className="">
        <TimezoneSelect
          selectedTimezone={selectedTimezone}
          setSelectedTimezone={setSelectedTimezone}
        />
      </div>
      <Space h="xl" />
      <TypographyStylesProvider>
        <h2>Create a new event</h2>
      </TypographyStylesProvider>
      <Space h="sm" />
      <TextInput
        label="New Event Name"
        value={eventName}
        withAsterisk
        onChange={(event) => setEventName(event.currentTarget.value)}
      />
      <Space h="md" />
      <TypographyStylesProvider>
        <p>
          Please select the desired dates with which to ask for availabilities.
          Note that to accommodate timezone weirdness, the actual dates that
          will be offered to users may include an additional day on either end
          of the given window.
        </p>
      </TypographyStylesProvider>

      <Space h="md" />

      <section className="">
        <DaterangePicker dates={dates} setDates={setDates} />
      </section>

      <Space h="xl" />

      <Button className="p-10" fullWidth onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default NewEventPage;
