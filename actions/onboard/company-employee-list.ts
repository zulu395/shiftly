"use server";

import { EmployeeService } from "@/server/services/Employee";
import { ActionResponse } from "@/types";
import { MappedUserData } from "@/types/csv";
import { paths } from "@/utils/paths";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  company: z.string().min(1, "Company ID is required"),
  employees: z.string().min(1, "Employee data is required"),
});

export async function $onboardCompanyEmployeeList(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const data = {
    company: formData.get("company") as string,
    employees: formData.get("employees") as string,
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      error: "Invalid data submitted",
    };
  }

  let employees: MappedUserData[] = [];
  try {
    employees = JSON.parse(result.data.employees);
    if (!Array.isArray(employees)) {
      throw new Error("Invalid format");
    }
  } catch {
    return {
      error: "Invalid employee data format",
    };
  }

  if (employees.length === 0) {
    // If no employees, just skip
    redirect(paths.onboardCompanyTeam, RedirectType.replace);
  }

  // Transform to IEmployee shape
  const employeeDocs = employees.map((emp) => ({
    company: result.data.company,
    dummyName: emp.fullname,
    dummyEmail: emp.email,
    status: "invited",
  }));

  // @ts-expect-error - IDs are handled by mongoose
  await EmployeeService.createMany(employeeDocs);

  redirect(paths.onboardCompanyTeam, RedirectType.replace);

  return {
    success: "Employees imported",
  };
}
