"use client";

import { useState } from "react";
import { LuCalendar, LuX, LuBookmark } from "react-icons/lu";
import AppInput from "../form/AppInput";
import AppSelect from "../form/AppSelect";


type NewShiftTemplateModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function NewShiftTemplateModal({
    isOpen,
    onClose,
}: NewShiftTemplateModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        startTime: "9:00 AM",
        endTime: "9:00 AM",
        break: "None",
        location: "",
        position: "",
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Saving template:", formData);
        // TODO: Implement template saving logic
        onClose();
    };



    return (
        <div className="fixed inset-0 bg-black/30 z-[60] flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-[500px] mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-blue-50 rounded-lg">
                            <LuCalendar className="text-blue-500 text-xl" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">New shift template</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <LuX className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-6 py-8">
                    <div className="space-y-4">
                        <AppInput
                            title="Name"
                            name="name"
                            placeholder="Add Name"
                            value={formData.name}
                            onChange={(value) => setFormData({ ...formData, name: value })}
                        />

                        <div className="grid grid-cols-3 items-center gap-2">

                            <AppInput
                                title="Start"
                                name="startTime"
                                placeholder="Add Start"
                                value={formData.startTime}
                                onChange={(value) => setFormData({ ...formData, startTime: value })}
                            />

                            <AppInput
                                title="End"
                                name="endTime"
                                placeholder="Add End"
                                value={formData.endTime}
                                onChange={(value) => setFormData({ ...formData, endTime: value })}
                            />
                            <AppSelect
                                title="Break"
                                name="break"
                                placeholder="None"
                                options={["None", "15 min", "30 min", "1 hour"]}
                                value={formData.break}
                                onChange={(value) => setFormData({ ...formData, break: value })}
                            />
                        </div>

                        <AppInput
                            title="Location"
                            name="location"
                            placeholder="Add Location"
                            value={formData.location}
                            onChange={(value) => setFormData({ ...formData, location: value })}
                        />

                        <AppInput
                            title="Position"
                            name="position"
                            placeholder="Add Position"
                            value={formData.position}
                            onChange={(value) => setFormData({ ...formData, position: value })}
                        />
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 flex items-center gap-2 rounded-lg font-medium shadow-sm transition-all"
                        >
                            <LuBookmark className="w-5 h-5 fill-current" />
                            Save
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
}
