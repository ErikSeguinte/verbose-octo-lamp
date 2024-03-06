import { Set as ImSet } from "immutable";
import { DateTime, DateTime as LuxDateTime, Interval } from "luxon";

import { query } from "@/utils/availabilitiesDB";
import { toOid } from "@/utils/utils";

import { oid } from "./common";

export class EventType {
  eventName: string;
  startDate: LuxDateTime;
  endDate: LuxDateTime;
  id: oid = { $oid: "" };
  organizer: oid = { $oid: "" };
  participants: Array<oid> = [];
  inviteCode: string;

  constructor({
    eventName,
    startDate,
    endDate,
    eventId,
    id = { $oid: "" },
    organizer = { $oid: "" },
    participants = [],
    inviteCode = "",
  }: {
    eventName: string;
    startDate: LuxDateTime;
    endDate: LuxDateTime;
    eventId?: string;
    id?: oid;
    organizer?: oid;
    participants?: Array<oid>;
    inviteCode?: string;
  }) {
    this.eventName = eventName;
    this.startDate = startDate;
    this.endDate = endDate;
    this.organizer = organizer;
    this.participants = participants;
    this.inviteCode = inviteCode;
    if (!id["$oid"]) {
      this.id = toOid(eventId);
    } else {
      this.id = id;
    }
  }

  set eventId(id: string) {
    this.id = { $oid: id };
  }

  get eventId(): string | undefined {
    const id = this.id["$oid"];
    return id ? id : undefined;
  }

  async asyncGetAsyncTimeslots({
    hour,
    min,
  }: {
    hour: number;
    min: number;
  }): Promise<DateTime[]> {
    const interval = Interval.fromDateTimes(
      this.startDate,
      this.endDate.plus({ day: 1 })
    );

    let dt = this.startDate.plus({ days: 0, hour: hour, minutes: min });

    const row: DateTime[] = [];
    while (interval.contains(dt)) {
      row.push(dt);
      dt = dt.plus({ day: 1 });
    }
    return new Promise<DateTime[]>((resolve) => resolve(row));
  }

  get dateStrings(): [string, string] {
    return [
      this.startDate.toISODate() as string,
      this.endDate.toISODate() as string,
    ] as const;
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
    eventName,
    id,
    startDate,
    endDate,
    organizer,
    participants,
    inviteCode,
  }: {
    eventName: string;
    startDate: string;
    endDate: string;
    id: oid;
    organizer: oid;
    participants: oid[];
    inviteCode: string;
  }) {
    return new EventType({
      endDate: this.stringToLuxDate(endDate),
      eventName: eventName,
      id: id,
      inviteCode: inviteCode,
      organizer: organizer,
      participants: participants,
      startDate: this.stringToLuxDate(startDate),
    });
  }

  static stringToLuxDate(s: string) {
    return LuxDateTime.fromISO(s, { zone: "utc" });
  }

  toString() {
    return `event: ${this.eventName}\nstart:${this.startDate}\nend: ${this.endDate}`;
  }

  toJSON() {
    return {
      endDt: this.endDate.toISO({}),
      eventId: this.eventId,
      eventName: this.eventName,
      startDt: this.startDate.toISO(),
    };
  }

  async getSharedAvailability(participants?: oid[]): Promise<Set<string>> {
    if (!participants) {
      participants = this.participants;
    }
    const availabilities = await Promise.all(
      await participants.map(async (p) => {
        const q = await query(p, this.id);
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
    return slots;
  }

  async getOneOffAvailabilities(): Promise<Array<readonly [oid, Set<string>]>> {
    if (this.participants.length < 3) {
      return [];
    }
    type slotsType = Set<string>;
    type slotsPromise = Promise<slotsType>;

    const promises: slotsPromise[] = [];
    const removedParticipant: oid[] = [];
    for (const p of this.participants) {
      const oneOffParticipants = this.participants.filter(
        (removed) => !removed
      );
      promises.push(this.getSharedAvailability(oneOffParticipants));
      removedParticipant.push(p);
    }
    const shared = await Promise.all(promises);

    const oneOffs: Array<readonly [oid, slotsType]> = [];

    for (let i = 0; i < removedParticipant.length; i = i + 1) {
      const item = [removedParticipant[i], shared[i]] as const;
      oneOffs.push(item);
    }

    return oneOffs;
  }
}
