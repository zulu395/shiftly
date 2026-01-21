"use server";

import { AccountService } from "@/server/services/Account";
import { EmployeeService } from "@/server/services/Employee";
import { SecurityService } from "@/server/services/Security";
import { ActionResponse, ANY } from "@/types";
import { MappedUserData } from "@/types/csv";
import { AppError } from "@/utils/appError";
import { cookieKeys } from "@/utils/cookies";
import { paths } from "@/utils/paths";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  company: z.string().min(1, "Company ID is required"),
  employees: z.string().optional(),
});

export async function $onboardCompanyTeam(
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

  // 1. Create employees if any
  if (result.data.employees && result.data.employees !== "null") {
    let employees: MappedUserData[] = [];
    try {
      employees = JSON.parse(result.data.employees);
    } catch {
      // If parsing fails, just ignore employees adding
    }

    if (Array.isArray(employees) && employees.length > 0) {
      const employeeDocs = employees.map((emp) => ({
        company: result.data.company,
        dummyName: emp.fullname,
        dummyEmail: emp.email,
        status: "invited",
      }));

      await EmployeeService.createMany(employeeDocs as ANY);
    }
  }

  // 2. Mark account as onboarded
  const account = await AccountService.update(result.data.company, {
    hasOnboarded: true,
  });

  if (account instanceof AppError) {
    return {
      error: account.message,
    };
  }

  // 3. Refresh session cookie with new account data (hasOnboarded: true)
  // This is important because middleware or other checks might rely on the token payload
  (await cookies()).set(
    cookieKeys.account,
    await SecurityService.generateToken(account)
  );

  redirect(paths.dashboard, RedirectType.replace);

  return {
    success: "Onboarding complete",
  };
}
