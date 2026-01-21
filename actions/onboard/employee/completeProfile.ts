"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { formDataToObject } from "@/functions/helpers";
import { AccountService } from "@/server/services/Account";
import { connectDB } from "@/server/db/connect";
import Employee from "@/server/models/Employee";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { paths } from "@/utils/paths";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  phone: z.string().min(1, "Phone number is required"),
});

export async function $completeProfile(
  _: ActionResponse,
  formdata: FormData
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (!account || account instanceof AppError) {
    return { error: "Unauthorized" };
  }

  const data = formDataToObject(formdata);
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      error: "Invalid details",
    };
  }

  // Update Account
  const updatedAccount = await AccountService.update(account._id.toString(), {
    fullname: data.fullname as string,
    phone: data.phone as string,
    role: "employee",
    hasOnboarded: true,
  });

  if (updatedAccount instanceof AppError) {
    return { error: updatedAccount.message };
  }

  // Check Employee Status
  await connectDB();
  // Find employees where dummyEmail matches account email
  const employees = await Employee.find({ dummyEmail: updatedAccount.email });

  if (!employees || employees.length === 0) {
    redirect(paths.onboardEmployeeNoTeam);
  }

  const activeEmployee = employees.find((e) => e.status === "active");
  const invitedEmployee = employees.find((e) => e.status === "invited");

  if (activeEmployee) {
    // Link account to active employee if not already linked
    if (!activeEmployee.account) {
      activeEmployee.account = updatedAccount._id;
      await activeEmployee.save();
    }

    // Mark account as onboarded
    await AccountService.update(account._id.toString(), { hasOnboarded: true });
    redirect(paths.dashboard);
  } else if (invitedEmployee) {
    // Redirect to invites page (where they can accept)
    redirect(paths.onboardEmployeeInvites);
  } else {
    // Fallback if status is something else (e.g. inactive)
    redirect(paths.onboardEmployeeNoTeam);
  }

  return { success: "Profile completed" };
}
