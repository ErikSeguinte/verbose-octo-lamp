"use server";
// import { UserType } from "@/models/Users";
// import { saveUser } from "@/utils/usersDB";

interface submission {
  email: string;
  name: string;
  discord: string;
  timeslots: string[];
}

export async function submitToServer(s: submission) {}
