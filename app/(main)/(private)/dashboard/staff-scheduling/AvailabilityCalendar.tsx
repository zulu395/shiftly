"use client";

import { AvailabilityWithEmployee } from "@/actions/availability";
import Avatar from "@/components/common/Avatar";
import { addDays, format } from "date-fns";

type AvailabilityCalendarProps = {
    data: AvailabilityWithEmployee[];
    weekStart: Date;
};

export default function AvailabilityCalendar({
    data,
    weekStart,
}: AvailabilityCalendarProps) {
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const getDayName = (date: Date) => format(date, "EEE").toUpperCase();
    const getDayNumber = (date: Date) => format(date, "d");
    const getDayFullname = (date: Date) => format(date, "EEEE");

    const getAvailabilityForDay = (
        availability: AvailabilityWithEmployee["availability"],
        date: Date
    ) => {
        if (!availability) return null;
        const dayName = getDayFullname(date);
        return availability.days.find((d) => d.day === dayName);
    };


    return (
        <div className="schedule-calendar mt-6 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex">
                    <div className="w-48 px-4 py-3 bg-gray-50 border-r border-gray-200 flex items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            Employee
                        </span>
                    </div>
                    <div className="flex-1 flex bg-gray-50">
                        {weekDays.map((day, index) => (
                            <div
                                key={index}
                                className="flex-1 px-2 py-3 text-center border-r border-gray-200 last:border-r-0"
                            >
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                    {getDayName(day)}
                                </div>
                                <div className="text-sm font-bold text-gray-900">
                                    {getDayNumber(day)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)] bg-white">
                {data.map(({ employee, availability }) => {
                    return (
                        <div
                            key={employee._id.toString()}
                            className="border-b border-gray-100 last:border-b-0"
                        >
                            <div className="flex group hover:bg-gray-50/50 transition-colors">
                                <div className="w-48 px-4 py-4 border-r border-gray-100 flex-shrink-0 flex items-center bg-white group-hover:bg-gray-50/80 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar alt={employee.account?.fullname} />
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="font-medium text-sm text-gray-900 truncate">
                                                {employee.account?.fullname}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex bg-white group-hover:bg-gray-50/30 transition-colors">
                                    {weekDays.map((day, index) => {
                                        const dayConfig = getAvailabilityForDay(availability, day);

                                        return (
                                            <div
                                                key={index}
                                                className="flex-1 border-r border-gray-100 last:border-r-0 p-2 min-h-[80px] flex items-center justify-center text-center"
                                            >
                                                {dayConfig ? (
                                                    dayConfig.isAvailable ? (
                                                        <div className="flex flex-col items-center justify-center gap-1">
                                                            <span className="text-xs font-bold text-gray-700 bg-green-50 px-2 py-1.5 rounded-md border border-green-100 shadow-sm">
                                                                {dayConfig.startTime} - {dayConfig.endTime}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500 uppercase tracking-wide font-medium">
                                                                {dayConfig.location}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="text-xs font-medium text-gray-400 italic bg-gray-50 px-2 py-1 rounded">
                                                                Unavailable
                                                            </span>
                                                        </div>
                                                    )
                                                ) : (
                                                    <span className="text-xs text-gray-300 italic">-</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {data.length === 0 && (
                    <div className="p-12 text-center">
                        <p className="text-gray-400 text-sm">No employees found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
