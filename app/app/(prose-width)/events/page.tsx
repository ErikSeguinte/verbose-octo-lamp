import Link from "next/link";
import React from "react";

const page = () => {
  const eventid = "65db61ae5d4b9ff749d35562";
  return (
    <div>
      <Link
        href={`/events/${eventid}`}
      >
        Event id: {eventid}
      </Link>
    </div>
  );
};

export default page;
