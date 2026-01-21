"use client";

import { $updateLastMessage } from "@/actions/conversations/updateLastMessage";
import { usePubNub } from "pubnub-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

import { ANY } from "@/types";

type ChatWindowProps = {
    conversationId: string;
    currentUser: ANY; // User object
    otherUser: ANY;   // User object
};

export type Message = {
    _id: string; // timetoken
    content: string;
    senderId: string;
    timestamp: number;
};

export default function ChatWindow({ conversationId, currentUser, otherUser }: ChatWindowProps) {
    const pubnub = usePubNub();
    const [messages, setMessages] = useState<Message[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const channel = `chat_${conversationId}`;

    console.log("pubnub", pubnub.configuration);


    useEffect(() => {
        // Fetch History
        const fetchHistory = async () => {
            try {
                const result = await pubnub.fetchMessages({
                    channels: [channel],
                    count: 50,
                });

                if (result.channels[channel]) {
                    const history = result.channels[channel].map((msg: ANY) => ({
                        _id: msg.timetoken as string,
                        content: msg.message.content,
                        senderId: msg.message.senderId,
                        timestamp: parseInt(msg.timetoken as string) / 10000, // PubNub timetoken is 17 digits (100ns precision)
                    }));
                    setMessages(history);
                }
            } catch {
                toast.error("Failed to fetch history");
            }
        };

        fetchHistory();

        // Subscribe
        const listener = {
            message: (event: ANY) => {
                const msg = event.message;
                setMessages((prev) => [
                    ...prev,
                    {
                        _id: event.timetoken,
                        content: msg.content,
                        senderId: msg.senderId,
                        timestamp: parseInt(event.timetoken) / 10000,
                    },
                ]);
            },
        };

        pubnub.addListener(listener);
        pubnub.subscribe({ channels: [channel] });

        return () => {
            pubnub.removeListener(listener);
            pubnub.unsubscribe({ channels: [channel] });
        };
    }, [pubnub, channel]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (content: string) => {
        if (!content.trim()) return;

        try {
            // Publish to PubNub
            await pubnub.publish({
                channel: channel,
                message: {
                    content: content,
                    senderId: currentUser._id,
                    senderName: currentUser.fullname,
                },
            });

            // Update Last Message in DB
            await $updateLastMessage(conversationId, content);

        } catch (e) {
            console.error("Failed to send message", e);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <ChatHeader user={otherUser} />

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p>No messages yet.</p>
                        <p className="text-sm">Say hello to {otherUser.dummyName || "them"}!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble
                            key={msg._id}
                            message={msg}
                            isOwn={msg.senderId === currentUser._id || msg.senderId === currentUser._id?.toString()}
                        />
                    ))
                )}
            </div>

            <ChatInput onSend={handleSend} />
        </div>
    );
}
