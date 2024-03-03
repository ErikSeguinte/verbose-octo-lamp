import { TypographyStylesProvider } from "@mantine/core";
import Link from "next/link";
import React from "react";

import { Events } from "@/utils/database";

const page = async () => {
  const events = await Events.getAllEvents();

  const nodes = events.map((e) => {
    // console.log(eventid)
    return (
      <li key={e.eventId}>
        <Link href={`/events/${e.eventId}`}>Event: {e.eventName}</Link>
        <br />
        {e.startDate.toLocaleString()} - {e.endDate.toLocaleString()}
      </li>
    );
  });
  return (
    <>
      <TypographyStylesProvider>
        <ul>{nodes}</ul>
      </TypographyStylesProvider>
    </>
  );
};

export default page;
