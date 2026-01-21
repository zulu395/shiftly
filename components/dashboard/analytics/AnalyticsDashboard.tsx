"use client";

import { $getAnalyticsData, AnalyticsData } from "@/actions/analytics/getAnalyticsData";
import { ANY } from "@/types";
import { addMonths, format, subMonths } from "date-fns";
import { useEffect, useState } from "react";
import { LuChartBar, LuChartPie, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

export default function AnalyticsDashboard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"shifts" | "weekly">("shifts");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const res = await $getAnalyticsData(currentDate.toISOString());

            if (!("message" in res) && !("error" in res)) {
                setData(res);
            }
            setLoading(false);
        };

        fetchData();
    }, [currentDate]);

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>

                <div className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <LuChevronLeft />
                    </button>
                    <span className="font-semibold min-w-[140px] text-center">
                        {format(currentDate, "MMMM yyyy")}
                    </span>
                    <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <LuChevronRight />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("shifts")}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors ${activeTab === "shifts"
                        ? "border-brand-primary text-brand-primary font-medium"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <LuChartPie />
                    Employee Shifts
                </button>
                <button
                    onClick={() => setActiveTab("weekly")}
                    className={`flex items-center gap-2 pb-3 px-2 border-b-2 transition-colors ${activeTab === "weekly"
                        ? "border-brand-primary text-brand-primary font-medium"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                        }`}
                >
                    <LuChartBar />
                    Weekly Overview
                </button>
            </div>

            {/* Content */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center min-h-[400px]">
                        <p className="text-gray-400 animate-pulse">Loading data...</p>
                    </div>
                ) : !data ? (
                    <div className="h-full flex items-center justify-center min-h-[400px]">
                        <p className="text-gray-400">Failed to load data</p>
                    </div>
                ) : (
                    <>
                        {activeTab === "shifts" && (
                            <div className="h-[400px] w-full">
                                <h3 className="text-lg font-semibold mb-4 text-center">Shifts per Employee</h3>
                                {data.employeeShifts.length === 0 ? (
                                    <div className="h-full flex items-center justify-center">
                                        <p className="text-gray-400">No shifts recorded this month</p>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                                            <Pie
                                                data={data.employeeShifts as ANY}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name} ${((percent ?? 1) * 100).toFixed(0)}%`}
                                                outerRadius={130}
                                                fill="#8884d8"
                                                dataKey="count"
                                            >
                                                {data.employeeShifts.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        </PieChart>
                                    </ResponsiveContainer>
                                )}
                            </div>
                        )}

                        {activeTab === "weekly" && (
                            <div className="h-[400px] w-full">
                                <h3 className="text-lg font-semibold mb-4 text-center">Weekly Operations</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={data.weeklyStats}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="week" />
                                        <YAxis />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                        <Bar dataKey="events" name="Events" fill="#8884d8" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="attendees" name="Attendees" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="shifts" name="Shifts" fill="#ffc658" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
