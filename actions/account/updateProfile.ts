"use server";

import { AccountService } from "@/server/services/Account";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";
import { paths } from "@/utils/paths";
import { formDataToObject } from "@/functions/helpers";
import { validators } from "@/utils/validators";
import z from "zod";

const schema = z.object({
  fullname: validators.fullname,
  phone: validators.phone.optional().or(z.literal("")),
});

export async function $updateProfile(
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

  const updated = await AccountService.update(
    account._id.toString(),
    result.data
  );
  if (updated instanceof AppError) return { error: updated.message };

  revalidatePath(paths.dashboard);
  return { success: "Profile updated successfully" };
}
