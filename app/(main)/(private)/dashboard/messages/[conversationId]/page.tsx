import { $getAccountFromSession } from "@/actions/account/account";
import { AppError } from "@/utils/appError";
import { ANY } from "@/types";
import ChatWindow from "@/components/messages/ChatWindow";
import { redirect } from "next/navigation";
import { ConversationService } from "@/server/services/Conversation";
import { paths } from "@/utils/paths";

export default async function ConversationPage({
    params: _params,
}: {
    params: Promise<{ conversationId: string }>;
}) {
    const params = await _params;
    const account = await $getAccountFromSession(true);
    if (account instanceof AppError || !account) {
        redirect(paths.login);
    }

    const conversation = await ConversationService.getById(params.conversationId);

    if (conversation instanceof AppError || !conversation) {
        redirect(paths.dashboardMessages);
    }

    // Identify current and other user
    const participants = conversation.participants as ANY[]; // Type assertion until types catch up

    // Safety check for participants array
    if (!Array.isArray(participants)) {
        redirect(paths.dashboardMessages);
    }

    const currentUserAccount = participants.find((p: ANY) => p._id.toString() === account._id.toString());

    // Find other user (first one that isn't me)
    const otherUserAccount = participants.find((p: ANY) => p._id.toString() !== account._id.toString());

    // Prepare serializable objects
    const serializableCurrentUser = currentUserAccount ? currentUserAccount : { _id: account._id, fullname: "Me" };

    // Fallback for other user if not found (e.g. self chat?)
    const serializableOtherUser = otherUserAccount ? otherUserAccount : { _id: "unknown", fullname: "Unknown" };

    return (
        <ChatWindow
            conversationId={params.conversationId}
            currentUser={serializableCurrentUser}
            otherUser={serializableOtherUser}
        />
    );
}
