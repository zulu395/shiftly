"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { ShiftIssueService } from "@/server/services/ShiftIssue";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { connectDB } from "@/server/db/connect";
import Employee from "@/server/models/Employee";
import Shift from "@/server/models/Shift";
import { z } from "zod";

const createIssueSchema = z.object({
  shiftId: z.string(),
  reason: z.string(),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export async function $createShiftIssue(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return { error: "Unauthorized" };
  }

  // Only employees can create shift issues
  if (account.role !== "employee") {
    return { error: "Only employees can report shift issues" };
  }

  const rawData = {
    shiftId: formData.get("shiftId"),
    reason: formData.get("reason"),
    description: formData.get("description"),
  };

  const result = createIssueSchema.safeParse(rawData);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  await connectDB();

  // Find employee record
  const employee = await Employee.findOne({
    account: account._id,
    status: { $ne: "deleted" },
  });

  if (!employee) {
    return { error: "Employee record not found" };
  }

  // Verify the shift is assigned to this employee
  const shift = await Shift.findById(result.data.shiftId);
  if (!shift) {
    return { error: "Shift not found" };
  }

  if (shift.employee?.toString() !== employee._id.toString()) {
    return { error: "You can only report issues for shifts assigned to you" };
  }

  const issue = await ShiftIssueService.create({
    shift: shift._id,
    reportedBy: employee._id,
    reason: result.data.reason,
    description: result.data.description,
  });

  if (issue instanceof AppError) {
    return { error: issue.message };
  }

  return { success: "Issue reported successfully" };
}
