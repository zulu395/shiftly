"use client";

import type { Employee, Shift } from "@/types/schedule";
import { format } from "date-fns";
import EmployeeCard from "./EmployeeCard";
import CalendarCell from "./CalendarCell";

import { IAvailability } from "@/server/models/Availability";
// We need to be careful importing IAvailability in client component if it imports Mongoose. 
// Usually interfaces are fine. If it fails, I'll extract interface.

type AssignedShiftsSectionProps = {
    employees: Employee[];
    shifts: Shift[];
    weekDays: Date[];
    availabilities?: { employeeId: string; availability: IAvailability | null }[];
    onCreateShift?: (date: string, employeeId?: string) => void;
    onEditShift?: (shift: Shift) => void;
};

export default function AssignedShiftsSection({
    employees,
    shifts,
    weekDays,
    availabilities,
    onCreateShift,
    onEditShift,
    currentEmployeeId,
    userRole,
}: AssignedShiftsSectionProps & { currentEmployeeId?: string; userRole?: string }) {
    const formatDate = (date: Date) => format(date, "yyyy-MM-dd");

    const getShiftsForDate = (date: string, employeeId: string) => {
        return shifts.filter(
            (shift) => shift.date === date && shift.employeeId === employeeId
        );
    };

    return (
        <div className="bg-white">
            <div className="flex border-b border-gray-200 bg-blue-50/10">
                <div className="w-48 px-4 py-3 border-r border-gray-100 flex items-center">
                    <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                        ASSIGNED
                    </h3>
                </div>
                <div className="flex-1"></div>
            </div>

            {employees.map((employee) => (
                <div key={employee._id} className="border-b border-gray-100 last:border-b-0">
                    <div className="flex group hover:bg-gray-50/50 transition-colors">
                        <div className="w-48 px-4 py-4 border-r border-gray-100 flex-shrink-0 flex items-center bg-white group-hover:bg-gray-50/80 transition-colors">
                            <EmployeeCard employee={employee} />
                        </div>
                        <div className="flex-1 flex bg-white group-hover:bg-gray-50/30 transition-colors">
                            {weekDays.map((day, index) => {
                                const dateStr = formatDate(day);
                                const employeeShifts = getShiftsForDate(dateStr, employee._id);

                                const dayName = format(day, "EEEE");
                                const empAvailability = availabilities?.find(a => a.employeeId === employee._id)?.availability;
                                const dayConfig = empAvailability?.days?.find(d => d.day === dayName);

                                const availabilityStatus = dayConfig ? {
                                    isAvailable: dayConfig.isAvailable,
                                    label: dayConfig.isAvailable ? `${dayConfig.startTime}-${dayConfig.endTime}` : undefined
                                } : undefined;

                                return (
                                    <CalendarCell
                                        key={index}
                                        shifts={employeeShifts}
                                        isAssigned={true}
                                        availability={availabilityStatus}
                                        onCreateShift={
                                            onCreateShift
                                                ? () => onCreateShift(dateStr, employee._id)
                                                : undefined
                                        }
                                        onEditShift={onEditShift}
                                        currentEmployeeId={currentEmployeeId}
                                        userRole={userRole}
                                        className="border-r border-gray-100 last:border-r-0 hover:bg-white/60 transition-colors"
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
