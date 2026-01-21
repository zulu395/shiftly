"use client";

import { useEffect, useState } from "react";
import { format, startOfWeek, endOfWeek, isBefore, isAfter } from "date-fns";
import { $getShiftsByRange } from "@/actions/shifts/getShiftsByRange";
import { IShift } from "@/server/models/Shift";
import Link from "next/link";
import { paths } from "@/utils/paths";
import { LuUsers, LuCalendar, LuDollarSign, LuClock } from "react-icons/lu";
import { $getAllEmployees } from "@/actions/employees/getAllEmployees";

export default function CompanyDashboard() {
    const [shifts, setShifts] = useState<IShift[]>([]);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all");

    useEffect(() => {
        const fetchData = async () => {
            const start = startOfWeek(new Date(), { weekStartsOn: 1 });
            const end = endOfWeek(new Date(), { weekStartsOn: 1 });

            const [shiftsRes, employeesRes] = await Promise.all([
                $getShiftsByRange(start.toISOString(), end.toISOString()),
                $getAllEmployees()
            ]);

            if (Array.isArray(shiftsRes)) {
                setShifts(shiftsRes);
            }

            if (Array.isArray(employeesRes)) {
                setEmployeeCount(employeesRes.length);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    const totalCost = shifts.reduce((acc, shift) => acc + (shift.totalPay || 0), 0);

    const filteredShifts = shifts.filter(shift => {
        const shiftDate = new Date(shift.date);
        const now = new Date();
        if (activeTab === "upcoming") return isAfter(shiftDate, now);
        if (activeTab === "past") return isBefore(shiftDate, now);
        return true;
    });

    return (
        <div className="space-y-8 font-sans">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="p-2 bg-blue-50 text-brand-primary rounded-lg">
                            <LuUsers className="text-xl" />
                        </div>
                        <h3 className="text-sm font-medium">Total Employees</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{employeeCount}</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <LuCalendar className="text-xl" />
                        </div>
                        <h3 className="text-sm font-medium">Active Shifts</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{shifts.length}</p>
                    <p className="text-xs text-gray-400">This week</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 text-gray-500">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <LuDollarSign className="text-xl" />
                        </div>
                        <h3 className="text-sm font-medium">Est. Cost</h3>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">This week</p>
                </div>
            </div>

            {/* Main Content Area */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Shifts</h2>
                    <Link href={paths.dashboardStaffScheduling} className="btn btn-primary btn-sm px-4 rounded-full">
                        Full Schedule
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-8 border-b border-gray-200 mb-6">
                    {(["all", "upcoming", "past"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 text-sm font-medium transition-colors relative capitalize ${activeTab === tab
                                ? "text-brand-primary"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-primary rounded-t-full" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Shift List - Card Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {loading ? (
                        <div className="col-span-full py-12 text-center text-gray-400">Loading details...</div>
                    ) : filteredShifts.length === 0 ? (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                            <p className="text-gray-500">No {activeTab} shifts found for this week.</p>
                        </div>
                    ) : (
                        filteredShifts.slice(0, 6).map((shift) => (
                            <div key={shift._id.toString()} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:border-brand-primary/30 transition-colors flex justify-between items-start group">
                                <div className="space-y-1">
                                    {/* Status Badge */}
                                    <div className="mb-2">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${shift.status === 'assigned'
                                            ? 'bg-blue-50 text-brand-primary'
                                            : 'bg-yellow-50 text-yellow-600'
                                            }`}>
                                            {shift.status}
                                        </span>
                                    </div>

                                    <h4 className="font-bold text-gray-900 text-lg">{shift.position}</h4>
                                    <p className="text-sm text-gray-500">{shift.details || "Shift details"}</p>

                                    <div className="flex items-center gap-2 text-sm text-brand-primary font-medium mt-2">
                                        <LuClock className="w-4 h-4" />
                                        <span>{shift.duration || "4 hours"} • {format(new Date(shift.date), "EEE, MMM d")}</span>
                                    </div>
                                </div>

                                <button className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-brand-primary transition-colors opacity-0 group-hover:opacity-100">
                                    <span className="sr-only">View</span>
                                    →
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
