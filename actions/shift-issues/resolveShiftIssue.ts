"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { ShiftIssueService } from "@/server/services/ShiftIssue";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";

export async function $resolveShiftIssue(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const issueId = formData.get("issueId") as string;
  if (!issueId) return { error: "Issue ID is required" };
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return { error: "Unauthorized" };
  }

  // Only company accounts can resolve issues
  if (account.role !== "company") {
    return { error: "Only company accounts can resolve issues" };
  }

  const result = await ShiftIssueService.markResolved(
    issueId,
    account._id.toString()
  );

  if (result instanceof AppError) {
    return { error: result.message };
  }

  return { success: "Issue resolved successfully" };
}
