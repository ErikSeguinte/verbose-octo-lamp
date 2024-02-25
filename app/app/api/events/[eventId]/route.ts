import { EventType } from "@/models/Event";
import { getEventData } from "@/utils/database";

export async function getData(eventId: string): Promise<Response> {
  const eventItem: EventType = getEventData(eventId);
  const res = Response.json(eventItem);
  console.log(`getting event ${eventId}`);
  return res;
}

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
): Promise<Response> {
  const eventId = params.eventId;
  return getData(eventId);
}
