"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Avatar from "../common/Avatar";
import { IConversation } from "@/server/models/Conversation";
import { ANY } from "@/types";
import { useParams } from "next/navigation";

type Props = {
    conversation: IConversation;
    currentUserId?: string;
};

export default function ConversationItem({ conversation, currentUserId }: Props) {
    const params = useParams();
    const active = params.conversationId === conversation._id?.toString();

    // Logic to find other user
    const participants = conversation.participants as ANY[];
    const otherUser = participants.find(p => p._id !== currentUserId) || participants[0];

    const name = otherUser?.fullname || otherUser?.account?.fullname || "Unknown User";
    const avatar = otherUser?.avatar || otherUser?.account?.avatar;

    const lastMessageTime = conversation.lastMessage?.timestamp
        ? formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: false })
        : "";

    return (
        <Link
            href={`/dashboard/messages/${conversation._id}`}
            className={cn(
                "block p-3 hover:bg-gray-50 transition-colors relative",
                active && "bg-blue-50/50 hover:bg-blue-50/70 border-l-4 border-brand-primary pl-2"
            )}
        >
            <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                    <Avatar
                        src={avatar}
                        alt={name}
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                        <h4 className={`font-semibold text-sm truncate ${active ? "text-brand-primary" : "text-gray-900"}`}>
                            {name}
                        </h4>
                        {lastMessageTime && (
                            <span className="text-[10px] text-gray-400 flex-shrink-0">
                                {lastMessageTime}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                        {conversation.lastMessage?.content || "No messages yet"}
                    </p>
                </div>
            </div>
        </Link>
    );
}
