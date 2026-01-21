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
  fullname: validators.fullname,
  email: validators.email,
  phone: validators.phone,
  password: validators.password,
});

export async function $register(
  _: ActionResponse,
  formdata: FormData
): Promise<ActionResponse> {
  const data = formDataToObject(formdata);

  const result = schema.safeParse(data);

  if (!result.success)
    return {
      error: "Fix errors and submit again",
      fieldErrors: result.error.flatten().fieldErrors,
    };

  const response = await AccountService.createFromRegister(data);

  if (response instanceof AppError)
    return {
      error: response.message,
    };

  (await cookies()).set(
    cookieKeys.account,
    await SecurityService.generateToken(response)
  );
  redirect(paths.onboard, RedirectType.replace);
  return {
    success: "Account created. Proceed to complete setup",
  };
}
