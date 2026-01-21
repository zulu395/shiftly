import { LuPlus } from "react-icons/lu";

type Props = {
    onNewChat: () => void;
};

export default function ConversationListHeader({ onNewChat }: Props) {
    return (
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="font-bold text-lg text-gray-800">Messages</h2>
            <button
                onClick={onNewChat}
                className="p-2 bg-brand-primary/10 text-brand-primary rounded-full hover:bg-brand-primary/20 transition-colors"
                title="New Conversation"
            >
                <LuPlus className="w-5 h-5" />
            </button>
        </div>
    );
}
