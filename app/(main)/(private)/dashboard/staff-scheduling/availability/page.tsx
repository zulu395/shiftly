"use client";

import { $getEmployeesAndAvailability } from "@/actions/availability";
import { ScheduleGroupBy } from "@/types/schedule";
import { AppError } from "@/utils/appError";
import { useQuery } from "@tanstack/react-query";
import { startOfWeek } from "date-fns";
import { useState } from "react";
import AvailabilityCalendar from "../AvailabilityCalendar";
import Header from "../Header";

export default function AvailabilityPage() {
    const [groupBy] = useState<ScheduleGroupBy>("employees");

    const [weekStart, setWeekStart] = useState<Date>(() =>
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    const { data: availabilityData, isLoading } = useQuery({
        queryKey: ["availability"],
        queryFn: async () => {
            const res = await $getEmployeesAndAvailability();
            if (res instanceof AppError) throw res;
            return res;
        },
    });

    const handleWeekChange = (direction: "prev" | "next") => {
        setWeekStart((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
            return startOfWeek(newDate, { weekStartsOn: 1 });
        });
    };

    return (
        <section className="app-container-fluid app-container-fluid-y h-full flex flex-col">
            <Header
                currentView={"availability"}
                onViewChange={() => { }}
                groupBy={groupBy}
                onGroupByChange={() => { }}
                weekStart={weekStart}
                onWeekChange={handleWeekChange}
                hideActions={true}
                limitedTabs={false}
                isEmployee={false}
            />

            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                {isLoading ? (
                    <div className="flex items-center justify-center p-12">
                        <span className="loading loading-spinner loading-lg text-brand-primary"></span>
                    </div>
                ) : (
                    <AvailabilityCalendar
                        data={availabilityData || []}
                        weekStart={weekStart}
                    />
                )}
            </div>
        </section>
    );
}
