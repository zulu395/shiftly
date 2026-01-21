

"use client";

import { format } from "date-fns";
import { LuClock, LuMapPin, LuUser, LuCheck } from "react-icons/lu";
import type { ShiftIssue } from "@/types/shift-issues";
import FormButton from "@/components/form/FormButton";
import { useAppActionState } from "@/hooks/useAppActionState";
import { $resolveShiftIssue } from "@/actions/shift-issues/resolveShiftIssue";
import { toast } from "sonner";

type IssueCardProps = {
    issue: ShiftIssue;
    showResolveButton?: boolean;
    onResolveSuccess?: () => void;
};

export default function IssueCard({ issue, showResolveButton = false, onResolveSuccess }: IssueCardProps) {
    const isResolved = issue.status === "resolved";

    const { action, submitting } = useAppActionState($resolveShiftIssue, {
        onSuccess: () => {
            toast.success("Issue resolved successfully");
            onResolveSuccess?.();
        },
    });

    return (
        <div className={`bg-white border rounded-lg p-5 shadow-sm ${isResolved ? "border-green-200 bg-green-50/20" : "border-gray-200"}`}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isResolved
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                            }`}>
                            {issue.reason}
                        </span>
                        {isResolved && (
                            <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                                <LuCheck className="text-sm" />
                                Resolved
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{issue.description}</p>
                </div>
            </div>

            {/* Shift Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3 mb-4 border border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Shift Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                        <LuUser className="text-gray-400" />
                        <span className="font-medium">{issue.shift.position}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                        <LuClock className="text-gray-400" />
                        <span>{format(new Date(issue.shift.date), "MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700 col-span-2">
                        <span className="text-gray-500 w-4 inline-block"></span>
                        <span>{issue.shift.startTime} - {issue.shift.endTime}</span>
                    </div>
                    {issue.shift.location && (
                        <div className="flex items-center gap-2 text-gray-700 col-span-2">
                            <LuMapPin className="text-gray-400" />
                            <span>{issue.shift.location}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-gray-500">
                    <span className="font-medium text-gray-700">Reported by {issue.reportedBy.dummyName}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span>{format(new Date(issue.createdAt), "MMM d, h:mm a")}</span>
                </div>

                {showResolveButton && !isResolved && (
                    <form action={action}>
                        <input type="hidden" name="issueId" value={issue._id} />
                        <FormButton
                            loading={submitting}
                            className="btn btn-primary btn-sm"
                        >
                            Mark Resolved
                        </FormButton>
                    </form>
                )}
            </div>

            {isResolved && issue.resolvedBy && (
                <div className="mt-3 pt-3 border-t border-green-200 text-xs text-green-700 flex items-center justify-between">
                    <span>Resolved by <span className="font-medium">{issue.resolvedBy.fullname}</span></span>
                    <span>{format(new Date(issue.resolvedAt!), "MMM d, h:mm a")}</span>
                </div>
            )}
        </div>
    );
}
