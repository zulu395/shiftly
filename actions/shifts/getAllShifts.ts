"use server";

import { ShiftService } from "@/server/services/Shift";
import { ServiceResponse } from "@/types";
import { IShift } from "@/server/models/Shift";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";

export async function $getAllShifts(): Promise<ServiceResponse<IShift[]>> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  return await ShiftService.getAll(account._id.toString());
}
