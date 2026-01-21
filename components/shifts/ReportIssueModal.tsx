"use client";

import { useState } from "react";
import { SHIFT_ISSUE_REASONS } from "@/types/shift-issues";
import type { Shift } from "@/types/schedule";
import AppSelect from "@/components/form/AppSelect";
import FormButton from "@/components/form/FormButton";
import { $createShiftIssue } from "@/actions/shift-issues/createShiftIssue";
import { useAppActionState } from "@/hooks/useAppActionState";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type ReportIssueModalProps = {
    isOpen: boolean;
    onClose: () => void;
    shift: Shift | null;
    onSuccess?: () => void;
};

export default function ReportIssueModal({
    isOpen,
    onClose,
    shift,
    onSuccess,
}: ReportIssueModalProps) {
    const [reason, setReason] = useState("");
    const [description, setDescription] = useState("");

    const { action, state, submitting, formKey } = useAppActionState($createShiftIssue, {
        onSuccess: () => {
            toast.success("Issue reported successfully");
            setReason("");
            setDescription("");
            onSuccess?.();
            onClose();
        },
    });

    if (!shift) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Report Shift Issue</DialogTitle>
                </DialogHeader>

                <form action={action} key={formKey} className="space-y-6 py-2">
                    {/* Shift Details (Read-only) */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold text-gray-900 mb-3">Shift Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Position:</span>
                                <p className="font-medium text-gray-900">{shift.position}</p>
                            </div>
                            <div>
                                <span className="text-gray-500">Date:</span>
                                <p className="font-medium text-gray-900">
                                    {format(new Date(shift.date), "MMM d, yyyy")}
                                </p>
                            </div>
                            <div>
                                <span className="text-gray-500">Time:</span>
                                <p className="font-medium text-gray-900">
                                    {shift.startTime} - {shift.endTime}
                                </p>
                            </div>
                            {shift.location && (
                                <div>
                                    <span className="text-gray-500">Location:</span>
                                    <p className="font-medium text-gray-900">{shift.location}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Hidden shift ID */}
                    <input type="hidden" name="shiftId" value={shift._id} />

                    {/* Issue Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Issue Reason <span className="text-red-500">*</span>
                        </label>
                        <AppSelect
                            name="reason"
                            value={reason}
                            onChange={setReason}
                            options={SHIFT_ISSUE_REASONS.map((r) => ({
                                title: r,
                                value: r,
                            }))}
                            placeholder="Select a reason"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-transparent resize-none"
                            placeholder="Please provide details about the issue..."
                            minLength={10}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Minimum 10 characters
                        </p>
                    </div>

                    {state.error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {state.error}
                        </div>
                    )}

                    {/* Actions */}
                    <DialogFooter>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <FormButton
                            loading={submitting}
                            className="btn btn-primary text-sm font-medium"
                        >
                            Report Issue
                        </FormButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
