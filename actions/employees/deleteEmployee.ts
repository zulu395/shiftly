"use server";

import { EmployeeService } from "@/server/services/Employee";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";

export async function $deleteEmployee(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const id = formData.get("id") as string;

  if (!id) {
    return {
      error: "Employee ID is required",
    };
  }

  const result = await EmployeeService.delete(id);

  if (result instanceof AppError) {
    return {
      error: result.message,
    };
  }

  revalidatePath("/dashboard/contacts");

  return {
    success: "Employee deleted successfully",
  };
}
