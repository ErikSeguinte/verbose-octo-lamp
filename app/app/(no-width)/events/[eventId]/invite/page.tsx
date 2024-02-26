import ClientComponent from "./clientComponent";
import { getEventData } from "@/utils/database";
import React from "react";

const Page = async ({ params }: { params: { eventId: string } }) => {
  const eventItem = await getEventData(params.eventId);
  const timeSlots: string[] = eventItem.timeSlots.map((slot) => {
    const s = slot.toISO();
    return s as string;
  });
  return (
    <>
      <ClientComponent timeSlots={timeSlots} />
    </>
  );
};

export default Page;
