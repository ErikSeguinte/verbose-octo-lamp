"use client";
import {
  Button,
  Checkbox,
  Code,
  Divider,
  Loader,
  Paper,
  Select,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconBrandDiscord,
  IconMail,
  IconUser,
  IconWorldSearch,
} from "@tabler/icons-react";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { EventDTO } from "@/models/Event";

import { submitToServer } from "./serveractions";

const TimezoneText = () => {
  return (
    <p className="px-8 text-pretty mx-auto">
      {" "}
      Events often span multiple timezones. To ensure that availabilities are
      properly synchronized, please ensure that the correct timezone is chosen
      below. The select box will have attempted its best guess at your current
      timezone based on your browser settings. The textbox itself is searchable,
      as there are a metric shit-ton of timezones, so it may be easier to start
      typing and filtering them. Timezones are in the format
      <Code>America/Los Angeles</Code> or <Code>Europe/London</Code>.
    </p>
  );
};

export const Form = ({ event }: { event: EventDTO }) => {
  const handleSubmit = (v: any) => {
    submitToServer(v).then((user) => {
      router.push(
        `/invite/${event.inviteCode}/${user}?timezone=${encodeURIComponent(v.timezone)}`,
      );
    });
  };
  const { _id } = event;

  const form = useForm({
    initialValues: {
      discord: "",
      email: "",
      eventId: _id,
      name: "",
      timezone: "",
    },

    validate: {
      email: (value) => (emailRegex.test(value) ? null : "Invalid email"),
      name: (v) => (v ? null : "Name is required"),
    },
  });

  const [select, setSelect] = useState(<Loader color="blue" />);
  const router = useRouter();

  useEffect(() => {
    const local = DateTime.now().zoneName;
    const props = {
      form: form,
      localTimezone: local,
    };
    form.setFieldValue("timezone", local);
    setSelect(TimezoneSelect(props));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <form
        className="mx-2"
        onSubmit={form.onSubmit((v) => {
          handleSubmit(v);
        })}
      >
        <Paper m="md" p="sm" radius="md" shadow="xl" withBorder>
          <Stack gap="md" justify="space-around" px="1rem">
            <div>
              <p className="px-8 text-balance mx-auto">
                Your email address will not be shared with the event organizer.
                It will only be used to match you with your events and
                optionally to see your event history.
              </p>
              <TextInput
                label="Email"
                leftSection={<IconMail />}
                placeholder="your@email.com"
                withAsterisk
                {...form.getInputProps("email")}
                className="m-{-2}"
                data-autofocus
              />
            </div>
            <Divider my="0" />
            <p className="px-8 text-balance mx-auto">
              {" "}
              Please use a name that your organizer will be able to recognize
              you as. Providing both your name as the actor and the character
              you are playing may be helpful
            </p>
            <TextInput
              label="Name"
              placeholder="Verby Octlamp | The Yagsa"
              {...form.getInputProps("name")}
              leftSection={<IconUser />}
              withAsterisk
            />
            <Divider my="" />
            <p className="px-8 text-balance mx-auto">
              Additionally, you may provide the server nickname you are
              currently using on the production server.
            </p>
            <TextInput
              label="Discord"
              leftSection={<IconBrandDiscord />}
              placeholder="Discord Displayname"
              {...form.getInputProps("discord")}
            />
            <Divider my="" />
            <TimezoneText />
            {select}
          </Stack>
        </Paper>
        <Button mb="lg" mt="sm" type="submit" fullWidth>
          Submit
        </Button>
      </form>
    </>
  );
};

function TimezoneSelect(props: { form: any; localTimezone: string }) {
  return (
    <>
      <Select
        className=""
        data={Intl.supportedValuesOf("timeZone")}
        defaultValue={props.localTimezone}
        label="Please select your timezone"
        leftSection={<IconWorldSearch />}
        clearable
        searchable
        withAsterisk
        withCheckIcon
        onChange={(_value) => props.form.setFieldValue("timezone", _value)}
      />
      <Checkbox
        label="I acknowledge that the above selection is correct."
        mt="sm"
        required={true}
      />
    </>
  );
}

export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
