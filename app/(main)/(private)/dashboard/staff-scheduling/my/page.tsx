"use client";

import { $getAllEmployees } from "@/actions/employees/getAllEmployees";
import { $getMyShiftsByRange } from "@/actions/shifts/getMyShiftsByRange";
import DeleteConfirmationModal from "@/components/shifts/DeleteConfirmationModal";
import ShiftDetailsModal from "@/components/shifts/ShiftDetailsModal";
import { IShift } from "@/server/models/Shift";
import { ANY } from "@/types";
import type {
    ScheduleGroupBy,
    ScheduleView,
    Shift,
} from "@/types/schedule";
import { AppError } from "@/utils/appError";
import { useQuery } from "@tanstack/react-query";
import { format, parse, startOfWeek } from "date-fns";
import { useMemo, useState } from "react";
import Header from "../Header";
import ScheduleCalendar from "../ScheduleCalendar";

import { $deleteShift } from "@/actions/shifts/deleteShift";
import { useAccountStore } from "@/hooks/stores/accountStore";

export default function MySchedulePage() {
    const account = useAccountStore((s) => s.account);
    const [currentView] = useState<ScheduleView>("my");
    const [groupBy] = useState<ScheduleGroupBy>("employees");

    const [weekStart, setWeekStart] = useState<Date>(() =>
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const weekEnd = useMemo(() => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + 6);
        date.setHours(23, 59, 59, 999);
        return date;
    }, [weekStart]);

    const { data: rawEmployees } = useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await $getAllEmployees();
            if (res instanceof AppError) throw res;
            return res;
        },
    });

    const { data: rawShifts, refetch: refetchShifts } = useQuery({
        queryKey: ["my-shifts", weekStart.toISOString(), weekEnd.toISOString()],
        queryFn: async () => {
            const res = await $getMyShiftsByRange(
                weekStart.toISOString(),
                weekEnd.toISOString()
            );
            if (res instanceof AppError) throw res;
            return res as ANY as IShift[];
        },
    });

    const currentEmployeeId = useMemo(() => {
        if (account?.role !== "employee" || !rawEmployees) return undefined;

        const emp = rawEmployees.find((e: ANY) => e.account?._id === account._id);
        return emp?._id.toString();
    }, [account, rawEmployees]);

    const safeFormatTime = (timeStr: string) => {
        if (!timeStr) return "";
        try {
            const parsed = parse(timeStr, "HH:mm", new Date());
            return format(parsed, "h:mm a");
        } catch {
            return timeStr;
        }
    };

    // Map Data to UI Types
    const mappedData = useMemo(() => {
        if (!rawEmployees || !rawShifts) return { employees: [], shifts: [] };

        const uiShifts: Shift[] = rawShifts.map((s: IShift) => {
            // Calculate duration
            let duration = "0h";
            try {
                const start = parse(s.startTime, "HH:mm", new Date());
                const end = parse(s.endTime, "HH:mm", new Date());

                let diffInMinutes = (end.getTime() - start.getTime()) / 60000;
                if (diffInMinutes < 0) diffInMinutes += 24 * 60; // Handle midnight crossing

                const hours = Math.floor(diffInMinutes / 60);
                const minutes = Math.floor(diffInMinutes % 60);

                if (minutes > 0) {
                    duration = `${hours}h ${minutes}m`;
                } else {
                    duration = `${hours}h`;
                }
            } catch (e) {
                console.error("Error calculating duration", e);
            }

            return {
                _id: s._id.toString(),
                date: format(new Date(s.date), "yyyy-MM-dd"),
                startTime: safeFormatTime(s.startTime),
                endTime: safeFormatTime(s.endTime),
                position: s.position,
                location: s.location || "",
                break: s.break || "None",
                repeat: s.repeat || "Never",
                details: s.details || "",
                hourlyRate: s.hourlyRate,
                totalPay: s.totalPay,
                duration,
                employeeId: s.employee?.toString() || "",
                status: s.status as ANY,
            };
        });

        // Only show current employee in My Schedule
        const currentEmployee = rawEmployees.find((e: ANY) => e.account?._id === account?._id);
        const uiEmployees = currentEmployee ? [{
            _id: currentEmployee._id.toString(),
            fullname: currentEmployee.account?.fullname || currentEmployee.dummyName || "Unnamed",
            jobTitle: currentEmployee.jobTitle || "",
            avatar: currentEmployee.account?.avatar || "",
            hourlyRate: 0,
            totalHours: "0h",
        }] : [];

        return { employees: uiEmployees, shifts: uiShifts };
    }, [rawEmployees, rawShifts, account]);

    const handleWeekChange = (direction: "prev" | "next") => {
        setWeekStart((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
            return startOfWeek(newDate, { weekStartsOn: 1 });
        });
    };

    const handleShiftClick = (shift: Shift) => {
        setSelectedShift(shift);
        setIsDetailsModalOpen(true);
    };

    const handleDeleteClick = (shift: Shift) => {
        setSelectedShift(shift);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedShift) return;

        const res = await $deleteShift(selectedShift._id);
        if (!(res instanceof AppError)) {
            refetchShifts();
            setIsDeleteModalOpen(false);
            setIsDetailsModalOpen(false);
            setSelectedShift(null);
        }
    };

    return (
        <section className="app-container-fluid app-container-fluid-y">
            <Header
                currentView={currentView}
                onViewChange={() => { }}
                groupBy={groupBy}
                onGroupByChange={() => { }}
                weekStart={weekStart}
                onWeekChange={handleWeekChange}
                hideActions={true}
                limitedTabs={true}
                isEmployee={true}
            />

            <ScheduleCalendar
                weekStart={weekStart}
                employees={mappedData.employees}
                shifts={mappedData.shifts}
                onEditShift={handleShiftClick}
                currentEmployeeId={currentEmployeeId}
                hideUnassigned={true}
            />

            <ShiftDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                shift={selectedShift}
                employees={mappedData.employees}
                onEdit={() => { }}
                onDelete={handleDeleteClick}
                currentEmployeeId={currentEmployeeId}
                isEmployee={true}
                onIssueReported={() => refetchShifts()}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Shift"
                message={selectedShift ? `Are you sure you want to delete ${selectedShift.position} on ${format(new Date(selectedShift.date), "MMM d, yyyy")}? This action cannot be undone.` : "Are you sure you want to delete this shift? This action cannot be undone."}
            />
        </section>
    );
}
