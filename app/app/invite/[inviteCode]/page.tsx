import { Title } from "@mantine/core";
import { notFound } from "next/navigation";
import React from "react";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// import TimeTable from "@/components/timeTable";
import { eventDocSchema, eventDTOSchema, EventQuery } from "@/models/Event";
import { findAllEvents, findOneEvent } from "@/utils/eventsDB";

type Props = {
  params: { inviteCode: string };
};

export async function generateMetadata({ params }: Props) {
  let query = {};
  try {
    query = eventDTOSchema.partial().parse({ inviteCode: params.inviteCode });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      console.error(validationError.toString());
      notFound();
    }
    ``;
  } finally {
    const result = await findOneEvent({ query });
    if (!result) {
      console.error(`page ${(query as EventQuery).inviteCode} not found`);
      notFound();
    }
    const eventItem = eventDocSchema.safeParse(result);
    if (eventItem.success) {
      return {
        title: `Verbose Octolamp - ${eventItem.data.eventName} invitation form`,
      };
    }

    return { title: "verbose Octolamp" };
  }
}

export async function generateStaticParams() {
  const events = await findAllEvents();
  return events ? events.map((e) => e.inviteCode) : [];
}

const Page = async ({ params }: { params: { inviteCode: string } }) => {
  let query = {};
  try {
    query = eventDTOSchema.partial().parse({ inviteCode: params.inviteCode });
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      console.error(validationError.toString());
      notFound();
    }
  }
  const eventItem = await findOneEvent({ query });
  if (!eventItem) {
    notFound();
  }

  return (
    <>
      <Title order={1}>{eventItem.eventName}</Title>
      page
      {/* <TimeTable
        eventId={eventItem.id.$oid as string}
        readonly={false}
        usingForm={true}
      /> */}
    </>
  );
};

export default Page;
