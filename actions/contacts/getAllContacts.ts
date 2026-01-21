"use server";

import { ContactService } from "@/server/services/Contact";
import { ServiceResponse } from "@/types";
import { IContact } from "@/server/models/Contact";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";

export async function $getAllContacts(): Promise<ServiceResponse<IContact[]>> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError) return account;
  if (!account) return new AppError("Unauthorized");

  return await ContactService.getAll(account._id.toString());
}
