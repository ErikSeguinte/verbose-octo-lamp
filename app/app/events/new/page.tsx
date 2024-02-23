"use client";
import { Code } from "@mantine/core";
import DaterangePicker from "@/components/daterangePicker";
import React from "react";
import TimezoneSelect from "@/components/TimezoneSelect";
import { useState } from "react";

const NewEventPage = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  return (
    <div className="flex justify-center w-screen">
      <div className="prose m-10">
        <h2> Select your timezone. </h2>
        <p>
          Events often span multiple timezones. To ensure that availabilities
          are properly syncronized, please ensure that the correct timezone is
          chosen below. The select box will have attempted its best guess at
          your current timezone based on your browser settings. The textbox
          itself is searchable, as there are a metric shit-ton of timezones, so
          it may be easier to start typing and filtering them. Timezones are in
          the format <Code>America/Los Angeles</Code> or{" "}
          <Code>Europe/London</Code>.
        </p>

        <div className="not-prose">
          <TimezoneSelect />
        </div>

        <h2>Create a new event</h2>

        <p>
          Please select the desired dates with which to ask for availabilities.
          Note that to accommodate timezone weirdness, the actual dates that
          will be offered to users may include an additional day on either end
          of the given window.
        </p>

        <section className="not-prose">
          <DaterangePicker dates={dates} setDates={setDates} />
        </section>
      </div>
    </div>
  );
};

export default NewEventPage;
