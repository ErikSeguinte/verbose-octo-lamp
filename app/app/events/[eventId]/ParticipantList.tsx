import Link from "next/link";
import React from "react";

import { UserDTO } from "@/models/Users";
import { cacheEvent } from "@/utils/utils";

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
    const eventItem = await cacheEvent({ _id: eventId });

    const users = participants.map((p) => {
      return (
        <ul className="list-disc" key={p._id}>
          <li>
            <Link href={`/invite/${eventItem?.inviteCode}/${p._id}`}>
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
    return (
      <>
        {" "}
        <h3>Participants</h3>
        {users}
      </>
    );
  }
};

export default ParticipantList;
