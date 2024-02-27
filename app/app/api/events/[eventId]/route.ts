import { NextResponse } from "next/server";

import { EventType } from "@/models/Event";
import { getEventData } from "@/utils/database";

export async function getData(eventId: string): Promise<Response> {
  const eventItem: EventType = await getEventData(eventId);
  const res = NextResponse.json(eventItem);
  return res;
}

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
): Promise<Response> {
  const eventId = params.eventId;
  return await getData(eventId);
}
