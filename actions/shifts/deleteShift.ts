"use server";

import { ShiftService } from "@/server/services/Shift";
import { ActionResponse } from "@/types";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";

export async function $deleteShift(id: string): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return { error: "Unauthorized" };
  }

  // Employees cannot delete shifts
  if (account.role === "employee") {
    return {
      error: "Employees cannot delete shifts. Please report an issue instead.",
    };
  }

  const result = await ShiftService.remove(id, account._id.toString());
  if (result instanceof AppError) {
    return { error: result.message };
  }

  revalidatePath("/dashboard/staff-scheduling");
  return { success: "Shift deleted successfully" };
}
