import React from "react";

import { AvailabilityType } from "@/models/Availabilities";
import { query } from "@/utils/availabilitiesDB";
import { toOid } from "@/utils/utils";

const page = async ({
  params,
}: {
  params: { eventId: string; userId: string };
}) => {
  const res: AvailabilityType[] = await query({
    event: toOid(params.eventId),
    user: toOid(params.userId),
  });
  const availability = res[0];
  return <div>{JSON.stringify(availability)}</div>;
};

export default page;
