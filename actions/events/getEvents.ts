"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { EventService } from "@/server/services/Event";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { Event } from "@/types/event";

export async function $getEvents(): Promise<ServiceResponse<Event[]>> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  // If company, get all events
  if (account.role === "company") {
    return (await EventService.getAll(account._id.toString())) as Event[];
  }

  // If employee, we need to find events they are invited to.
  if (account.role === "employee") {
    return (await EventService.getForEmployee(account.email)) as Event[];
  }

  return [];
}
