"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { connectDB } from "@/server/db/connect";
import Employee from "@/server/models/Employee";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { cookieKeys } from "@/utils/cookies";
import { cookies } from "next/headers";

export async function $switchCompany(
  companyId: string
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (!account || account instanceof AppError) {
    return { error: "Unauthorized" };
  }

  await connectDB();
  // Verify user is an employee of this company
  const employment = await Employee.findOne({
    account: account._id,
    company: companyId,
    status: { $ne: "deleted" },
  });

  if (!employment) {
    return { error: "Invalid company selection" };
  }

  (await cookies()).set(cookieKeys.companyId, companyId, {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return { success: "Company switched" };
}
