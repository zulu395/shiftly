"use client";

import { useState } from "react";
import { LuSend } from "react-icons/lu";

interface ChatInputProps {
    onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
    const [message, setMessage] = useState("");

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSend(message);
            setMessage("");
        }
    };

    return (
        <div className="bg-white border-t border-gray-200 px-6 py-4">
            <form onSubmit={handleSend} className="flex items-end gap-3">
                <div className="flex gap-2 pb-3">
                    {/* <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <LuPaperclip className="text-xl" />
                    </button>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                        <LuSmile className="text-xl" />
                    </button> */}
                </div>

                <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                    <textarea
                        rows={1}
                        placeholder="Type a message..."
                        className="w-full bg-transparent border-0 focus:ring-0 resize-none p-3 max-h-32"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!message.trim()}
                    className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm mb-1"
                >
                    <LuSend className="text-lg" />
                </button>
            </form>
        </div>
    );
}
