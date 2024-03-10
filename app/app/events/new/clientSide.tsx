"use client";
import {
  Button,
  Space,
  TextInput,
  TypographyStylesProvider,
} from "@mantine/core";
import React, { useEffect, useRef, useState } from "react";

import DaterangePicker from "@/components/daterangePicker";
import {
  timezoneActionTypes,
  timezoneDispatchTypes,
  useTimezoneContext,
} from "@/components/TimezoneProvider";
import { EventType } from "@/models/Event";
import { UserType } from "@/models/Users";

import { handleSubmit } from "./serverActions";
import TimezoneSelectionCard from "./TimezoneCard";
import { saveUser } from "@/utils/usersDB";
import { saveNewEvent, saveNewEventJSON } from "@/utils/eventsDB";

const NewEventCard = () => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);
  const [eventName, setEventName] = useState<string>("");
  const [, setTimezone] = useState("");

  const submitToServer = (event: React.MouseEvent) => {
    event.preventDefault();
    const user = new UserType({ email: timezoneInfo.email! });
    const [start, end] = dates;
    const newEvent = EventType.fromJsDates(eventName, start!, end!);
    // handleSubmit(JSON.stringify(user), JSON.stringify(newEvent, EventType.replacer));
    saveUser(user).then((user) => {
      newEvent.organizer = {$oid: user}
      return newEvent
    }).then(()=>{
      // const eventDoc = saveNewEventJSON(JSON.stringify(newEvent)) 
    })
    const message = newEvent.toString();
  };
  useEffect(() => {
    setTimezone(localStorage.getItem("localTimezone") as string);
  }, []);

  const [timezoneInfo, timezoneDispatch] = useTimezoneContext();

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (timezoneInfo.isAcknowledged) {
      buttonRef.current?.removeAttribute("disabled");
    } else {
      buttonRef.current?.setAttribute("disabled", "");
    }
  }, [timezoneInfo.isAcknowledged]);

  return (
    <>
      <TimezoneSelectionCard />
      <div className="mb-10">
        <TextInput
          label="New Event Name"
          value={eventName}
          withAsterisk
          onChange={(event) => setEventName(event.currentTarget.value)}
        />
        <Space h="sm" />
        <TextInput
        className="mb-5"
          label="Email"
          placeholder="your@email.com"
          onChange={(e) => {
            const dispatch: timezoneDispatchTypes = {
              newString: { email: e.target.value },
              type: timezoneActionTypes.SET,
            };
            timezoneDispatch(dispatch);
          }}
        />
        <TypographyStylesProvider>
          <p>
            Please select the desired dates with which to ask for
            availabilities. Note that to accommodate timezone weirdness, the
            actual dates that will be offered to users may include an additional
            day on either end of the given window.
          </p>
        </TypographyStylesProvider>


        <section className="">
          <DaterangePicker dates={dates} setDates={setDates} />
        </section>

        <Space h="xl" />

        <Button
          className="mb-10"
          ref={buttonRef}
          fullWidth
          onClick={submitToServer}
        >
          Submit
        </Button>
      </div>
    </>
  );
};

export default NewEventCard;
