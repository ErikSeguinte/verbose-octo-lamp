import { Title } from "@mantine/core";
import React from "react";

import MaxProse from "@/components/MaxProse";
import { eventDTOSchema, EventQuery, EventQuerySchema } from "@/models/Event";
import { cacheEvent, tryParse } from "@/utils/utils";

const InviteLayout = async ({
  params,
  children,
}: {
  params: { inviteCode: string };
  children: Readonly<{
    children: React.ReactNode;
  }>;
}) => {
  const query = tryParse<EventQuery>(
    { inviteCode: params.inviteCode },
    EventQuerySchema,
  );
  const result = eventDTOSchema.safeParse(await cacheEvent({ query }));
  if (!result.success) {
    throw new Error();
  }
  const eventItem = result.data;
  return (
    <>
      {" "}
      <MaxProse>
        <Title order={1}>{eventItem.eventName}</Title>
      </MaxProse>
      {children}
    </>
  );
};

export default InviteLayout;
