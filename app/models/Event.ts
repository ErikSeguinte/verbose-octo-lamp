import { DateTime as LuxDateTime } from "luxon";

export class EventType {
  eventId?: string;
  eventName: string;
  startDate: LuxDateTime;
  endDate: LuxDateTime;

  constructor({
    eventName,
    startDate,
    endDate,
    eventId,
  }: {
    eventName: string;
    startDate: LuxDateTime;
    endDate: LuxDateTime;
    eventId?: string;
  }) {
    this.eventName = eventName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.eventId = eventId;
  }

  get timeSlots(): LuxDateTime[] {
    const extended_start = this.startDate.plus({ days: -1 });
    const extended_end = this.endDate.plus({ days: 1 });
    const timeslots: LuxDateTime[] = [];

    let dt: LuxDateTime = extended_start.plus({ days: 0 });
    while (dt.toMillis() < extended_end.toMillis()) {
      timeslots.push(dt);
      dt = dt.plus({ minutes: 30 });
    }

    return timeslots;
  }

  static fromJsDates(
    eventName: string,
    startDate: Date,
    endDate: Date
  ): EventType {
    const startLocal: LuxDateTime =
      LuxDateTime.fromJSDate(startDate).setZone("utc");
    const endLocal: LuxDateTime =
      LuxDateTime.fromJSDate(endDate).setZone("utc");

    const start = startLocal.plus({ minutes: startLocal.offset });
    const end = endLocal.plus({ minutes: startLocal.offset });
    return new EventType({
      endDate: end,
      eventName,
      startDate: start,
    });
  }

  static fromJson({
    json,
  }: {
    json: {
      eventName: string;
      startDate: LuxDateTime;
      endDate: LuxDateTime;
    };
  }) {
    return new EventType({
      endDate: json.endDate,
      eventName: json.eventName,
      startDate: json.startDate,
    });
  }

  toString() {
    return `event: ${this.eventName}\nstart:${this.startDate}\nend: ${this.endDate}`;
  }

  toJSON() {
    return {
      endDt: this.endDate.toISO(),
      eventId: this.eventId,
      eventName: this.eventName,
      startDt: this.startDate.toISO(),
    };
  }
}

export interface EventInterface {
  eventName: string;
  startDt: string;
  endDt: string;
}

export interface expandedDtInterface {
  year: number;
  month: number;
  hour: number;
  day: number;
  minute: number;
  second: number;
  millisecond: number;
}
