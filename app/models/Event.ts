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
    const start: LuxDateTime = LuxDateTime.fromJSDate(startDate);
    const end: LuxDateTime = LuxDateTime.fromJSDate(endDate);
    return new Event(eventName, start, end);
  }

  toString() {
    return `event: ${this.eventName}\n start:${this.startDate}\nend: ${this.endDate}`;
  }
}
