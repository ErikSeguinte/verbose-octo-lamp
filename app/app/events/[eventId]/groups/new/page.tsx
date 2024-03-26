import { notFound } from "next/navigation";
import React from "react";

import { UserAdvancedQuery, userAdvancedQuerySchema } from "@/models/Users";
import { findUsers, queryUsers } from "@/utils/usersDB";
import { cacheEvent, tryParse } from "@/utils/utils";

import CreateRecordingGroup from "./createRecordingGroup";
import {
  EventDTO,
  EventQuery,
  EventQueryInput,
  EventQuerySchema,
} from "@/models/Event";
import { findOneEvent } from "@/utils/eventsDB";

const Page = async ({ params }: { params: { eventId: string } }) => {
  const parsedEventQuery = tryParse<EventQuery>(
    {
      _id: params.eventId,
    },
    EventQuerySchema
  );
  const eventItem = await cacheEvent(parsedEventQuery);
  if (!eventItem) {
    notFound();
  }

  const parsedUserQuery = tryParse<UserAdvancedQuery>(
    { _id: { $in: Array.from(eventItem.participants) } },
    userAdvancedQuerySchema
  );

  const participants = await queryUsers({ query: parsedUserQuery });
  if (!participants) notFound();
  return <CreateRecordingGroup participants={participants} />;
};

export default Page;
