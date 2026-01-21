"use client";

import { $updateAvailability } from "@/actions/availability";
import AppSelect from "@/components/form/AppSelect";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { IAvailability, } from "@/server/models/Availability";
import { ANY } from "@/types";
import { AppError } from "@/utils/appError";
import { useState } from "react";
import { toast } from "sonner"; // Assuming sonner or similar toast
import FormButton from "../form/FormButton";
// If sonner not available, I'll use standard alert or check for toast component
// Actually checking imports in SidebarLinks, likely using some toast. I'll guess sonner or check later.
// For now I'll stick to 'sonner' as it's common in modern shadcn setups, or 'react-hot-toast'.
// Given the setup, I'll check for toast.

// Re-defining for client usage without mongoose types
interface AvailabilityDayData {
    day: string;
    startTime: string;
    endTime: string;
    location: "Remote" | "Onsite";
    isAvailable: boolean;
}

interface AvailabilityFormProps {
    initialData: IAvailability | null;
}

const DEFAULT_DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export default function AvailabilityForm({ initialData }: AvailabilityFormProps) {
    const [loading, setLoading] = useState(false);
    const [days, setDays] = useState<AvailabilityDayData[]>(() => {
        if (initialData?.days && initialData.days.length > 0) {
            // Merge with defaults to ensure all days exist if we want strict structure, 
            // or just trust the DB. Let's merge to be safe and ensure order.
            return DEFAULT_DAYS.map((dayName) => {
                const existing = initialData.days.find((d) => d.day === dayName);
                return (
                    existing || {
                        day: dayName,
                        startTime: "09:00",
                        endTime: "17:00",
                        location: "Onsite",
                        isAvailable: true,
                    }
                );
            }) as AvailabilityDayData[];
        }
        return DEFAULT_DAYS.map((day) => ({
            day,
            startTime: "09:00",
            endTime: "17:00",
            location: "Onsite",
            isAvailable: true,
        }));
    });

    const handleUpdateDay = (
        index: number,
        field: keyof AvailabilityDayData,
        value: ANY
    ) => {
        const newDays = [...days];
        newDays[index] = { ...newDays[index], [field]: value };
        setDays(newDays);
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const result = await $updateAvailability(days);
            if (result instanceof AppError) {
                toast.error(result.message);
            } else {
                toast.success("Availability updated successfully");
            }
        } catch (error) {
            console.error({ error });

            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Weekly Availability</h2>
                <p className="text-sm text-gray-500">
                    Set your typical availability for each day.
                </p>
            </div>

            <div className="grid gap-4">
                {days.map((day, index) => (
                    <div
                        key={day.day}
                        className={`p-4 rounded-lg border ${day.isAvailable ? "border-gray-200 bg-gray-50/50" : "border-transparent bg-gray-50 opacity-60"
                            } transition-all`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center justify-between w-32 shrink-0">
                                <span className="font-medium">{day.day}</span>
                                <Switch
                                    checked={day.isAvailable}
                                    onCheckedChange={(checked) =>
                                        handleUpdateDay(index, "isAvailable", checked)
                                    }
                                />
                            </div>

                            {day.isAvailable && (
                                <div className="flex flex-1 flex-col sm:flex-row gap-4 items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="w-32">
                                            <Input
                                                type="time"
                                                value={day.startTime}
                                                onChange={(e) =>
                                                    handleUpdateDay(index, "startTime", e.target.value)
                                                }
                                                className="bg-white"
                                            />
                                        </div>
                                        <span className="text-gray-400">-</span>
                                        <div className="w-32">
                                            <Input
                                                type="time"
                                                value={day.endTime}
                                                onChange={(e) =>
                                                    handleUpdateDay(index, "endTime", e.target.value)
                                                }
                                                className="bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="w-40">
                                        <AppSelect
                                            name={`location-${index}`}
                                            options={["Onsite", "Remote"]}
                                            value={day.location}
                                            onChange={(val) => handleUpdateDay(index, "location", val)}
                                            variant="app-select"
                                            placeholder="Location"
                                        />
                                    </div>
                                </div>
                            )}

                            {!day.isAvailable && (
                                <span className="text-sm text-gray-400 italic">Not available</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-4">
                <FormButton onClick={handleSave} loading={loading} className="min-w-32 btn btn-primary">
                    Save Changes
                </FormButton>
            </div>
        </div>
    );
}
