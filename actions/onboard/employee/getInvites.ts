"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { connectDB } from "@/server/db/connect";
import Employee from "@/server/models/Employee";
import { ServiceResponse } from "@/types";
import { Invite } from "@/types/onboard";
import { AppError } from "@/utils/appError";

export async function $getInvites(): Promise<ServiceResponse<Invite[]>> {
  const account = await $getAccountFromSession();
  if (!account || account instanceof AppError) {
    return new AppError("Unauthorized");
  }

  await connectDB();
  const invites = await Employee.find({
    dummyEmail: account.email,
    status: "invited",
  })
    .populate("company", "fullname email")
    .lean();

  return JSON.parse(JSON.stringify(invites));
}
