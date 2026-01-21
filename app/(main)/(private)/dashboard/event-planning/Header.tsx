"use client";

import type { EventFilterTab } from "@/types/event";

type HeaderProps = {
    currentTab: EventFilterTab;
    onTabChange: (tab: EventFilterTab) => void;
    createButton?: React.ReactNode;
};

/**
 * Header component for Event Planning page with tabs and create button.
 */
export default function Header({
    currentTab,
    onTabChange,
    createButton,
}: HeaderProps) {
    const tabs: { value: EventFilterTab; label: string }[] = [
        { value: "all", label: "All" },
        { value: "upcoming", label: "Upcoming" },
        { value: "past", label: "Past" },
    ];

    return (
        <div className="flex flex-col gap-4">
            {/* Title Row */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900">Event Planning</h1>
                {createButton}
            </div>

            {/* Tabs */}
            <div className="flex gap-6 border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => onTabChange(tab.value)}
                        className={`pb-3 px-1 text-sm font-medium transition-colors relative ${currentTab === tab.value
                            ? "text-brand-primary"
                            : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab.label}
                        {currentTab === tab.value && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}

