"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { connectDB } from "@/server/db/connect";
import Employee from "@/server/models/Employee";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { IEmployee } from "@/server/models/Employee";

export async function $getEmployments(): Promise<ServiceResponse<IEmployee[]>> {
  const account = await $getAccountFromSession();
  if (!account || account instanceof AppError) {
    return new AppError("Unauthorized");
  }

  await connectDB();
  const employments = await Employee.find({
    account: account._id,
    status: { $ne: "deleted" },
  })
    .populate("company", "fullname companyName avatar")
    .lean();

  return JSON.parse(JSON.stringify(employments));
}
