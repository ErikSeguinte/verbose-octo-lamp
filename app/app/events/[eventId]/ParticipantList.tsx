import { Paper } from "@mantine/core";
import { DateTime } from "luxon";
import Link from "next/link";
import React from "react";

import { AvailabilityType } from "@/models/Availabilities";
import { EventType } from "@/models/Event";
import { UserType } from "@/models/Users";
import { getAllMapped } from "@/utils/usersDB";

const ParticipantList = async ({ event }: { event: EventType }) => {
  if (!event.participants) {
    return <></>;
  } else {
    const participants = event.participants;
    const userMap = await getAllMapped();
    const users = participants.map((p) => {
      const user: UserType = userMap.get(p.$oid) as UserType;

      return (
        <ul key={p.$oid}>
          <li>
            <Link
              href={`/events/${event.id.$oid}/availabilities/${user.id.$oid}`}
            >
              {user.name}{" "}
            </Link>
          </li>
          {user.discord ? <li>{user.discord}</li> : <></>}
        </ul>
      );
    });
    return <>{users}</>;
  }
};

export default ParticipantList;
