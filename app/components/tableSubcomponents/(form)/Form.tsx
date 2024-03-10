import { Button, Paper, rem, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useEffect, useRef } from "react";

import {
  timezoneActionTypes,
  timezoneDispatchTypes,
  useTimezoneContext,
} from "@/components/TimezoneProvider";
import Timezone from "@/components/TimezoneSelect";

import { submitToServer } from "./serveractions";

const Form = ({ eventId }: { eventId: string }) => {
  const form = useForm({
    initialValues: {
      discord: "",
      email: "",
      name: "",
    },

    validate: {
      email: (value) => (emailRegex.test(value) ? null : "Invalid email"),
      name: (v) => (v ? null : "Name is required"),
    },
  });
  const submitAction = (v: any) => {
    const selected = document.querySelectorAll("[data-is-selected]");

    const selectedDates = [];

    for (const e of selected) {
      selectedDates.push(e.getAttribute("data-dt"));
    }
    console.log("submitting");
    const data = {
      ...v,
      eventId: eventId,
      timeslots: selectedDates,
    };
    submitToServer(data);
  };

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
      <Stack maw={rem(600)} px="1rem">
        <form
          onSubmit={form.onSubmit((v) => {
            submitAction(v);
          })}
        >
          <Paper p="1rem" radius="md" shadow="md" withBorder>
            <p className="px-2 text-balance">
              Your name will not be shared with the event organizer. It will
              only be used to match you with your events and optionally to see
              your event history.
            </p>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              withAsterisk
              {...form.getInputProps("email")}
              data-autofocus
              onChange={(e) => {
                const dispatch: timezoneDispatchTypes = {
                  newString: { email: e.target.value },
                  type: timezoneActionTypes.SET,
                };
                timezoneDispatch(dispatch);
                form.setFieldValue("email", e.target.value as string);
              }}
            />
          </Paper>
          <Paper p="1rem" radius="md" shadow="md" withBorder>
            <p className="px-2 text-balance">
              Please use a name that your organizer will be able to recognize
              you as. Providing both your name as the actor and the character
              you are playing may be helpful
            </p>
            <TextInput
              label="Name"
              placeholder="Verby Octlamp | The Yagsa"
              {...form.getInputProps("name")}
              withAsterisk
              onChange={(e) => {
                const dispatch: timezoneDispatchTypes = {
                  newString: { name: e.target.value as string },
                  type: timezoneActionTypes.SET,
                };
                timezoneDispatch(dispatch);
                form.setFieldValue("name", e.target.value as string);
              }}
            />
          </Paper>

          <Paper p="1rem" radius="md" shadow="md" withBorder>
            <p className="px-2 text-balance">
              Additionally, you may provide the server nickname you are
              currently using on the production server.
            </p>
            <TextInput
              label="Discord"
              placeholder="Discord Displayname"
              {...form.getInputProps("discord")}
              onChange={(e) => {
                const dispatch: timezoneDispatchTypes = {
                  newString: { discord: e.target.value as string },
                  type: timezoneActionTypes.SET,
                };
                timezoneDispatch(dispatch);
                form.setFieldValue("discord", e.target.value as string);
              }}
            />
          </Paper>
          <Timezone />
          <Button mt="sm" ref={buttonRef} type="submit">
            Submit
          </Button>
        </form>
      </Stack>
    </>
  );
};

export default Form;

const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
