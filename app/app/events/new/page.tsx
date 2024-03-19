"use client";
import TimezoneProvider from "@c/TimezoneProvider";
import { Stack, Title } from "@mantine/core";
import React from "react";

import MaxProse from "@/components/MaxProse";

import NewEventCard from "./clientSide";
// import LocalClock from "./LocalClock";

const Page = () => {
  return (
    <MaxProse>
      <Stack>
        <div>
          <Title order={1} ta="center">
            Create a New Event
          </Title>
        </div>
        <TimezoneProvider value={""}>
          <NewEventCard />
        </TimezoneProvider>
      </Stack>
    </MaxProse>
  );
};

export default Page;
