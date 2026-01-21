"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { connectDB } from "@/server/db/connect";
import { IShiftIssue } from "@/server/models/ShiftIssue";
import { EmployeeService } from "@/server/services/Employee";
import { ShiftIssueService } from "@/server/services/ShiftIssue";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";

export async function $getShiftIssues(): Promise<
  ServiceResponse<IShiftIssue[]>
> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  await connectDB();

  // If employee, get their own issues
  if (account.role === "employee") {
    const employeeRes = await EmployeeService.getByAccount(
      account._id.toString(),
    );

    if (employeeRes instanceof AppError) {
      return new AppError("Employee record not found");
    }

    const employee = employeeRes;

    return await ShiftIssueService.getByEmployee(employee._id.toString());
  }

  // If company, get all issues for their company
  const companyId = account._id.toString();

  return await ShiftIssueService.getAll(companyId);
}
