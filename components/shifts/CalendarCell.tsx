"use client";

import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import type { Shift } from "@/types/schedule";
import { getShiftClassName } from "@/utils/shiftStyles";
import { cn } from "@/lib/utils";

type CalendarCellProps = {
    shifts: Shift[];
    isAssigned?: boolean;
    onCreateShift?: () => void;
    onEditShift?: (shift: Shift) => void;
    additionalInfo?: React.ReactNode;
    className?: string;
};

export default function CalendarCell({
    shifts,
    isAssigned = false,
    onCreateShift,
    onEditShift,
    additionalInfo,
    className = "",
    currentEmployeeId,
    userRole,
}: CalendarCellProps & { currentEmployeeId?: string; userRole?: string }) {
    const [isHovered, setIsHovered] = useState(false);

    const isEmployee = userRole === 'employee';

    // If employee, disable create on unassigned rows (or all rows if desired, but user said "click on shifts", implying editing)
    // "Employee should not be able to click on shifts that are not for him"
    // Usually employees can't create shifts anyway. I'll disable create for employees globally here.
    const canCreate = !isEmployee && onCreateShift;

    return (
        <div
            className={`flex-1 px-2 py-3 border-l border-gray-200 ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Shift Cards */}
            {shifts.map((shift) => {
                const isMyShift = currentEmployeeId && shift.employeeId === currentEmployeeId;
                const isDisabled = isEmployee && !isMyShift;

                return (
                    <div
                        key={shift._id}
                        onClick={() => !isDisabled && onEditShift?.(shift)}
                        className={`mb-2 p-2 rounded text-xs transition-all ${isAssigned
                            ? getShiftClassName(shift.position, true)
                            : `border-2 border-dashed ${getShiftClassName(shift.position, false)}`
                            } ${isDisabled ? "opacity-60 grayscale cursor-not-allowed select-none" : "cursor-pointer hover:opacity-90"}`}
                    >
                        <div className={`font-medium ${isAssigned ? "text-white" : "text-gray-900"}`}>
                            {shift.startTime} - {shift.endTime} • {shift.duration}
                        </div>
                        <div className={cn(isAssigned ? "text-white/90" : "text-gray-700", "line-clamp-3")}>
                            {shift.position} • {shift.details}
                        </div>
                        {isAssigned && (
                            <>
                                <div className="mt-1 text-white/80">{shift.duration}</div>
                                <div className="font-semibold">${shift.totalPay.toFixed(2)}</div>
                            </>
                        )}
                    </div>
                )
            })}

            {isHovered && canCreate && (
                <button
                    onClick={onCreateShift}
                    className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium mt-2"
                >
                    <LuPlus className="text-lg" />
                </button>
            )}

            {additionalInfo}
        </div>
    );
}
