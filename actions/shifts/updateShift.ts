"use server";

import { ShiftService } from "@/server/services/Shift";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { $getAccountFromSession } from "../account/account";
import { formDataToObject } from "@/functions/helpers";

const schema = z.object({
  id: z.string().min(1, "Shift ID is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  break: z.string().optional(),
  repeat: z.string().optional(),
  note: z.string().optional(),
  publish: z.enum(["yes", "no"]).default("no"),
});

export async function $updateShift(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return { error: "Unauthorized" };
  }

  // Employees cannot update shifts
  if (account.role === "employee") {
    return {
      error: "Employees cannot edit shifts. Please report an issue instead.",
    };
  }

  const rawData = formDataToObject(formData);

  const result = schema.safeParse(rawData);

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
    return {
      error: "Invalid data submitted",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const updateResult = await ShiftService.update(
    result.data.id,
    account._id.toString(),
    {
      ...result.data,
      date: new Date(result.data.date),
      status: result.data.publish === "yes" ? "assigned" : "unassigned",
    }
  );

  if (updateResult instanceof AppError) {
    return {
      error: updateResult.message,
    };
  }

  revalidatePath("/dashboard/staff-scheduling");

  return {
    success: "Shift updated successfully",
  };
}
