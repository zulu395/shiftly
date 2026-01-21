"use server";

import { ConversationService } from "@/server/services/Conversation";
import { ServiceResponse } from "@/types";
import { IConversation } from "@/server/models/Conversation";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";

export async function $createConversation(
  otherParticipantId: string
): Promise<ServiceResponse<IConversation>> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  // We need to resolve the account._id of the current user's *Employee* record or just use Account ID?
  // The Conversation model references "Account" in participants (see model schema: ref: "Account").
  // So we just use account._id.

  return await ConversationService.create([
    account._id.toString(),
    otherParticipantId,
  ]);
}
