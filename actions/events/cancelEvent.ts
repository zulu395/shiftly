"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { EmailService } from "@/server/services/EmailService";
import { EventService } from "@/server/services/Event";
import EventAttendee from "@/server/models/EventAttendee";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";
import { paths } from "@/utils/paths";

export async function $cancelEvent(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const eventId = formData.get("eventId") as string;
  if (!eventId) return { error: "Event ID is required" };

  const account = await $getAccountFromSession();

  // Authorization check: Only company can cancel
  if (account instanceof AppError || !account || account.role !== "company") {
    return { error: "Unauthorized" };
  }

  // 1. Fetch attendees BEFORE cancelling/deleting for email notification
  // Note: EventService.cancel (which we plan to implement) might delete attendees or just update status.
  // Ideally, valid cancellations should probably keep history but for now let's follow the simple requirement:
  // "mark the event as cancelled and email all the attendees".

  // We need to fetch attendees emails first.
  const attendees = await EventAttendee.find({
    event: eventId,
    status: { $ne: "rejected" },
  }).select("email");

  // 2. Build email list
  const emails = attendees.map((a) => a.email);

  // 3. Cancel Event
  const res = await EventService.cancel(eventId);

  if (res instanceof AppError) {
    return { error: res.message };
  }

  const event = res;

  // 4. Send Emails (Fire and forget or wait?)
  // Let's await to be safe, or just fire off.
  // Doing it in loop or batch if supported.
  await Promise.all(
    emails.map((email) =>
      EmailService.eventCancellation({
        to: email,
        eventTitle: event.title,
        eventDate: event.date,
      })({ to: email, subject: `Event Cancelled: ${event.title}` })
    )
  );

  revalidatePath(paths.dashboardEventPlanning);
  return { success: "Event cancelled successfully" };
}
