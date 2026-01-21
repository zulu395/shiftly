"use client";

import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import NewShiftTemplateModal from "./NewShiftTemplateModal";

export default function TemplatesShiftTab() {
    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

    return (
        <>
            <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Shift templates</h3>
                <p className="text-sm text-gray-500 max-w-[280px] mb-8">
                    Use shift templates to quickly add preset shifts to your schedule.
                </p>

                <button
                    onClick={() => setIsTemplateModalOpen(true)}
                    className="btn border-blue-600 text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg border-2 font-medium transition-all"
                >
                    <LuPlus className="text-xl" />
                    Create Shift Template
                </button>
            </div>

            <NewShiftTemplateModal
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
            />
        </>
    );
}

