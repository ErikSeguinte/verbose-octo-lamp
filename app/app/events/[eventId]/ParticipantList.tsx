import Link from "next/link";
import React from "react";

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
        <ul className="list-disc" key={p.$oid}>
          <li>
            <Link
              href={`/events/${event.id.$oid}/availabilities/${user.id.$oid}`}
            >
              {user.name}{" "}
            </Link>
          </li>
          {user.discord ? (
            <ul>
              <li className={""}>discord: {user.discord}</li>
            </ul>
          ) : (
            <></>
          )}
        </ul>
      );
    });
    return <>{users}</>;
  }
};

export default ParticipantList;
