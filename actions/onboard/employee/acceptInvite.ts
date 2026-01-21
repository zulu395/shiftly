"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { AccountService } from "@/server/services/Account";
import { connectDB } from "@/server/db/connect";
import Employee from "@/server/models/Employee";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { paths } from "@/utils/paths";
import { redirect } from "next/navigation";

export async function $acceptInvite(
  employeeId: string
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (!account || account instanceof AppError) {
    return { error: "Unauthorized" };
  }

  await connectDB();
  const employee = await Employee.findById(employeeId);

  if (!employee) {
    return { error: "Invitation not found" };
  }

  // Security check: verify the invite email matches user
  if (employee.dummyEmail !== account.email) {
    return { error: "This invitation does not belong to your email account" };
  }

  if (employee.status !== "invited") {
    return { error: "Invitation is no longer valid" };
  }

  // Update employee status and link account
  employee.status = "active";
  employee.account = account._id;
  await employee.save();

  // Mark account as onboarded
  await AccountService.update(account._id.toString(), { hasOnboarded: true });

  redirect(paths.dashboard);
}
