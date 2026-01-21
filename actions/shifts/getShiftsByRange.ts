"use server";

import { ShiftService } from "@/server/services/Shift";
import { ServiceResponse } from "@/types";
import { IShift } from "@/server/models/Shift";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";
import { connectDB } from "@/server/db/connect";
import Employee from "@/server/models/Employee";

export async function $getShiftsByRange(
  startDate: string,
  endDate: string,
  filters?: {
    employeeIds?: string[];
    positions?: string[];
    status?: "published" | "not-published";
  }
): Promise<ServiceResponse<IShift[]>> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  let companyId = account._id.toString();

  if (account.role === "employee") {
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
        return new AppError("No employment record found");
      }
      companyToUse = employee.company.toString();
    }
    companyId = companyToUse!;
  }

  return await ShiftService.getByRange(
    companyId,
    new Date(startDate),
    new Date(endDate),
    filters
  );
}
