"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { formDataToObject } from "@/functions/helpers";
import { EmployeeService } from "@/server/services/Employee";
import { EventService } from "@/server/services/Event";
import { EventAttendeeService } from "@/server/services/EventAttendee";
import { ActionResponse, ANY } from "@/types";
import { AppError } from "@/utils/appError";
import { paths } from "@/utils/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  startDate: z.string().min(1, "Start Date is required"),
  duration: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  participants: z.string().optional(),
});

export async function $createEvent(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return { error: "Unauthorized" };
  }

  // Only company can create events
  if (account.role !== "company") {
    return { error: "Only company accounts can create events" };
  }

  const data = formDataToObject<z.infer<typeof schema>>(formData);
  const result = schema.safeParse(data);

  if (!result.success)
    return {
      error: "Invalid data",
      fieldErrors: result.error.flatten().fieldErrors,
    };

  const {
    title,
    category,
    startDate,
    duration,
    timezone,
    participants: participantIds,
  } = result.data;

  // Create Event
  const eventRes = await EventService.create({
    ...result.data,
    title,
    description: category,
    date: new Date(startDate),
    duration,
    timezone,
    company: account._id,
  });

  if (eventRes instanceof AppError) {
    return { error: eventRes.message };
  }

  const event = eventRes;

  // Add Participants
  if (participantIds) {
    const ids = participantIds.split(",").filter(Boolean);

    if (ids.length > 0) {
      const employeesRes = await EmployeeService.getManyByIds(ids);
      if (!(employeesRes instanceof AppError)) {
        const inviteList = employeesRes
          .map((emp) => ({
            fullname: emp.account?.fullname || emp.dummyName || "Unknown",
            email: emp.account?.email || emp.dummyEmail || "",
            account:
              emp.account?._id ||
              (typeof emp.account === "string" ? emp.account : undefined),
          }))
          .filter((p) => p.email);

        await EventAttendeeService.inviteMany({
          eventId: event._id.toString(),
          people: inviteList as ANY,
        });
      }
    }
  }

  revalidatePath(paths.dashboardEventPlanning);
  return { success: "Event created successfully" };
}
