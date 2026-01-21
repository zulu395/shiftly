"use client";



export default function MessagesSkeleton() {
    return (
        <div className="flex bg-gray-100 h-full w-full">
            {/* Sidebar Skeleton */}
            <div className="w-80 border-r border-gray-200 bg-white flex flex-col h-full hidden md:flex shrink-0">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Search */}
                <div className="p-3 border-b border-gray-100 bg-gray-50/30">
                    <div className="h-9 w-full bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* List Items */}
                <div className="flex-1 overflow-hidden p-2 space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex gap-3 p-2">
                            <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0 animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-3 w-8 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                                <div className="h-3 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area Skeleton */}
            <div className="flex-1 flex flex-col h-full bg-gray-50/50">
                {/* Chat Header */}
                <div className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 p-6 space-y-6 overflow-hidden flex flex-col justify-end">
                    {/* Incoming */}
                    <div className="flex gap-3 max-w-[70%]">
                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 animate-pulse self-end mb-1"></div>
                        <div className="p-3 bg-white rounded-2xl rounded-bl-none shadow-sm w-48 h-10 animate-pulse"></div>
                    </div>

                    {/* Outgoing */}
                    <div className="flex gap-3 max-w-[70%] self-end flex-row-reverse">
                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 animate-pulse self-end mb-1"></div>
                        <div className="p-3 bg-brand-primary/10 rounded-2xl rounded-br-none w-64 h-16 animate-pulse"></div>
                    </div>

                    {/* Incoming */}
                    <div className="flex gap-3 max-w-[70%]">
                        <div className="w-8 h-8 rounded-full bg-gray-200 shrink-0 animate-pulse self-end mb-1"></div>
                        <div className="p-3 bg-white rounded-2xl rounded-bl-none shadow-sm w-32 h-8 animate-pulse"></div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-200">
                    <div className="h-12 bg-gray-100 rounded-full animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
