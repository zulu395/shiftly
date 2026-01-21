"use server";

import Account from "@/server/models/Account";
import { EventAttendeeService } from "@/server/services/EventAttendee";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  emails: z
    .array(z.string().email("Invalid email address"))
    .min(1, "At least one email is required"),
});

export async function $inviteAttendees(inputs: {
  eventId: string;
  emails: string[];
}): Promise<ActionResponse> {
  // We don't use formData here because the inputs are complex (array usually passed as JSON or multiple fields).
  // The caller will pass an object directly.

  const result = schema.safeParse(inputs);

  if (!result.success)
    return {
      error: "Invalid input",
      fieldErrors: result.error.flatten().fieldErrors,
    };

  const { eventId, emails } = result.data;

  // Find accounts for these emails to get names
  const accounts = await Account.find({ email: { $in: emails } }).select(
    "fullname email _id",
  );

  const people = emails.map((email) => {
    const account = accounts.find((a) => a.email === email);
    return {
      email,
      fullname: account?.fullname || email.split("@")[0], // Default name if not found
      account: account?._id.toString(),
    };
  });

  const res = await EventAttendeeService.inviteMany({
    eventId,
    people,
  });

  if (res instanceof AppError) {
    return { error: res.message };
  }

  revalidatePath(`/event/${eventId}`); // Revalidate event details page if we have one
  return { success: `Successfully invited ${emails.length} participants` };
}
