import ConversationList from "@/components/messages/ConversationList";
import PubNubProvider from "@/components/messages/PubNubProvider";

export default function MessagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PubNubProvider>
            <section className="app-container-fluid h-[calc(100vh-64px)] overflow-hidden">
                <div className="grid grid-cols-12 h-full border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm my-4">
                    {/* Left Column - Conversation List */}
                    <div className="col-span-4 lg:col-span-3 h-full overflow-hidden border-r border-gray-200">
                        <ConversationList />
                    </div>

                    {/* Right Column - Chat Window or Placeholder */}
                    <div className="col-span-8 lg:col-span-9 h-full overflow-hidden bg-gray-50/50">
                        {children}
                    </div>
                </div>
            </section>
        </PubNubProvider>
    );
}
