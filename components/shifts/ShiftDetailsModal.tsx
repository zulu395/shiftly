"use client";

import { useMemo, useState } from "react";
import {
    LuFileText,
    LuTrash2,
    LuPenLine,
    LuInfo
} from "react-icons/lu";
import { format } from "date-fns";
import type { Employee, Shift } from "@/types/schedule";
import ReportIssueModal from "./ReportIssueModal";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type ShiftDetailsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    shift: Shift | null;
    employees: Employee[];
    onEdit: (shift: Shift) => void;
    onDelete: (shift: Shift) => void;
    currentEmployeeId?: string;
    isEmployee?: boolean;
    onIssueReported?: () => void;
};

export default function ShiftDetailsModal({
    isOpen,
    onClose,
    shift,
    employees,
    onEdit,
    onDelete,
    currentEmployeeId,
    isEmployee = false,
    onIssueReported,
}: ShiftDetailsModalProps) {
    const [isReportIssueOpen, setIsReportIssueOpen] = useState(false);

    const employeeName = useMemo(() => {
        if (!shift?.employeeId) return "Unassigned";
        const emp = employees.find((e) => e._id === shift.employeeId);
        return emp ? emp.fullname : "Unknown Employee";
    }, [shift, employees]);

    // Check if this shift is assigned to the current employee
    const isOwnShift = useMemo(() => {
        return shift?.employeeId === currentEmployeeId;
    }, [shift, currentEmployeeId]);

    if (!isOpen || !shift) return null;

    // Formatting helpers
    const formatDate = (dateStr: string) => {
        try {
            return format(new Date(dateStr), "EEEE, MMM d, yyyy");
        } catch {
            return dateStr;
        }
    };

    const formatTimeFull = (startTime: string, endTime: string, duration: string) => {
        return `${startTime} - ${endTime} • ${duration}`;
    };

    const handleReportIssue = () => {
        setIsReportIssueOpen(true);
    };

    if (!shift) return null;

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader className="flex-row items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <LuFileText className="text-xl" />
                            </div>
                            <DialogTitle className="text-lg font-semibold text-gray-900">Shift Details</DialogTitle>
                        </div>
                        <div className="flex items-center gap-2">
                            {!isEmployee && (
                                <button
                                    onClick={() => onDelete(shift)}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Shift"
                                >
                                    <LuTrash2 className="text-xl" />
                                </button>
                            )}
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="space-y-4 py-2">
                        {/* Employee */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Assigned To
                            </label>
                            <p className="mt-1 text-gray-900 font-medium">{employeeName}</p>
                        </div>

                        {/* Position */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Position
                            </label>
                            <p className="mt-1 text-gray-900 font-medium">{shift.position}</p>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Date
                            </label>
                            <p className="mt-1 text-gray-900">{formatDate(shift.date)}</p>
                        </div>

                        {/* Time */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Time
                            </label>
                            <p className="mt-1 text-gray-900">
                                {formatTimeFull(shift.startTime, shift.endTime, shift.duration)}
                            </p>
                        </div>

                        {/* Location */}
                        {shift.location && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Location
                                </label>
                                <p className="mt-1 text-gray-900">{shift.location}</p>
                            </div>
                        )}

                        {/* Break */}
                        {shift.break && shift.break !== "None" && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Break
                                </label>
                                <p className="mt-1 text-gray-900">{shift.break}</p>
                            </div>
                        )}

                        {/* Notes */}
                        {shift.details && (
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Notes
                                </label>
                                <p className="mt-1 text-gray-700 text-sm">{shift.details}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <DialogFooter className="border-t pt-4">
                        {isEmployee && isOwnShift ? (
                            <button
                                onClick={handleReportIssue}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                            >
                                <LuInfo className="text-lg" />
                                Report Issue
                            </button>
                        ) : !isEmployee ? (
                            <button
                                onClick={() => onEdit(shift)}
                                className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-brand-primary/90 transition-colors font-medium"
                            >
                                <LuPenLine className="text-lg" />
                                Edit Shift
                            </button>
                        ) : null}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ReportIssueModal
                isOpen={isReportIssueOpen}
                onClose={() => setIsReportIssueOpen(false)}
                shift={shift}
                onSuccess={onIssueReported}
            />
        </>
    );
}
