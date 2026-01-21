"use client";

import { useState } from "react";
import { IConversation } from "@/server/models/Conversation";
import { ANY } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { LuMessageSquare } from "react-icons/lu";
import { $getConversations } from "@/actions/conversations/getAll";
import NewConversationModal from "./NewConversationModal";
import { useAccountStore } from "@/hooks/stores/accountStore";
import ConversationListHeader from "./ConversationListHeader";
import ConversationSearch from "./ConversationSearch";
import ConversationItem from "./ConversationItem";

export default function ConversationList() {
    const [isNewModalOpen, setIsNewModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data: conversations, isLoading } = useQuery({
        queryKey: ["conversations"],
        queryFn: async () => {
            const res = await $getConversations();
            if ("errorMessage" in res) throw new Error(res.errorMessage as string);
            return res as ANY as IConversation[];
        },
        refetchInterval: 20000,
        refetchOnWindowFocus: true,
    });

    const account = useAccountStore(s => s.account);

    const filteredConversations = conversations?.filter((conv) => {
        const names = (conv.participants as ANY[]).map(p => p.fullname || p.account?.fullname || "").join(" ").toLowerCase();
        return names.includes(search.toLowerCase());
    }) || [];

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <ConversationListHeader onNewChat={() => setIsNewModalOpen(true)} />
            <ConversationSearch search={search} setSearch={setSearch} />

            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
                ) : filteredConversations.length === 0 ? (
                    <div className="p-8 text-center flex flex-col items-center gap-2 text-gray-400">
                        <LuMessageSquare className="w-8 h-8 opacity-20" />
                        <p className="text-sm">No conversations yet</p>
                        <button
                            onClick={() => setIsNewModalOpen(true)}
                            className="text-xs text-brand-primary font-medium hover:underline"
                        >
                            Start a new chat
                        </button>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filteredConversations.map((conv) => (
                            <ConversationItem
                                key={conv._id?.toString()}
                                conversation={conv}
                                currentUserId={account?._id?.toString()}
                            />
                        ))}
                    </div>
                )}
            </div>

            <NewConversationModal
                isOpen={isNewModalOpen}
                onClose={() => setIsNewModalOpen(false)}
            />
        </div>
    );
}
