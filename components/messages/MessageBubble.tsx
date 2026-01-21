"use client";

import { format } from "date-fns";

type Message = {
    _id: string;
    content: string;
    senderId: string;
    timestamp: number;
};

type MessageBubbleProps = {
    message: Message;
    isOwn: boolean;
};

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${isOwn
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white text-gray-900 border border-gray-200 rounded-bl-none"
                    }`}
            >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <div
                    className={`text-[10px] mt-1 text-right ${isOwn ? "text-blue-100" : "text-gray-400"
                        }`}
                >
                    {format(new Date(message.timestamp), "h:mm a")}
                </div>
            </div>
        </div>
    );
}
