import { DateTime as LuxDateTime } from "luxon";

export class Event {
  eventName: string;
  startDate: LuxDateTime;
  endDate: LuxDateTime;

  constructor(eventName: string, startDate: LuxDateTime, endDate: LuxDateTime) {
    this.eventName = eventName;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  static fromJsDates(eventName: string, startDate: Date, endDate: Date): Event {
    const startLocal: LuxDateTime =
      LuxDateTime.fromJSDate(startDate).setZone("utc");
    const endLocal: LuxDateTime = LuxDateTime.fromJSDate(endDate).setZone("utc");

    const start = startLocal.plus({ minutes: startLocal.offset });
    const end = endLocal.plus({ minutes: startLocal.offset });
    return new Event(eventName, start, end);
  }

  toString() {
    return `event: ${this.eventName}\n start:${this.startDate}\nend: ${this.endDate}`;
  }
}
