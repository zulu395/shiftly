"use client";

import { useEffect } from "react";
import { ANY } from "@/types";
import AppSelect from "../form/AppSelect";
import AppInput from "../form/AppInput";
import { format, addWeeks } from "date-fns";
import { LuCalendar } from "react-icons/lu";

type ShiftRepeatSelectProps = {
    value: string;
    onChange: (value: string) => void;
    days: number[];
    onDaysChange: (days: number[]) => void;
    endDate: string;
    onEndDateChange: (date: string) => void;
    error?: ANY;
};

const DAYS = [
    { label: "S", value: 0 },
    { label: "M", value: 1 },
    { label: "T", value: 2 },
    { label: "W", value: 3 },
    { label: "T", value: 4 },
    { label: "F", value: 5 },
    { label: "S", value: 6 },
];

export default function ShiftRepeatSelect({
    value,
    onChange,
    days,
    onDaysChange,
    endDate,
    onEndDateChange,
    error,
}: ShiftRepeatSelectProps) {
    const handleDayToggle = (dayValue: number) => {
        if (days.includes(dayValue)) {
            onDaysChange(days.filter((d) => d !== dayValue));
        } else {
            onDaysChange([...days, dayValue].sort());
        }
    };

    // Set default end date if none provided when switching to a repeat mode
    useEffect(() => {
        if (value !== "Never" && !endDate) {
            onEndDateChange(format(addWeeks(new Date(), 4), "yyyy-MM-dd"));
        }
    }, [value, endDate, onEndDateChange]);

    return (
        <div className="space-y-4">
            <AppSelect
                name="repeat"
                title="Repeat"
                options={["Never", "Daily", "Weekly"]}
                value={value}
                onChange={onChange}
                error={error}
            />

            {value === "Weekly" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-xs text-gray-600 mb-2 block font-medium">
                        Repeat On
                    </label>
                    <div className="flex gap-2">
                        {DAYS.map((day) => {
                            const isSelected = days.includes(day.value);
                            return (
                                <button
                                    key={day.value}
                                    type="button"
                                    onClick={() => handleDayToggle(day.value)}
                                    className={`w-8 h-8 rounded-full text-xs font-bold transition-all flex items-center justify-center border ${isSelected
                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm transform scale-105"
                                        : "bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-500"
                                        }`}
                                >
                                    {day.label}
                                </button>
                            );
                        })}
                    </div>
                    {days.length === 0 && (
                        <p className="text-red-500 text-xs mt-1">
                            Please select at least one day
                        </p>
                    )}
                </div>
            )}

            {value !== "Never" && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                    <AppInput
                        name="repeatEnd"
                        title="Ends On"
                        type="date"
                        placeholder="Select date"
                        value={endDate}
                        onChange={onEndDateChange}
                        icon={<LuCalendar />}
                    />
                </div>
            )}
        </div>
    );
}
