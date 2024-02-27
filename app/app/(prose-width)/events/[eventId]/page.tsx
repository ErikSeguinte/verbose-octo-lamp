"use server";
import {
  Box,
  Button,
  Group,
  Paper,
  Space,
  TypographyStylesProvider,
} from "@mantine/core";
import React from "react";

import { getEventData } from "@/utils/database";

import CopyButton_ from "./copyButton";

const Page = async ({ params }: { params: { eventId: string } }) => {
  const eventItem = await getEventData(params.eventId);

  const inviteLink: string = `http://localhost:3000/events/${params.eventId}/invite`;

  return (
    <section>
      <TypographyStylesProvider>
        <h1 className="text-center ">Event name: {eventItem.eventName}</h1>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          feugiat laoreet luctus. Curabitur rhoncus augue sem, id pulvinar dui
          tincidunt eu. Fusce at viverra velit, sed pretium magna. Nam pulvinar
          dapibus ipsum, ac dapibus magna facilisis et. In ut diam non odio
          fermentum pulvinar interdum vitae est. Curabitur et ante auctor,
          vehicula quam in, faucibus tortor. Phasellus malesuada eros nec est
          tempor lacinia. In semper nisl eu est pulvinar porttitor. Nulla quis
          augue sed odio dapibus pulvinar. Mauris venenatis leo ut sem fringilla
          interdum.
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
      <Box bg="var(--mantine-color-blue-light)" maw={500} mx="auto" p="md">
        <Group>
          <Button mx="auto">Button 1</Button>
          <Button mx="auto">Button 2</Button>
        </Group>
      </Box>
    </section>
  );
};

export default Page;
