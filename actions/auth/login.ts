"use server";

import { formDataToObject } from "@/functions/helpers";
import { AccountService } from "@/server/services/Account";
import { SecurityService } from "@/server/services/Security";
import { ActionResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { cookieKeys } from "@/utils/cookies";
import { paths } from "@/utils/paths";
import { validators } from "@/utils/validators";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { z } from "zod";

const schema = z.object({
  email: validators.email,
  password: validators.password,
});

export async function $login(
  _: ActionResponse,
  formdata: FormData
): Promise<ActionResponse> {
  const data = formDataToObject(formdata);

  const result = schema.safeParse(data);

  if (!result.success)
    return {
      error: "Invalid login details",
    };

  const response = await AccountService.login(data);

  if (response instanceof AppError)
    return {
      error: response.message,
    };

  // Redirect to dashboard if onboarded, else onboard
  // Assuming response (account) has hasOnboarded field
  const account = response;
  (await cookies()).set(
    cookieKeys.account,
    await SecurityService.generateToken(account)
  );

  if (account.role === "employee") {
    const { connectDB } = await import("@/server/db/connect");
    const Employee = (await import("@/server/models/Employee")).default;
    await connectDB();

    const employment = await Employee.findOne({
      account: account._id,
      status: { $ne: "deleted" },
    });

    if (employment) {
      (await cookies()).set(
        cookieKeys.companyId,
        employment.company.toString(),
        {
          secure: process.env.NODE_ENV === "production",
          httpOnly: true,
          path: "/",
          sameSite: "lax",
        }
      );
    } else if (account.hasOnboarded) {
      // Identify if they have NO team at all?
      // If hasOnboarded is true but no active employment found, maybe they were removed?
      // Redirect to no-team page
      redirect(paths.onboardEmployeeNoTeam, RedirectType.replace);
    }
  }

  if (account.hasOnboarded) {
    redirect(paths.dashboard, RedirectType.replace);
  } else {
    redirect(paths.onboard, RedirectType.replace);
  }

  return {
    success: "Login successful",
  };
}
