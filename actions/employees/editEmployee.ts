"use server";

import { EmployeeService } from "@/server/services/Employee";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  id: z.string().min(1, "Employee ID is required"),
  jobTitle: z.string().optional(),
});

export async function $editEmployee(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const data = {
    id: formData.get("id") as string,
    jobTitle: formData.get("jobTitle") as string,
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      error: "Invalid data submitted",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const employee = await EmployeeService.update(result.data.id, {
    jobTitle: result.data.jobTitle,
  });

  if (employee instanceof AppError) {
    return {
      error: employee.message,
    };
  }

  revalidatePath("/dashboard/contacts");

  return {
    success: "Employee updated successfully",
  };
}
