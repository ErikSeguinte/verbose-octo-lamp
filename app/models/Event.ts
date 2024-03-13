import { Set as ImSet } from "immutable";
import { DateTime, Interval } from "luxon";
import { ObjectId } from "mongodb";
import { isMongoId } from "validator";
import { z } from "zod";

import { query } from "@/utils/availabilitiesDB";
import { toOid } from "@/utils/utils";

import { oid } from "./common";

export class EventType {
  eventName: string;
  startDate: DateTime;
  endDate: DateTime;
  id: oid = { $oid: "" };
  organizer: oid = { $oid: "" };
  participants: Array<oid> = [];
  inviteCode: string;
  timeSlots: timeSlots;

  constructor({
    eventName,
    startDate,
    endDate,
    eventId,
    id = { $oid: "" },
    organizer = { $oid: "" },
    participants = [],
    inviteCode = "",
    timeSlots = new Map<string, participants>(),
  }: {
    eventName: string;
    startDate: DateTime;
    endDate: DateTime;
    eventId?: string;
    id?: oid;
    organizer?: oid;
    participants?: Array<oid>;
    inviteCode?: string;
    timeSlots?: timeSlots;
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
    this.timeSlots = timeSlots;
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
      this.endDate.plus({ day: 1 }),
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
    endDate: Date,
  ): EventType {
    const startLocal: DateTime = DateTime.fromJSDate(startDate).setZone("utc");
    const endLocal: DateTime = DateTime.fromJSDate(endDate).setZone("utc");

    const start = startLocal.plus({ minutes: startLocal.offset });
    const end = endLocal.plus({ minutes: startLocal.offset });
    return new EventType({
      endDate: end,
      eventName,
      startDate: start,
    });
  }

  static fromJson(eventsJson: eventsJson) {
    return new EventType({
      endDate: eventsJson.endDate,
      eventName: eventsJson.eventName,
      id: eventsJson.id,
      inviteCode: eventsJson.inviteCode,
      organizer: eventsJson.organizer,
      participants: eventsJson.participants,
      startDate: eventsJson.startDate,
      timeSlots: eventsJson.timeSlots,
    });
  }

  static stringToLuxDate(s: string) {
    return DateTime.fromISO(s, { zone: "utc" });
  }

  toString() {
    return `event: ${this.eventName}\nstart:${this.startDate}\nend: ${this.endDate}`;
  }

  static replacer(_key: any, value: any) {
    if (value instanceof Map) {
      return {
        dataType: "Map",
        value: [...value].filter((v) => v[1].size > 0),
      };
    } else if (value instanceof Set) {
      return { dataType: "Set", value: [...value] };
    } else {
      return value;
    }
  }

  static reviver(key: any, value: any) {
    if (typeof value === "object" && value !== null) {
      if (value.dataType === "Map") {
        return new Map(value.value);
      } else if (value.dataType === "Set") {
        return new Set(value.value);
      }
    }
    if (key == "startDate" || key == "endDate") {
      const dt = DateTime.fromISO(value);
      return dt;
    }
    return value;
  }

  async getSharedAvailability(participants?: oid[]): Promise<Set<string>> {
    if (!participants) {
      participants = this.participants;
    }
    const availabilities = await Promise.all(
      await participants.map(async (p) => {
        const q = await query(p, this.id);
        return q;
      }),
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
        (removed) => !removed,
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

  initializeTimeslots() {
    const timeSlots = new Map<ISOstring, participants>();
    const interval = Interval.fromDateTimes(
      this.startDate,
      this.endDate.plus({ day: 1 }),
    );

    let dt = this.startDate.plus({ days: 0 });
    while (interval.contains(dt)) {
      timeSlots.set(dt.toISO() as string, new Set<string>());
      dt = dt.plus({ minute: 30 });
    }

    return timeSlots;
  }
}

export type participants = Set<string>;
type ISOstring = string;

export type timeSlots = Map<ISOstring, participants>;

export type eventsJson = {
  id: { $oid: string };
  startDate: DateTime;
  endDate: DateTime;
  eventName: string;
  organizer: oid;
  participants: oid[];
  inviteCode: string;
  timeSlots: timeSlots;
};

const transformToArrays = {
  fromArrays: z
    // string[] to ObjectId[]
    .string()
    .refine((s) => isMongoId(s))
    .transform((s) => new ObjectId(s))
    .array()
    // ObjectId[]
    .or(z.instanceof(ObjectId).array()),
  fromSets: z
    // Set<ObjectId>
    .set(z.instanceof(ObjectId))
    // Set<String> to Set<ObjectId>
    .or(
      z
        .set(z.string().refine((s) => isMongoId(s)))
        .transform(
          (set) => new Set(Array.from(set).map((str) => new ObjectId(str))),
        ),
    )
    .transform((set) => Array.from(set)),
};

export const participantsToArrays = transformToArrays.fromArrays.or(
  transformToArrays.fromSets,
);
export type participantsToArrays = z.infer<typeof participantsToArrays>;
export type participantsToArraysInput = z.input<typeof participantsToArrays>;

export const dateToDateTime = z
  .date()
  .transform((dt) => DateTime.fromJSDate(dt) as DateTime)
  .or(
    z
      .string()
      .datetime({ offset: true })
      .transform((s) => DateTime.fromISO(s) as DateTime),
  )
  .or(z.custom<DateTime>((dt) => DateTime.isDateTime(dt)));
export type dateToDateTime = z.infer<typeof dateToDateTime>;
export type dateToDateTimeInput = z.input<typeof dateToDateTime>;

export const eventDocSchema = z.object({
  _id: z
    .string()
    .refine((s) => isMongoId(s))
    .transform((s) => new ObjectId(s))
    .or(z.instanceof(ObjectId)),
  endDate: dateToDateTime.transform((dt) => dt.toJSDate()),
  eventName: z.string().trim().min(2),
  inviteCode: z.string().ulid(),
  organizer: z
    .string()
    .refine((s) => isMongoId(s))
    .transform((s) => new ObjectId(s))
    .or(z.instanceof(ObjectId)),
  participants: participantsToArrays,
  startDate: dateToDateTime.transform((dt) => dt.toJSDate()),
});

export type EventDoc = z.infer<typeof eventDocSchema>;
export type EventDocInput = z.input<typeof eventDocSchema>;

const transformToSets = {
  fromArrays: z
    .string()
    .refine((s) => isMongoId(s))
    .array()
    .or(
      z
        .instanceof(ObjectId)
        .array()
        .transform((a) => a.map((o) => o.toHexString())),
    )
    .transform((a) => new Set(a)),
  fromSets: z.set(z.string().refine((s) => isMongoId(s))).or(
    z.set(z.instanceof(ObjectId)).transform((o) => {
      const arr = Array.from(o).map((o) => o.toHexString());
      return new Set<string>(arr);
    }),
  ),
};

export const participantsToSets = transformToSets.fromArrays.or(
  transformToSets.fromSets,
);
export type participantsToSets = z.infer<typeof participantsToSets>;
export type participantsToSetsInput = z.input<typeof participantsToSets>;

export const eventDTOSchema = z.object({
  _id: z
    .string()
    .refine((s) => isMongoId(s))
    .or(z.instanceof(ObjectId).transform((o) => o.toHexString())),
  endDate: dateToDateTime.transform((dt) => dt.toISO()),
  eventName: z.string(),
  inviteCode: eventDocSchema.shape.inviteCode,
  organizer: z
    .string()
    .refine((s) => isMongoId(s))
    .or(z.instanceof(ObjectId).transform((o) => o.toHexString())),
  participants: participantsToSets,
  startDate: dateToDateTime.transform((dt) => dt.toISO()),
});

export type EventDTO = z.infer<typeof eventDTOSchema>;
export type EventDTOInput = z.input<typeof eventDTOSchema>;

export const EventQuerySchema = eventDTOSchema.partial();
export type EventQuery = z.infer<typeof EventQuerySchema>;

export const eventDocCreateSchema = eventDocSchema.omit({
  _id: true,
  inviteCode: true,
  participants: true,
});
export type EventDocCreate = z.input<typeof eventDocCreateSchema>;

export const eventSortType = {
  // eslint-disable-next-line sort-keys/sort-keys-fix
  startDate: { startDate: 1, eventName: 1, eventDate: 1 },
  // eslint-disable-next-line sort-keys/sort-keys-fix
  name: { eventName: 1, startDate: 1, endDate: 1 },
} as const;

export type eventSortType = (typeof eventSortType)[keyof typeof eventSortType];
