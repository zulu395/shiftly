"use server";

import { ContactService } from "@/server/services/Contact";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string().min(1, "Contact ID is required"),
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  jobTitle: z.string().optional(),
  company: z.string().optional(),
  linkedin: z.string().optional(),
  timezone: z.string().optional(),
});

export async function $editContact(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const data = {
    id: formData.get("id") as string,
    fullname: formData.get("fullname") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    jobTitle: formData.get("jobTitle") as string,
    company: formData.get("company") as string,
    linkedin: formData.get("linkedin") as string,
    timezone: formData.get("timezone") as string,
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      error: "Invalid data submitted",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { id, ...updateData } = result.data;
  const contact = await ContactService.update(id, updateData);

  if (contact instanceof AppError) {
    return {
      error: contact.message,
    };
  }

  revalidatePath("/dashboard/contacts/event-contacts");

  return {
    success: "Contact updated successfully",
  };
}
