import {
  Box,
  Button,
  Group,
  Paper,
  Space,
  TextInput,
  TypographyStylesProvider,
} from "@mantine/core";
import { Event } from "@/models/Event";
import { getData as getEventData } from "@/app/api/events/[eventId]/route";
import { notFound } from "next/navigation";
import React from "react";

const events: Set<string> = new Set([
  "dummyevent",
  "anotherdummy",
  "ukdummyevent"
])

const isValid = (eventId: string): boolean => {
  return events.has(eventId)
}

const page = async ({ params }: { params: { eventId: string } }) => {

  if (!isValid(params.eventId)) {
    notFound()
  }


  const newEvent: Event = await getEventData(params.eventId)
    .then((response) => response.json())
    .then((json) => Event.fromJson({ json }));

  const inviteLink: string = `http://localhost:3000/events/dummyevent/invite`

  return (
    <section>
      <TypographyStylesProvider>
        <h1 className="text-center ">{newEvent.eventName}</h1>

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
        <Paper bg="var(--mantine-color-blue-light)" shadow="lg">
          <h2 className="text-center pt-2">Invite Link</h2>
          <TextInput pb="2rem" px="1rem" value={inviteLink}/>
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

export default page;
