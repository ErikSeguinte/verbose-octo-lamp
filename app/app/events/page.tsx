import { TypographyStylesProvider } from "@mantine/core";
import Link from "next/link";
import React from "react";

const page = () => {
  const eventids = ["65db61ae5d4b9ff749d35562", "65dfae8e8e8d5a55271b4e32"];

  const nodes = eventids.map((eventid) => {
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
