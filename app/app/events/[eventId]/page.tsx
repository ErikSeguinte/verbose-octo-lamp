"use server";
import { Paper, Space, TypographyStylesProvider } from "@mantine/core";
import { Set } from "immutable";
import { DateTime, Duration, Interval } from "luxon";
import React from "react";

import MaxProse from "@/components/MaxProse";
import { AvailabilityType } from "@/models/Availabilities";
import { EventType } from "@/models/Event";
import { query } from "@/utils/availabilitiesDB";
import { getAllIds, getEventfromId } from "@/utils/eventsDB";
import { toOid } from "@/utils/utils";

import CopyButton_ from "./copyButton";
import ParticipantList from "./ParticipantList";

export async function generateStaticParams() {
  const eventIds = await getAllIds();
  return eventIds;
}

const Page = async ({ params }: { params: { eventId: string } }) => {
  const eventItem = (await getEventfromId(params.eventId)) as EventType;
  const availabilities = await Promise.all(
    await eventItem.participants.map(async (p) => {
      const q = await query({ event: toOid(params.eventId), user: p });
      return q;
    }),
  );

  const timeslots = availabilities.map((a) => {
    return Set(a[0].timeslots);
  });

  const commonSet = Set.intersect(timeslots);

  const commonArray = Interval.merge(
    Array.from(commonSet).map((t) => {
      return Interval.after(t, Duration.fromObject({ minutes: 30 }));
    }),
  );

  // console.log(JSON.stringify(commonSet))

  const inviteLink: string = `http://localhost:3000/events/${params.eventId}/invite`;

  return (
    <section>
      <MaxProse>
        <TypographyStylesProvider>
          <h1 className="text-center ">Event name: {eventItem?.eventName}</h1>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Pellentesque feugiat laoreet luctus. Curabitur rhoncus augue sem, id
            pulvinar dui tincidunt eu. Fusce at viverra velit, sed pretium
            magna. Nam pulvinar dapibus ipsum, ac dapibus magna facilisis et. In
            ut diam non odio fermentum pulvinar interdum vitae est. Curabitur et
            ante auctor, vehicula quam in, faucibus tortor. Phasellus malesuada
            eros nec est tempor lacinia. In semper nisl eu est pulvinar
            porttitor. Nulla quis augue sed odio dapibus pulvinar. Mauris
            venenatis leo ut sem fringilla interdum.
          </p>
          <Paper bg="var(--mantine-color-blue-light)" p="1rem" shadow="lg">
            <h2 className="text-center">Invite Link</h2>
            <Paper bg="white" className="b-2" p="0.5rem" ta="center">
              {" "}
              {inviteLink}{" "}
            </Paper>
            <CopyButton_ value={inviteLink} />
          </Paper>
        </TypographyStylesProvider>

        <Space h="md" />
        <Paper>
          <ParticipantList event={eventItem as EventType} />
        </Paper>

        {JSON.stringify(commonArray)}
      </MaxProse>
    </section>
  );
};

export default Page;
