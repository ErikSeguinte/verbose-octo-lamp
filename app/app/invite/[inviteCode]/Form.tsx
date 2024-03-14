"use client";
import {
  Box,
  Button,
  Checkbox,
  Code,
  Group,
  Loader,
  Paper,
  rem,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";

const TimezoneText = () => {
  return (
    <p>
      Events often span multiple timezones. To ensure that availabilities are
      properly synchronized, please ensure that the correct timezone is chosen
      below. The select box will have attempted its best guess at your current
      timezone based on your browser settings. The textbox itself is searchable,
      as there are a metric shit-ton of timezones, so it may be easier to start
      typing and filtering them. Timezones are in the format{" "}
      <Code>America/Los Angeles</Code> or <Code>Europe/London</Code>.
    </p>
  );
};

export const Form = () => {
  const form = useForm({
    initialValues: {
      discord: "",
      email: "",
      name: "",
      timezone: "",
    },

    // validate: {
    //   email: (value) => (emailRegex.test(value) ? null : "Invalid email"),
    //   name: (v) => (v ? null : "Name is required"),
    // },
  });


  const [select, setSelect] = useState(<Loader color="blue" />);

  useEffect(() => {
    const local = DateTime.now().zoneName;
    const props = {
      form: form,
      localTimezone: local,
    };
    setSelect(TimezoneSelect(props));
  }, []);

  return (
    <Stack maw={rem(600)} px="1rem">
      <form
        onSubmit={form.onSubmit((v) => {
          alert(JSON.stringify(v, null, 2));
        })}
      >
        <Paper p="1rem" radius="md" shadow="md" withBorder>
          <p className="px-2 text-balance">
            Your email address will not be shared with the event organizer. It
            will only be used to match you with your events and optionally to
            see your event history.
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
            Please use a name that your organizer will be able to recognize you
            as. Providing both your name as the actor and the character you are
            playing may be helpful
          </p>
          <TextInput
            label="Name"
            placeholder="Verby Octlamp | The Yagsa"
            {...form.getInputProps("name")}
            withAsterisk
          />
        </Paper>

        <Paper p="1rem" radius="md" shadow="md" withBorder>
          <p className="px-2 text-balance">
            Additionally, you may provide the server nickname you are currently
            using on the production server.
          </p>
          <TextInput
            label="Discord"
            placeholder="Discord Displayname"
            {...form.getInputProps("discord")}
          />
        </Paper>

        <Paper p="1rem" radius="md" shadow="md" withBorder>
          <TimezoneText />
          {select}
        </Paper>
        <Button mt="sm" type="submit">
          Submit
        </Button>
      </form>
    </Stack>
  );
};

const TimezoneSelect = (props: { form: any; localTimezone: string }) => {
  return (
    <Select
      className=""
      {...props.form.getInputProps("timezone")}
      data={Intl.supportedValuesOf("timeZone")}
      defaultSearchValue={props.localTimezone}
      label="Please select your timezone"
      limit={100}
      styles={{ wrapper: { width: "auto" } }}
      clearable
      searchable
      withAsterisk
      // onSearchChange={setSearchValue}
    />
  );
};

export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
