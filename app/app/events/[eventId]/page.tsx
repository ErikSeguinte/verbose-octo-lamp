import { Event } from "@/models/Event";
import { getData as getEventData } from "@/app/api/events/[eventId]/route";
import React from "react";

const page = async ({ params }: { params: { eventId: string } }) => {
  const newEvent: Event = await getEventData(params.eventId)
    .then((response) => response.json())
    .then((json) => Event.fromJson({ json }));

  return (
    <>
      {newEvent.eventName} {newEvent.startDate}
      <p>{newEvent.toString()}</p>
    </>
  );
};

export default page;
