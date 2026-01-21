"use client";

import { LuPlus, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import type { ScheduleView, ScheduleGroupBy } from "@/types/schedule";
import { format, addDays } from "date-fns";
import ScheduleFilter from "@/components/shifts/ScheduleFilter";
import Link from "next/link";
import { paths } from "@/utils/paths";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

type HeaderProps = {
    currentView: ScheduleView;
    onViewChange: (view: ScheduleView) => void;
    groupBy: ScheduleGroupBy;
    onGroupByChange: (groupBy: ScheduleGroupBy) => void;
    weekStart: Date;
    onWeekChange: (direction: "prev" | "next") => void;
    onCreateShift?: () => void;

    // Filter props
    employees?: { label: string; value: string }[];
    positions?: string[];

    // Control props
    hideActions?: boolean;
    limitedTabs?: boolean;
    isEmployee?: boolean;
};

export default function Header({
    weekStart,
    onWeekChange,
    onCreateShift,
    employees = [],
    positions = [],
    hideActions = false,
    limitedTabs = false,
    isEmployee = false,
}: HeaderProps) {
    const pathname = usePathname();

    const formatDateRange = (start: Date) => {
        const end = addDays(start, 6);

        const startMonth = format(start, "MMM yyyy");
        const startDay = format(start, "d");
        const endMonth = format(end, "MMM yyyy");
        const endDay = format(end, "d");

        if (startMonth === endMonth) {
            return `${startDay} - ${endDay} ${startMonth}`;
        }
        return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    };

    const allTabs: { href: string; label: string }[] = [
        { href: paths.dashboardStaffScheduling, label: "Full Schedule" },

    ];

    // Add Issues tab based on role
    const issuesTab = isEmployee
        ? { href: paths.dashboardStaffSchedulingMyIssues, label: "My Issues" }
        : { href: paths.dashboardStaffSchedulingIssues, label: "Issues" };

    const tabsWithIssues = [...allTabs, ...(isEmployee ? [{ href: paths.dashboardStaffSchedulingMy, label: "My Schedule" }] : [{ href: paths.dashboardStaffSchedulingAvailability, label: "Availability" }]), issuesTab];

    const tabs = limitedTabs ? tabsWithIssues.slice(0, 3) : tabsWithIssues;

    return (
        <div className="flex flex-col gap-4">
            {/* Tabs */}
            <div className="flex items-center justify-between gap-4 border-b border-gray-200">
                <div className="flex gap-6">
                    {tabs.map((tab) => {
                        const isActive = pathname === tab.href;
                        return (
                            <Link
                                key={tab.href}
                                href={tab.href}
                                className={`pb-3 px-1 text-sm font-medium transition-colors relative ${isActive
                                    ? "text-brand-primary"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}
                                {isActive && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Filters and Actions */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    {/* Week Navigation */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onWeekChange("prev")}
                            className="p-1.5 hover:bg-gray-100 rounded"
                        >
                            <LuChevronLeft className="w-4 h-4" />
                        </button>
                        <p className="font-semibold"> {formatDateRange(weekStart)}</p>
                        <button
                            onClick={() => onWeekChange("next")}
                            className="p-1.5 hover:bg-gray-100 rounded"
                        >
                            <LuChevronRight className="w-4 h-4" />
                        </button>
                    </div>



                </div>

                {/* Create Shift Button */}
                {!hideActions && (
                    <div className="flex items-center gap-3">
                        <Suspense>

                            <ScheduleFilter employees={employees} positions={positions} />
                        </Suspense>

                        <button
                            onClick={onCreateShift}
                            className="btn btn-primary py-2! px-4! flex items-center gap-2"
                        >
                            <LuPlus className="w-4 h-4" />
                            <span>Create Shift</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
