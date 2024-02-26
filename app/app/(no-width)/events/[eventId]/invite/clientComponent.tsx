"use client";
import { Code, Space, TypographyStylesProvider } from "@mantine/core";
import { expandedDtInterface } from "@/models/Event";
import React from "react";
import TimezoneSelect from "@/components/TimezoneSelect";
import { useState } from "react";

const ClientComponent = ({
  timeSlots,
}: {
  timeSlots: expandedDtInterface[];
}) => {
  console.log(timeSlots);
  const [selectedTimezone, setSelectedTimezone] = useState<string | null>("");
  return (
    <div>
      <TypographyStylesProvider>
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
      </TypographyStylesProvider>
      <Space h="md" />
      <div className="">
        <TimezoneSelect
          selectedTimezone={selectedTimezone}
          setSelectedTimezone={setSelectedTimezone}
        />

        {/* <TimeSlotTable eventId={params.eventId}/> */}
      </div>
      <p>{JSON.stringify(timeSlots)}</p>
    </div>
  );
};

export default ClientComponent;
