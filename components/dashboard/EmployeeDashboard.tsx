"use client";

import { useEffect, useState } from "react";
import { format, addDays } from "date-fns";
import { $getMyShiftsByRange } from "@/actions/shifts/getMyShiftsByRange";
import { IShift } from "@/server/models/Shift";
import { IAccount } from "@/server/models/Account";
import { LuCalendar, LuMapPin, LuClock, LuBriefcase } from "react-icons/lu";

interface EmployeeDashboardProps {
    account: IAccount;
}

export default function EmployeeDashboard({ account }: EmployeeDashboardProps) {
    const [shifts, setShifts] = useState<IShift[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShifts = async () => {
            // Fetch next 2 weeks
            const start = new Date();
            const end = addDays(new Date(), 14);

            const res = await $getMyShiftsByRange(
                start.toISOString(),
                end.toISOString()
            );

            if (Array.isArray(res)) {
                // Sort by date
                const sorted = res.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                setShifts(sorted);
            }
            setLoading(false);
        };

        fetchShifts();
    }, []);

    const nextShift = shifts.find(s => new Date(s.date) >= new Date(new Date().setHours(0, 0, 0, 0)));

    return (
        <div className="space-y-8 font-sans">
            {/* Welcome Section */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back, {account.fullname.split(" ")[0]}!</h1>
                <p className="text-gray-500">Here is your schedule for the upcoming days.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Next Shift Card - Hero */}
                <div className="bg-brand-primary text-white rounded-2xl p-8 shadow-xl shadow-blue-200 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-blue-100 mb-6 font-medium">
                            <LuCalendar className="w-5 h-5" />
                            <span className="uppercase tracking-wider text-xs">Next Shift</span>
                        </div>

                        {nextShift ? (
                            <div>
                                <p className="text-5xl font-bold tracking-tight mb-2">{format(new Date(nextShift.date), "EEEE")}</p>
                                <p className="text-3xl font-medium text-blue-100 mb-6">{format(new Date(nextShift.date), "MMM d")}</p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <LuClock className="w-5 h-5 text-blue-200" />
                                        <span className="font-medium text-lg">{nextShift.startTime} - {nextShift.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                        <LuBriefcase className="w-5 h-5 text-blue-200" />
                                        <span className="font-medium">{nextShift.position}</span>
                                    </div>
                                    {nextShift.location && (
                                        <div className="flex items-center gap-3 bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                                            <LuMapPin className="w-5 h-5 text-blue-200" />
                                            <span className="font-medium">{nextShift.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 opacity-80">
                                <p className="text-xl font-medium">No upcoming shifts</p>
                                <p className="text-sm text-blue-200 mt-2">Enjoy your time off!</p>
                            </div>
                        )}
                    </div>

                    {nextShift && (
                        <div className="relative z-10 mt-6">
                            <div className="inline-flex items-center gap-2 text-sm font-medium bg-white text-brand-primary px-4 py-2 rounded-full shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Confirmed
                            </div>
                        </div>
                    )}
                </div>

                {/* Upcoming List */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Upcoming Shifts</h3>
                        <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-md">Next 14 Days</span>
                    </div>

                    <div className="space-y-0">
                        {loading ? (
                            <div className="py-12 text-center text-gray-400 animate-pulse">Loading schedule...</div>
                        ) : shifts.length === 0 ? (
                            <div className="py-12 text-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <LuCalendar className="w-8 h-8 text-gray-300" />
                                </div>
                                <p>No other shifts scheduled.</p>
                            </div>
                        ) : (
                            shifts.filter(s => s !== nextShift).slice(0, 5).map((shift) => (
                                <div key={shift._id.toString()} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 -mx-2 rounded-lg group">
                                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-blue-50/50 rounded-xl text-brand-primary">
                                        <span className="text-xs font-bold uppercase">{format(new Date(shift.date), "MMM")}</span>
                                        <span className="text-xl font-bold">{format(new Date(shift.date), "d")}</span>
                                    </div>

                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{shift.position}</h4>
                                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1"><LuClock className="w-3 h-3" /> {shift.startTime} - {shift.endTime}</span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <span className="inline-block w-2 h-2 rounded-full bg-blue-400" title="Assigned"></span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
