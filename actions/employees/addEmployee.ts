"use server";

import { EmployeeService } from "@/server/services/Employee";
import { ActionResponse, ANY } from "@/types";
import { AppError } from "@/utils/appError";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const schema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  jobTitle: z.string().optional(),
  companyId: z.string().min(1, "Company ID is required"),
});

export async function $addEmployee(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const data = {
    fullname: formData.get("fullname") as string,
    email: formData.get("email") as string,
    jobTitle: formData.get("jobTitle") as string,
    companyId: formData.get("companyId") as string,
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      error: "Invalid data submitted",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const employee = await EmployeeService.create({
    dummyName: result.data.fullname,
    dummyEmail: result.data.email,
    jobTitle: result.data.jobTitle,
    company: result.data.companyId as ANY,
    status: "invited",
  });

  if (employee instanceof AppError) {
    return {
      error: employee.message,
    };
  }

  revalidatePath("/dashboard/contacts");

  return {
    success: "Employee added successfully",
  };
}
