"use server";

import { AccountService } from "@/server/services/Account";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";
import { ActionResponse } from "@/types";
import { z } from "zod";
import { validators } from "@/utils/validators";
import { formDataToObject } from "@/functions/helpers";

const schema = z
  .object({
    oldPassword: validators.password,
    newPassword: validators.password,
    confirmPassword: validators.password,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export async function $changePassword(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) return { error: "Unauthorized" };

  const data = formDataToObject(formData);
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      error: "Invalid details",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const { oldPassword, newPassword } = result.data;

  const actionResult = await AccountService.changePassword(
    account._id.toString(),
    {
      old: oldPassword,
      new: newPassword,
    }
  );

  if (actionResult instanceof AppError) return { error: actionResult.message };

  return { success: "Password changed successfully" };
}
