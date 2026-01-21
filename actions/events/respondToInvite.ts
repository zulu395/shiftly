"use server";

import { formDataToObject } from "@/functions/helpers";
import { EventAttendeeService } from "@/server/services/EventAttendee";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { paths } from "@/utils/paths";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  eventId: z.string().min(1, "Event ID is required"),
  email: z.string().email("Invalid email address"),
  response: z.enum(["accepted", "rejected"]),
});

export async function $respondToInvite(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const data = formDataToObject<z.infer<typeof schema>>(formData);
  const result = schema.safeParse(data);

  if (!result.success)
    return {
      error: "Something went wrong",
    };

  const { eventId, email, response } = result.data;

  const res = await EventAttendeeService.updateStatusByEmail(
    eventId,
    email,
    response
  );

  if (res instanceof AppError) {
    return { error: res.message };
  }

  revalidatePath(paths.eventInviteSingle(eventId));
  return { success: `Successfully ${response} invitation` };
}
