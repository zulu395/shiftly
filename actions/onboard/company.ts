"use server";

import { formDataToObject } from "@/functions/helpers";
import { AccountService } from "@/server/services/Account";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { paths } from "@/utils/paths";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  account: z.string().min(1, "account not found"),
  companyName: z.string().min(1, "Company name is required"),
  companyAddress: z.string().min(1, "Company address is required"),
  companyTotalEmployees: z.string().min(1, "Total employees is required"),
  companyNiche: z.string().min(1, "Industry/Niche is required"),
});

export async function $onboardCompany(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const data = formDataToObject(formData);
  const result = schema.safeParse(data);

  if (!result.success)
    return {
      error: "Please fill in all required fields",
      fieldErrors: result.error.flatten().fieldErrors,
    };

  const updateResponse = await AccountService.update(result.data.account, {
    ...result.data,
    role: "company",
  });

  if (updateResponse instanceof AppError) {
    return {
      error: updateResponse.message,
    };
  }

  redirect(paths.onboardCompanyGoals);

  return {
    success: "Company details saved",
  };
}
