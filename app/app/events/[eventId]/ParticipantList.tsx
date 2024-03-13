import Link from "next/link";
import React from "react";

import { UserDTO } from "@/models/Users";

const ParticipantList = async ({
  participants,
  eventId,
}: {
  participants: UserDTO[] | null;
  eventId: string;
}) => {
  if (!participants) {
    return <></>;
  } else {
    const users = participants.map((p) => {
      return (
        <ul className="list-disc" key={p._id}>
          <li>
            <Link href={`/events/${eventId}/availabilities/${p._id}`}>
              {p.name ? p.name : p.email}
            </Link>
          </li>
          {p.discord ? (
            <ul>
              <li className={""}>discord: {p.discord}</li>
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
