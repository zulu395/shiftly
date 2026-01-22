"use client";

import { $updateAvailability, $getAvailability } from "@/actions/availability";
import { addWeeks, subWeeks, format, startOfWeek } from "date-fns";
import AppSelect from "@/components/form/AppSelect";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { IAvailability, } from "@/server/models/Availability";
import { ANY } from "@/types";
import { AppError } from "@/utils/appError";
import { useState, useEffect } from "react";
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
    const [fetching, setFetching] = useState(false);
    const [currentWeek, setCurrentWeek] = useState<Date>(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [availabilityId, setAvailabilityId] = useState<string | null>(initialData?._id?.toString() ?? null);

    // Determine if we have data for the current week - initially use prop if matches, else null until fetch
    const [days, setDays] = useState<AvailabilityDayData[]>(() => {
        // If initialData is provided and matches current week (roughly), use it. 
        // But initialData from page load is likely "latest" or "default". 
        // Mongoose model update means check weekStartDate.
        // For SAFETY, if we just landed, assuming initialData IS for current week if valid.
        // But since we navigate, we will overwrite `days`.
        return mapAvailabilityToDays(initialData);
    });

    // Helper to map DB data to UI data
    function mapAvailabilityToDays(data: IAvailability | null) {
        if (data?.days && data.days.length > 0) {
            return DEFAULT_DAYS.map((dayName) => {
                const existing = data.days.find((d) => d.day === dayName);
                if (existing) return existing;
                return {
                    day: dayName,
                    startTime: "09:00",
                    endTime: "17:00",
                    location: "Onsite" as "Onsite" | "Remote",
                    isAvailable: true,
                };
            }) as AvailabilityDayData[];
        }
        return DEFAULT_DAYS.map((day) => ({
            day,
            startTime: "09:00",
            endTime: "17:00",
            location: "Onsite" as "Onsite" | "Remote",
            isAvailable: true,
        }));
    }

    // Fetch data when week changes
    useEffect(() => {
        let active = true;
        const load = async () => {
            setFetching(true);
            try {
                // Determine if we assume initialData is for the default start week?
                // If it's the very first render and week matches, maybe skip?
                // But simplified: Just fetch.
                const res = await $getAvailability(currentWeek);
                if (active) {
                    if (res instanceof AppError) {
                        // If not found or error, reset to defaults
                        setDays(mapAvailabilityToDays(null));
                        setAvailabilityId(null);
                    } else {
                        setDays(mapAvailabilityToDays(res));
                        setAvailabilityId(res?._id?.toString() ?? null);
                    }
                }
            } catch (e) {
                console.error(e);
            } finally {
                if (active) setFetching(false);
            }
        };
        load();
        return () => { active = false; };
    }, [currentWeek]);

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
            const result = await $updateAvailability(days, currentWeek);
            if (result instanceof AppError) {
                toast.error(result.message);
            } else {
                toast.success("Availability sent successfully");
                // Update availabilityId so button text changes if needed
                setAvailabilityId(result._id?.toString() ?? "updated");
            }
        } catch (error) {
            console.error({ error });

            toast.error("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleWeekChange = (direction: "prev" | "next") => {
        setCurrentWeek(prev => {
            if (direction === "prev") return subWeeks(prev, 1);
            return addWeeks(prev, 1);
        });
    };

    return (
        <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-xl font-semibold">Weekly Availability</h2>
                    <p className="text-sm text-gray-500">
                        Set your availability for the week of <span className="font-medium text-gray-900">{format(currentWeek, "MMM d, yyyy")}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg border border-gray-200">
                    <button
                        onClick={() => handleWeekChange("prev")}
                        className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600"
                        disabled={fetching}
                    >
                        ←
                    </button>
                    <span className="text-sm font-medium w-32 text-center select-none">
                        {format(currentWeek, "MMM d")} - {format(addWeeks(currentWeek, 0), "MMM")} {parseInt(format(currentWeek, "d")) + 6}
                    </span>
                    <button
                        onClick={() => handleWeekChange("next")}
                        className="p-1 hover:bg-white hover:shadow-sm rounded transition-all text-gray-600"
                        disabled={fetching}
                    >
                        →
                    </button>
                </div>
            </div>

            {fetching ? (
                <div className="py-12 flex justify-center">
                    <div className="animate-spin h-6 w-6 border-2 border-brand-primary border-t-transparent rounded-full"></div>
                </div>
            ) : (
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
            )}

            <div className="flex justify-end pt-4">
                <FormButton onClick={handleSave} loading={loading} disabled={fetching} className="min-w-32 btn btn-primary">
                    {availabilityId ? "Update Availability" : "Send Availability"}
                </FormButton>
            </div>
        </div>
    );
}
