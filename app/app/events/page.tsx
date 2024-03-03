import { TypographyStylesProvider } from "@mantine/core";
import Link from "next/link";
import React from "react";

import { getAllEventIds } from "@/utils/database";

const page = async () => {
  const eventids = await getAllEventIds();

  const nodes = eventids.map((eventid: string) => {
    return (
      <li key={eventid}>
        <Link href={`/events/${eventid}`}>Event id: {eventid}</Link>
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
