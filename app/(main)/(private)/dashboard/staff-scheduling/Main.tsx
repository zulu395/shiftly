"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Header from "./Header";
import ScheduleCalendar from "./ScheduleCalendar";
import CreateShiftModal from "@/components/shifts/CreateShiftModal";
import EditShiftModal from "@/components/shifts/EditShiftModal";
import ShiftDetailsModal from "@/components/shifts/ShiftDetailsModal";
import DeleteConfirmationModal from "@/components/shifts/DeleteConfirmationModal";
import { format, parse, startOfWeek } from "date-fns";
import type {
    ScheduleView,
    ScheduleGroupBy,
    Shift,
    ShiftStatus
} from "@/types/schedule";
import { $getAllEmployees } from "@/actions/employees/getAllEmployees";
import { $getShiftsByRange } from "@/actions/shifts/getShiftsByRange";
import { AppError } from "@/utils/appError";
import { PopulatedEmployee } from "@/types/employee";
import { IShift } from "@/server/models/Shift";
import { ANY } from "@/types";

import { $deleteShift } from "@/actions/shifts/deleteShift";
import { useAccountStore } from "@/hooks/stores/accountStore";

export default function StaffSchedulingPageMain() {
    const searchParams = useSearchParams();
    const account = useAccountStore((s) => s.account);
    const [currentView, setCurrentView] = useState<ScheduleView>("full");
    const [groupBy, setGroupBy] = useState<ScheduleGroupBy>("employees");

    const [weekStart, setWeekStart] = useState<Date>(() =>
        startOfWeek(new Date(), { weekStartsOn: 1 })
    );

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | undefined>();
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const weekEnd = useMemo(() => {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + 6);
        date.setHours(23, 59, 59, 999);
        return date;
    }, [weekStart]);

    // Extract filters from URL
    const employeeIds = searchParams.get("employees")?.split(",") || [];
    const positions = searchParams.get("positions")?.split(",") || [];
    const status = searchParams.get("status") as "published" | "not-published" | null;

    const { data: rawEmployees, isLoading: loadingEmployees } = useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await $getAllEmployees();
            if (res instanceof AppError) throw res;
            return res;
        },
    });

    const { data: rawShifts, isLoading: loadingShifts, refetch: refetchShifts } = useQuery({
        queryKey: ["shifts", weekStart.toISOString(), employeeIds.join(','), positions.join(','), status],
        queryFn: async () => {
            const filters = {
                employeeIds: employeeIds.length > 0 ? employeeIds : undefined,
                positions: positions.length > 0 ? positions : undefined,
                status: status || undefined,
            };
            const res = await $getShiftsByRange(
                weekStart.toISOString(),
                weekEnd.toISOString(),
                filters
            );
            if (res instanceof AppError) throw res;
            return res as ANY as IShift[];
        },
    });

    // Helpers for time formatting
    const safeFormatTime = (timeStr: string) => {
        try {
            return format(parse(timeStr, "HH:mm", new Date()), "h:mm a");
        } catch {
            return timeStr;
        }
    };

    // Filter Options Calculation
    const filterOptions = useMemo(() => {
        if (!rawEmployees) return { employees: [], positions: [] };

        const empOptions = rawEmployees.map((e: PopulatedEmployee) => ({
            label: e.account?.fullname || e.dummyName || "Unnamed",
            value: e._id.toString(),
        }));

        const posOptions = Array.from(new Set(
            rawEmployees
                .map((e: PopulatedEmployee) => e.jobTitle)
                .filter(Boolean) as string[]
        )).sort();

        return { employees: empOptions, positions: posOptions };
    }, [rawEmployees]);

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
                duration: duration,
                status: s.status as ShiftStatus,
                employeeId: s.employee?.toString(),
            };
        });

        const currentYear = format(weekStart, "yyyy");
        const uiEmployees = rawEmployees
            .map((e: PopulatedEmployee) => {
                const empShifts = uiShifts.filter((s: Shift) => s.employeeId === e._id.toString());
                const totalMinutes = empShifts.reduce((acc: number, s: Shift) => {
                    const match = s.duration.match(/(\d+)\s*(hrs?|h)/i);
                    if (match) return acc + parseInt(match[1]) * 60;
                    return acc;
                }, 0);

                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;

                return {
                    _id: e._id.toString(),
                    fullname: e.account?.fullname || e.dummyName || "Unnamed Employee",
                    hourlyRate: e.hourlyRate || 0,
                    totalHours: `${hours}hr ${minutes}min`,
                };
            })
            // If filters are active, we might still want to show all employees OR just filtered ones?
            // "ScheduleFilter" usually filters the SHIFTS.
            // But if I filter by "Employee: John", should I hide "Jane"? Yes.
            // However, the backend is filtering SHIFTS.
            // If I filter shifts, `uiShifts` will only contain John's shifts.
            // Then `uiEmployees` will naturally show 0 hours/shifts for others.
            // Should I hide employees with 0 shifts?
            // The original logic filtered employees who have shifts in the current year (lines 141-145).
            .filter((e) => {
                return uiShifts.some(
                    (s: Shift) => s.employeeId === e._id && s.date.startsWith(currentYear)
                );
            });

        return { employees: uiEmployees, shifts: uiShifts };
    }, [rawEmployees, rawShifts, weekStart]);

    const handleWeekChange = (direction: "prev" | "next") => {
        setWeekStart((prev) => {
            const newDate = new Date(prev);
            newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
            return newDate;
        });
    };

    const handleCreateShift = (date?: Date, employeeId?: string) => {
        setSelectedDate(date);
        setSelectedEmployeeId(employeeId);
        setIsCreateModalOpen(true);
    };

    const handleShiftClick = (shift: Shift) => {
        setSelectedShift(shift);
        setIsDetailsModalOpen(true);
    };

    const handleEditFromDetails = () => {
        setIsDetailsModalOpen(false);
        setIsEditModalOpen(true);
    };

    const handleDeleteFromDetails = () => {
        setIsDetailsModalOpen(false);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedShift) {
            await $deleteShift(selectedShift._id);
            refetchShifts();
        }
        setIsDeleteModalOpen(false);
        setSelectedShift(null);
    };

    const currentEmployeeId = useMemo(() => {
        if (account?.role !== "employee" || !rawEmployees) return undefined;

        const emp = rawEmployees.find((e: ANY) => e.account?._id === account._id);
        return emp?._id.toString();
    }, [account, rawEmployees]);

    if (loadingEmployees || loadingShifts) {
        return (
            <div className="flex h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium italic animate-pulse">Loading schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <section className="app-container-fluid app-container-fluid-y">
                <Header
                    currentView={currentView}
                    onViewChange={setCurrentView}
                    groupBy={groupBy}
                    onGroupByChange={setGroupBy}
                    weekStart={weekStart}
                    onWeekChange={handleWeekChange}
                    onCreateShift={() => handleCreateShift()}
                    employees={filterOptions.employees}
                    positions={filterOptions.positions}
                    limitedTabs={true}
                    hideActions={account?.role === "employee"}
                    isEmployee={account?.role === "employee"}
                />

                <ScheduleCalendar
                    employees={mappedData.employees}
                    shifts={mappedData.shifts}
                    weekStart={weekStart}
                    onCreateShift={handleCreateShift}
                    onEditShift={handleShiftClick}
                    currentEmployeeId={currentEmployeeId}
                    userRole={account?.role}
                />
            </section>

            <CreateShiftModal
                isOpen={isCreateModalOpen}
                onClose={() => {
                    setIsCreateModalOpen(false);
                    setSelectedEmployeeId(undefined);
                    refetchShifts();
                }}
                initialDate={selectedDate}
                employeeId={selectedEmployeeId}
            />

            <ShiftDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                shift={selectedShift}
                employees={mappedData.employees}
                onEdit={handleEditFromDetails}
                onDelete={handleDeleteFromDetails}
                currentEmployeeId={currentEmployeeId}
                isEmployee={account?.role === "employee"}
                onIssueReported={() => refetchShifts()}
            />

            <EditShiftModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedShift(null);
                    refetchShifts();
                }}
                shift={selectedShift}
            />

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedShift(null);
                }}
                onConfirm={handleConfirmDelete}
            />
        </>
    );
}
