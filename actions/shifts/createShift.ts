"use server";

import { formDataToObject } from "@/functions/helpers";
import { ShiftService } from "@/server/services/Shift";
import { ActionResponse, ANY } from "@/types";
import { AppError } from "@/utils/appError";
import { addDays, isAfter, isSameDay } from "date-fns";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { $getAccountFromSession } from "../account/account";

const schema = z.object({
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  position: z.string().min(1, "Position is required"),
  location: z.string().optional(),
  break: z.string().optional(),
  repeat: z.string().optional(),
  repeatDays: z.string().optional(),
  repeatEnd: z.string().optional(),
  note: z.string().optional(),
  employees: z.array(z.string()).optional(),
  publish: z.enum(["yes", "no"]).default("no"),
});

export async function $createShift(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return { error: "Unauthorized" };
  }

  const data = formDataToObject(formData);
  const rawData = {
    ...data,
    employees: JSON.parse(data.employees || "[]"),
  };

  const result = schema.safeParse(rawData);

  if (!result.success) {
    return {
      error: "Invalid data submitted",
      fieldErrors: result.error.flatten().fieldErrors as ANY,
    };
  }

  const baseDate = new Date(result.data.date);
  const targetDates: Date[] = [baseDate];
  const groupId = result.data.repeat !== "Never" ? uuidv4() : undefined;

  if (result.data.repeat !== "Never" && result.data.repeatEnd) {
    const endDate = new Date(result.data.repeatEnd);
    const repeatDays = result.data.repeatDays
      ? JSON.parse(result.data.repeatDays)
      : [];
    let currentDate = addDays(baseDate, 1);

    while (!isAfter(currentDate, endDate) || isSameDay(currentDate, endDate)) {
      let shouldAdd = false;

      if (result.data.repeat === "Daily") {
        shouldAdd = true;
      } else if (result.data.repeat === "Weekly") {
        if (repeatDays.includes(currentDate.getDay())) {
          shouldAdd = true;
        }
      }

      if (shouldAdd) {
        targetDates.push(new Date(currentDate));
      }

      currentDate = addDays(currentDate, 1);
    }
  }

  try {
    const creationPromises = targetDates.map((date) =>
      ShiftService.create({
        date: date,
        startTime: result.data.startTime,
        endTime: result.data.endTime,
        position: result.data.position,
        location: result.data.location,
        break: result.data.break,
        repeat: result.data.repeat,
        details: result.data.note,
        employees: result.data.employees,
        status: result.data.publish === "yes" ? "assigned" : "unassigned",
        company: account._id as ANY,
        groupId,
      })
    );

    const results = await Promise.all(creationPromises);
    const firstError = results.find((r) => r instanceof AppError);

    if (firstError) {
      throw firstError;
    }

    revalidatePath("/dashboard/staff-scheduling");

    return {
      success: "Shift created successfully",
    };
  } catch {
    return {
      error: "Failed to create shifts",
    };
  }
}
