"use server";

import { fromZodError, ZodError} from "zod-validation-error"

import { UserCreate, userCreateSchema,  } from "@/models/Users";
import { createUser } from "@/utils/usersDB";

export const handleSubmit = async (user: UserCreate, event: string) => {
  try{
  const u = userCreateSchema.parse(user)
  } catch (err) {
    const validationError = fromZodError(err as ZodError)
    return validationError.toString()
  }
  const savedUser = await createUser(user)
  return savedUser
};
