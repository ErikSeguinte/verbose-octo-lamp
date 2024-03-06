"use server";
import { Paper, Space, TypographyStylesProvider } from "@mantine/core";
import { Set as ImSet } from "immutable";
import React from "react";

import MaxProse from "@/components/MaxProse";
import TimeTable from "@/components/timeTable";
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
    })
  );

  const timeslots = availabilities
    .filter((a) => {
      return a[0] ? true : false;
    })
    .map((a) => {
      return ImSet(a[0].timeslots);
    });

  const commonSet = ImSet.intersect(timeslots);
  const slotsArray = commonSet.toArray().map((dt) => dt.toISO() as string);
  const slots = new Set(slotsArray);
  const invitecode = eventItem.inviteCode;
  const inviteLink: string = `http://localhost:3000/${invitecode}`;

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
              {inviteLink}
            </Paper>
            <CopyButton_ value={inviteLink} />
          </Paper>
        </TypographyStylesProvider>
      </MaxProse>

      <MaxProse>
        <Space h="md" />
        <Paper>
          <ParticipantList event={eventItem as EventType} />
        </Paper>
      </MaxProse>

      <TimeTable
        eventId={params.eventId}
        readonly={true}
        slots={slots}
        usingForm={false}
      />
    </section>
  );
};

export default Page;
