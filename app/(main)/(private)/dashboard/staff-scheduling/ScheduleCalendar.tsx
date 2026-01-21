"use client";

import type { Employee, Shift } from "@/types/schedule";
import { format, addDays, parse } from "date-fns";
import AssignedShiftsSection from "@/components/shifts/AssignedShiftsSection";
import CalendarCell from "@/components/shifts/CalendarCell";

type ScheduleCalendarProps = {
    employees: Employee[];
    shifts: Shift[];
    weekStart: Date;
    onCreateShift?: (date?: Date, employeeId?: string) => void;
    onEditShift?: (shift: Shift) => void;
    hideUnassigned?: boolean;
};

export default function ScheduleCalendar({
    employees,
    shifts,
    weekStart,
    onCreateShift,
    onEditShift,
    currentEmployeeId,
    userRole,
    hideUnassigned = false,
}: ScheduleCalendarProps & { currentEmployeeId?: string; userRole?: string }) {
    // Generate week days array
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const formatDate = (date: Date) => format(date, "yyyy-MM-dd");
    const getDayName = (date: Date) => format(date, "EEE").toUpperCase();
    const getDayNumber = (date: Date) => format(date, "d");

    const getUnassignedShiftsForDate = (date: string) => {
        return shifts.filter(
            (shift) => shift.date === date && shift.status === "unassigned"
        );
    };

    const getHoursWorked = (date: string) => {
        const dayShifts = shifts.filter(
            (s) => s.date === date && s.status === "assigned"
        );
        const totalHours = dayShifts.reduce((acc, shift) => {
            const hours = parseInt(shift.duration);
            return acc + (isNaN(hours) ? 0 : hours);
        }, 0);
        return totalHours > 0 ? `${totalHours}h` : "0h";
    };

    const handleCreateShift = (date: string, employeeId?: string) => {
        const parsedDate = parse(date, "yyyy-MM-dd", new Date());
        onCreateShift?.(parsedDate, employeeId);
    };

    return (
        <div className="schedule-calendar mt-6 border border-gray-200 rounded-lg overflow-hidden flex flex-col">
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
                <div className="flex">
                    <div className="w-48 px-4 py-3 bg-gray-50 border-r border-gray-200 flex items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Schedule</span>
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

            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
                {!hideUnassigned && (
                    <div className="border-b border-gray-200">
                        <div className="flex bg-blue-50/20">
                            <div className="w-48 px-4 py-3 border-r border-gray-100 flex items-center">
                                <h3 className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                                    UNASSIGNED
                                </h3>
                            </div>
                            <div className="flex-1 flex min-h-[140px]">
                                {weekDays.map((day, index) => {
                                    const dateStr = formatDate(day);
                                    const dayShifts = getUnassignedShiftsForDate(dateStr);
                                    const hoursWorked = getHoursWorked(dateStr);

                                    return (
                                        <CalendarCell
                                            key={index}
                                            shifts={dayShifts}
                                            isAssigned={false}
                                            onCreateShift={() => handleCreateShift(dateStr)}
                                            onEditShift={onEditShift}
                                            currentEmployeeId={currentEmployeeId}
                                            userRole={userRole}
                                            className="bg-transparent border-r border-gray-100 last:border-r-0"
                                            additionalInfo={
                                                <div className="text-xs text-blue-600/60 font-medium mt-2">
                                                    {hoursWorked}
                                                </div>
                                            }
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <AssignedShiftsSection
                    employees={employees}
                    shifts={shifts}
                    weekDays={weekDays}
                    onCreateShift={handleCreateShift}
                    onEditShift={onEditShift}
                    currentEmployeeId={currentEmployeeId}
                    userRole={userRole}
                />
            </div>
        </div>
    );
}
