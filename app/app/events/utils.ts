export const sortMethod = {
  "Event Name": "Event Name",
  "Start Date": "Start Date",
} as const;

export type sortMethodKeys = keyof typeof sortMethod;
export type sortMethodValues =
  | (typeof sortMethod)["Start Date"]
  | (typeof sortMethod)["Event Name"];
