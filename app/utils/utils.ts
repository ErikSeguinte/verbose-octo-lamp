import { ZodError, ZodTypeAny } from "zod";
import { fromZodError } from "zod-validation-error";

export const toOid = (id: string = "") => {
  return { $oid: id };
};

export const tryParse = <T, input = unknown>(
  value: input,
  schema: ZodTypeAny,
): T => {
  let v: T | null = null;
  try {
    v = schema.parse(value);
  } catch (err) {
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      console.error(
        `Error parsing ${JSON.stringify(value, null, 2)}. ${validationError.toString()}`,
      );
    } else {
      throw err;
    }
  }
  if (!v) {
    throw new Error(`error parsing: ${JSON.stringify(value, null, 2)}, ${v}`);
  }
  return v;
};
