import ClientComponent from "./clientComponent";
import { expandedDtInterface } from "@/models/Event";
import { getEventData } from "@/utils/database";
import React from "react";

const Page = async ({ params }: { params: { eventId: string } }) => {
  const eventItem = await getEventData(params.eventId);
  const timeSlots: expandedDtInterface[] = eventItem.timeSlots?.map(
    (slot) => slot.toObject() as expandedDtInterface,
  );
  return (
    <>
      <ClientComponent timeSlots={timeSlots} />
    </>
  );
};

export default Page;
