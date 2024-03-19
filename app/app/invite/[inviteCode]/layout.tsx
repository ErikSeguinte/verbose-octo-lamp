import { Title } from "@mantine/core";
import React from "react";

import MaxProse from "@/components/MaxProse";
import {
  EventDTO,
  EventDTOInput,
  eventDTOSchema,
  EventQuery,
  EventQueryInput,
  EventQuerySchema,
} from "@/models/Event";
import { findOneEvent } from "@/utils/eventsDB";
import { tryParse } from "@/utils/utils";

type Props = { inviteCode: string };

const InviteLayout = async ({
  params,
  children,
}: {
  params: Props;
  children: React.ReactNode;
}) => {
  const query = tryParse<EventQuery, EventQueryInput>(
    { inviteCode: params.inviteCode },
    EventQuerySchema,
  );
  const result = await findOneEvent(query);
  if (!result) throw Error("no results found");
  const eventItem = tryParse<EventDTO, EventDTOInput>(result, eventDTOSchema);
  return (
    <>
      <MaxProse>
        <Title order={1}>{eventItem.eventName}</Title>
      </MaxProse>
      {children}
    </>
  );
};

export default InviteLayout;
