"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { AppError } from "@/utils/appError";
import { EmployeeService } from "@/server/services/Employee";
import { ServiceResponse } from "@/types";
import { PopulatedEmployee } from "@/types/employee";

export async function $getAllEmployees(): Promise<
  ServiceResponse<PopulatedEmployee[]>
> {
  const account = await $getAccountFromSession();
  if (!account || account instanceof AppError) {
    return new AppError("Unauthorized");
  }

  let companyId = account._id.toString();

  if (account.role === "employee") {
    const { connectDB } = await import("@/server/db/connect");
    const Employee = (await import("@/server/models/Employee")).default;
    const { cookies } = await import("next/headers");
    const { cookieKeys } = await import("@/utils/cookies");

    const cookieStore = await cookies();
    const storedCompanyId = cookieStore.get(cookieKeys.companyId)?.value;

    await connectDB();
    let companyToUse = storedCompanyId;

    if (storedCompanyId) {
      const employment = await Employee.findOne({
        account: account._id,
        company: storedCompanyId,
        status: { $ne: "deleted" },
      });
      if (!employment) {
        cookieStore.delete(cookieKeys.companyId);
        companyToUse = undefined;
      }
    }

    if (!companyToUse) {
      const employee = await Employee.findOne({
        account: account._id,
        status: { $ne: "deleted" },
      });
      if (!employee) {
        return [];
      }
      companyToUse = employee.company.toString();
    }
    companyId = companyToUse!;
  }

  return (await EmployeeService.getAll(companyId)) as ServiceResponse<
    PopulatedEmployee[]
  >;
}
