import { Button, Paper, rem, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React from "react";

import Timezone from "@/components/TimezoneSelect";

import { submitToServer } from "./serveractions";

const Form = () => {
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
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
      timeslots: selectedDates,
    };
    submitToServer(data);
  };

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
              withAsterisk
              {...form.getInputProps("name")}
            />
          </Paper>
          <Timezone />
          <Button mt="sm" type="submit">
            Submit
          </Button>
        </form>
      </Stack>
    </>
  );
};

export default Form;
