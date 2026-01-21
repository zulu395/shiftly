"use client";

import { LuCalendar, LuX } from "react-icons/lu";
import EditShiftForm from "./EditShiftForm";
import type { Shift } from "@/types/schedule";

type EditShiftModalProps = {
    isOpen: boolean;
    onClose: () => void;
    shift: Shift | null;
};

export default function EditShiftModal({
    isOpen,
    onClose,
    shift,
}: EditShiftModalProps) {
    if (!isOpen || !shift) return null;

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-[500px] mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <LuCalendar className="text-blue-500 text-xl" />
                        <h2 className="text-lg font-semibold text-gray-900">Edit Shift</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <LuX className="text-xl" />
                    </button>
                </div>

                <div className="w-full">
                    <EditShiftForm
                        key={shift._id}
                        shift={shift}
                        onClose={onClose}
                    />
                </div>
            </div>
        </div>
    );
}
