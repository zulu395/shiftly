"use client";

import { useState } from "react";
import { LuCalendar, LuX } from "react-icons/lu";
import CustomShiftTab from "./CustomShiftTab";
import TemplatesShiftTab from "./TemplatesShiftTab";

type CreateShiftModalProps = {
    isOpen: boolean;
    onClose: () => void;
    initialDate?: Date;
    employeeId?: string;
};

type TabType = "custom" | "templates";

export default function CreateShiftModal({
    isOpen,
    onClose,
    initialDate,
    employeeId,
}: CreateShiftModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>("custom");

    if (!isOpen) return null;

    const tabs: { id: TabType; label: string }[] = [
        { id: "custom", label: "Custom" },
        { id: "templates", label: "Templates" },
    ];

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <LuCalendar className="text-blue-500 text-xl" />
                        <h2 className="text-lg font-semibold text-gray-900">Create New Shift</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <LuX className="text-xl" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors relative ${activeTab === tab.id
                                ? "text-blue-600"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="w-full">
                    {activeTab === "custom" ? (
                        <CustomShiftTab
                            onClose={onClose}
                            initialDate={initialDate}
                            employeeId={employeeId}
                        />
                    ) : (
                        <TemplatesShiftTab />
                    )}
                </div>
            </div>
        </div>
    );
}

