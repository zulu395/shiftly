"use server";

import { ConversationService } from "@/server/services/Conversation";
import { ServiceResponse } from "@/types";
import { IConversation } from "@/server/models/Conversation";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";

export async function $getConversations(): Promise<
  ServiceResponse<IConversation[]>
> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  return await ConversationService.getAll(account._id.toString());
}
