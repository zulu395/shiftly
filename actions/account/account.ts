"use server";

import { IAccount } from "@/server/models/Account";
import { AccountService } from "@/server/services/Account";
import { SecurityService } from "@/server/services/Security";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { cookieKeys } from "@/utils/cookies";
import { paths } from "@/utils/paths";
import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";

export async function $getAccountFromSession(
  logoutIfUnauthorized = false
): Promise<ServiceResponse<IAccount>> {
  const token = (await cookies()).get(cookieKeys.account)?.value ?? "";
  if (!token && logoutIfUnauthorized) {
    redirect(paths.login, RedirectType.replace);
  }
  const sessionAccount = await SecurityService.isTokenValid(token);
  if (!sessionAccount) {
    if (logoutIfUnauthorized) redirect(paths.login, RedirectType.replace);
    return new AppError("Unauthorized", {
      errorCode: "UNAUTHORIZED",
    });
  }

  const account = await AccountService.getById(sessionAccount._id);
  if (account instanceof AppError && logoutIfUnauthorized)
    redirect(paths.login, RedirectType.replace);

  return account;
}
