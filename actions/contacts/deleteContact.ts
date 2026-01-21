"use server";

import { ContactService } from "@/server/services/Contact";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";

export async function $deleteContact(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const id = formData.get("id") as string;

  if (!id) {
    return {
      error: "Contact ID is required",
    };
  }

  const result = await ContactService.delete(id);

  if (result instanceof AppError) {
    return {
      error: result.message,
    };
  }

  revalidatePath("/dashboard/contacts/event-contacts");

  return {
    success: "Contact deleted successfully",
  };
}
