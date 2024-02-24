"use client";
import { Button, Code, Space, TextInput } from "@mantine/core";
import DaterangePicker from "@/components/daterangePicker";
import React from "react";
import TimezoneSelect from "@/components/TimezoneSelect";
import { useState } from "react";

const NewEventPage = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>("");
  const [eventName, setEventName] = useState<string>("");

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();

    const message = `New event created: ${eventName}, between dates ${dates[0]} and ${dates[1]} originating from ${selectedTimezone}`;
    alert(message);
  };

  return (
    <div className="flex justify-center w-screen">
      <div className="prose m-10">
        <h2> Select your timezone. </h2>
        <p>
          Events often span multiple timezones. To ensure that availabilities
          are properly synchronized, please ensure that the correct timezone is
          chosen below. The select box will have attempted its best guess at
          your current timezone based on your browser settings. The textbox
          itself is searchable, as there are a metric shit-ton of timezones, so
          it may be easier to start typing and filtering them. Timezones are in
          the format <Code>America/Los Angeles</Code> or{" "}
          <Code>Europe/London</Code>.
        </p>

        <div className="not-prose">
          <TimezoneSelect
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
          />
        </div>

        <h2>Create a new event</h2>

        <TextInput
          label="New Event Name"
          value={eventName}
          withAsterisk
          onChange={(event) => setEventName(event.currentTarget.value)}
        />

        <p>
          Please select the desired dates with which to ask for availabilities.
          Note that to accommodate timezone weirdness, the actual dates that
          will be offered to users may include an additional day on either end
          of the given window.
        </p>

        <section className="not-prose">
          <DaterangePicker dates={dates} setDates={setDates} />
        </section>

        <Space h="xl" />

        <Button className="p-10" fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  );
};

export default NewEventPage;
