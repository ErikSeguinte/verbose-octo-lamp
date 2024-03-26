import { DateTime } from "luxon";
import { ObjectId } from "mongodb";
import { isMongoId } from "validator";
import { z } from "zod";

const transformToArrays = {
  fromArrays: z
    // string[] to ObjectId[]
    .string()
    .refine((s) => isMongoId(s))
    .array(),
  fromSets: z
    .set(z.string().refine((s) => isMongoId(s)))
    .transform((set) => Array.from(set)),
};

export const participantsToArrays = transformToArrays.fromArrays.or(
  transformToArrays.fromSets
);

export type participantsToArrays = z.infer<typeof participantsToArrays>;
export type participantsToArraysInput = z.input<typeof participantsToArrays>;

export const dateToDateTime = z
  .date()
  .transform((dt) => DateTime.fromJSDate(dt).toUTC() as DateTime)
  .or(
    z
      .string()
      .datetime({ offset: true })
      .transform((s) => DateTime.fromISO(s).toUTC() as DateTime)
  )
  .or(
    z
      .custom<DateTime>((dt) => DateTime.isDateTime(dt))
      .transform((dt) => dt.toUTC())
  );
export type dateToDateTime = z.infer<typeof dateToDateTime>;
export type dateToDateTimeInput = z.input<typeof dateToDateTime>;

export const timeslotToDocSchema = z.record(
  dateToDateTime.transform((dt) => dt.toISO() as string),
  participantsToArrays
);

type timeslotToDocSchema = z.infer<typeof timeslotToDocSchema>;
// type timeslotToDocSchemaInput = z.input<typeof timeslotToDocSchema>;

export const recordingGroupToDocSchema = z.object({
  _id: z
    .string()
    .refine((s) => isMongoId(s))
    .transform((s) => new ObjectId(s))
    .or(z.instanceof(ObjectId)),
  groupName: z.string(),
  participants: participantsToArrays,
});

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
  recordingGroups: recordingGroupToDocSchema.array(),
  startDate: dateToDateTime.transform((dt) => dt.toJSDate()),
  timeslots: timeslotToDocSchema,
});

export type EventDoc = z.infer<typeof eventDocSchema>;
export type EventDocInput = z.input<typeof eventDocSchema>;

const transformToSets = {
  fromArrays: z
    .string()
    .refine((s) => isMongoId(s))
    .array()
    .transform((a) => new Set(a)),
  fromSets: z.set(z.string().refine((s) => isMongoId(s))),
};

export const participantsToSets = z.union([
  transformToSets.fromArrays,
  transformToSets.fromSets,
]);

export type participantsToSets = z.infer<typeof participantsToSets>;
export type participantsToSetsInput = z.input<typeof participantsToSets>;

export const timeslotToDTO = z.record(
  dateToDateTime.transform((dt) => dt.toISO() as string),
  participantsToSets
);

export type timeslotToDTO = z.infer<typeof timeslotToDTO>;
// type timeslotToDTOInput = z.input<typeof timeslotToDTO>;

export const recordingGroupToDTOSchema = z.object({
  _id: z
    .string()
    .refine((s) => isMongoId(s))
    .or(z.instanceof(ObjectId).transform((o) => o.toHexString())),
  groupName: z.string(),
  participants: participantsToSets,
});

export const eventDTOSchema = z.object({
  _id: z
    .string()
    .refine((s) => isMongoId(s))
    .or(z.instanceof(ObjectId).transform((o) => o.toHexString())),
  endDate: dateToDateTime.transform((dt) => dt.toISO() as string),
  eventName: z.string(),
  inviteCode: eventDocSchema.shape.inviteCode,
  organizer: z
    .string()
    .refine((s) => isMongoId(s))
    .or(z.instanceof(ObjectId).transform((o) => o.toHexString())),
  participants: participantsToSets,
  recordingGroups: recordingGroupToDTOSchema.array(),
  startDate: dateToDateTime.transform((dt) => dt.toISO() as string),
  timeslots: timeslotToDTO,
});

export type EventDTO = z.infer<typeof eventDTOSchema>;
export type EventDTOInput = z.input<typeof eventDTOSchema>;

export const EventQuerySchema = eventDTOSchema.partial();
export type EventQuery = z.infer<typeof EventQuerySchema>;
export type EventQueryInput = z.input<typeof EventQuerySchema>;

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

export type recordingGroupToDoc = z.infer<typeof recordingGroupToDocSchema>;
export const recordingGroupToDocPartialSchema =
  recordingGroupToDocSchema.partial();
export type recordingGroupToDocPartial = z.infer<
  typeof recordingGroupToDocPartialSchema
>;

export type recordingGroupToDTO = z.infer<typeof recordingGroupToDTOSchema>;
export const recordingGroupToDTOPartialSchema =
  recordingGroupToDTOSchema.partial();
export type recordingGroupToDTOPartial = z.infer<
  typeof recordingGroupToDTOPartialSchema
>;
