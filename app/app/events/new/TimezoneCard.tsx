"use client";
import {
  Button,
  Code,
  Space,
  TextInput,
  TypographyStylesProvider,
} from "@mantine/core";
import React, { useEffect, useState } from "react";

import TimezoneProvider from "@/components/TimezoneProvider";
import TimezoneSelect from "@/components/TimezoneSelect";
import { EventType } from "@/models/Event";

const TimezoneSelectionCard = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [eventName, setEventName] = useState<string>("");
  const [timeZone, setTimezone] = useState("");

  const handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const [start, end] = dates;
    const newEvent = EventType.fromJsDates(eventName, start!, end!);

    const message = newEvent.toString();
    alert(message);
  };
  useEffect(() => {
    setTimezone(localStorage.getItem("localTimezone") as string);
  }, []);

  return (
    <>
      <TimezoneProvider>
        {" "}
        <div className="">
          <div hidden={timeZone ? true : false}>
            <TypographyStylesProvider>
              <h2> Select your timezone. </h2>
              <p>
                Events often span multiple timezones. To ensure that
                availabilities are properly synchronized, please ensure that the
                correct timezone is chosen below. The select box will have
                attempted its best guess at your current timezone based on your
                browser settings. The textbox itself is searchable, as there are
                a metric shit-ton of timezones, so it may be easier to start
                typing and filtering them. Timezones are in the format{" "}
                <Code>America/Los Angeles</Code> or <Code>Europe/London</Code>.
              </p>
            </TypographyStylesProvider>
            <Space h="md" />
            <div className="">
              <TimezoneSelect />
            </div>
            <Space h="xl" />
          </div>
        </div>
      </TimezoneProvider>
    </>
  );
};

export default TimezoneSelectionCard;
