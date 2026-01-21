"use client";

import { LuTriangleAlert } from "react-icons/lu";

type DeleteConfirmationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
};

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title = "Delete Shift",
    message = "Are you sure you want to delete this shift? This action cannot be undone.",
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] mx-4 overflow-hidden p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LuTriangleAlert className="text-2xl text-red-600" />
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2">{title}</h2>
                <p className="text-gray-500 mb-6 text-sm">{message}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="flex-1 px-4 py-2 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors shadow-sm"
                    >
                        Confirm Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
