"use client";
import TimezoneProvider from "@c/TimezoneProvider";
import { Stack, Title } from "@mantine/core";
import React from "react";

import MaxProse from "@/components/MaxProse";

import NewEventCard from "./clientSide";
import LocalClock from "./LocalClock";
import Section1 from "./section1";
import TimezoneSelectionCard from "./TimezoneCard";

const Page = () => {
  return (
    <MaxProse>
      <Stack>
        <div>
          <Title order={1} ta="center">
            Create a New Event
          </Title>
        </div>

        <TimezoneProvider>
          {" "}
          <TimezoneSelectionCard></TimezoneSelectionCard>
          <NewEventCard />
          <LocalClock />
        </TimezoneProvider>
      </Stack>
    </MaxProse>
  );
};

export default Page;
