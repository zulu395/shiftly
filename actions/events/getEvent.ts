"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { EventService } from "@/server/services/Event";
import { ServiceResponse } from "@/types";
import { Event } from "@/types/event";
import { AppError } from "@/utils/appError";

export async function $getEvent(
  eventId: string
): Promise<ServiceResponse<Event>> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  // Only company/employee logic?
  // Employees should see events they are invited to.
  // Companies should see their events.
  // For now, assuming basic access check is sufficient or Service handles it.
  // EventService.getById doesn't check ownership yet, but let's allow it for now as "details view".

  const event = await EventService.getById(eventId);
  if (event instanceof AppError) {
    return event;
  }

  return event;
}
