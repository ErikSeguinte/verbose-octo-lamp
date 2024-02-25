import { DateTime } from "luxon";
import { Event as EventModel } from "@/models/Event";

export async function getData(
 eventId: string 
): Promise<Response> {
  const now = DateTime.now();
  const today = DateTime.fromObject({
    year: now.year,
    month: now.month,
    day: now.day,
  });
  const start = today.plus({ minutes: today.offset }).plus({ days: 1 });
  const end = start.plus({ days: 7 });
  const newEvent = new EventModel(eventId, start, end);
  console.log(eventId)
  const res = Response.json(newEvent);
  return res;
}



export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
): Promise<Response> {
  const eventId = params.eventId;
  return getData(eventId);
}
