"use server";

import { AccountService } from "@/server/services/Account";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { paths } from "@/utils/paths";
import { redirect } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  account: z.string().min(1, "Account ID is required"),
  goals: z.string().min(1, "At least one goal is required"),
});

export async function $onboardCompanyGoals(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const data = {
    account: formData.get("account") as string,
    goals: formData.get("goals") as string,
  };

  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      error: "Please select at least one goal",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  let goals: string[] = [];
  try {
    goals = JSON.parse(result.data.goals);
    if (!Array.isArray(goals) || goals.length === 0) {
      throw new Error("Invalid goals format");
    }
  } catch {
    return {
      error: "Invalid goals selection",
    };
  }

  const updateResponse = await AccountService.update(result.data.account, {
    companyGoals: goals,
    hasOnboarded: true,
  });

  if (updateResponse instanceof AppError) {
    return {
      error: updateResponse.message,
    };
  }

  redirect(paths.onboardCompanyEmployeeList);

  return {
    success: "Company goals saved",
  };
}
