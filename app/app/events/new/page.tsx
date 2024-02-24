"use client";
import {
  Button,
  Code,
  Space,
  TextInput,
  TypographyStylesProvider,
} from "@mantine/core";
import DaterangePicker from "@/components/daterangePicker";
import { Event } from "@/models/Event";
import React from "react";
import TimezoneSelect from "@/components/TimezoneSelect";
import { useState } from "react";

const NewEventPage = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>("");
  const [eventName, setEventName] = useState<string>("");

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const [start, end] = dates
    const newEvent = Event.fromJsDates(eventName, start!, end!)

    const message = newEvent.toString();
    alert(message)
  };

  return (
    <div className="flex w-auto justify-center">
      <div className="flex justify-center w-2/3">
        <div className="m-10">
          <TypographyStylesProvider>
            <h2> Select your timezone. </h2>
            <p>
              Events often span multiple timezones. To ensure that
              availabilities are properly synchronized, please ensure that the
              correct timezone is chosen below. The select box will have
              attempted its best guess at your current timezone based on your
              browser settings. The textbox itself is searchable, as there are a
              metric shit-ton of timezones, so it may be easier to start typing
              and filtering them. Timezones are in the format{" "}
              <Code>America/Los Angeles</Code> or <Code>Europe/London</Code>.
            </p>
          </TypographyStylesProvider>

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
              Please select the desired dates with which to ask for
              availabilities. Note that to accommodate timezone weirdness, the
              actual dates that will be offered to users may include an
              additional day on either end of the given window.
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
      </div>
    </div>
  );
};

export default NewEventPage;
