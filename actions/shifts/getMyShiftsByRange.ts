"use server";

import { ShiftService } from "@/server/services/Shift";
import { ServiceResponse } from "@/types";
import { IShift } from "@/server/models/Shift";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";
import { connectDB } from "@/server/db/connect";
import Employee from "@/server/models/Employee";

export async function $getMyShiftsByRange(
  startDate: string,
  endDate: string
): Promise<ServiceResponse<IShift[]>> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  await connectDB();

  const employee = await Employee.findOne({
    account: account._id,
    status: { $ne: "deleted" },
  });

  if (!employee) {
    return new AppError("No employee record found");
  }

  return await ShiftService.getByEmployeeAndRange(
    employee._id.toString(),
    new Date(startDate),
    new Date(endDate)
  );
}
