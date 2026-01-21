"use client";

import { LuMessageSquare } from "react-icons/lu";

export default function ChatPlaceholder() {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-50 text-center p-6">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <LuMessageSquare className="text-5xl text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Select a conversation
            </h3>
            <p className="text-gray-500 max-w-sm">
                Choose a conversation from the list to start chatting or send a new message.
            </p>
        </div>
    );
}
