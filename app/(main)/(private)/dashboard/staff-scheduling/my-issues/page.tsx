"use client";

import { useQuery } from "@tanstack/react-query";
import { $getShiftIssues } from "@/actions/shift-issues/getShiftIssues";
import { AppError } from "@/utils/appError";
import IssueCard from "@/components/shifts/IssueCard";
import type { ShiftIssue } from "@/types/shift-issues";
import Header from "../Header";

export default function MyIssuesPage() {
    const { data: issues } = useQuery({
        queryKey: ["my-shift-issues"],
        queryFn: async () => {
            const res = await $getShiftIssues();
            if (res instanceof AppError) throw res;
            return res as unknown as ShiftIssue[];
        },
    });

    const pendingIssues = issues?.filter((i) => i.status === "pending") || [];
    const resolvedIssues = issues?.filter((i) => i.status === "resolved") || [];

    const date = new Date(); // Current date for weekStart prop

    return (
        <section className="app-container-fluid app-container-fluid-y">
            <Header
                currentView="my" // Dummy value
                onViewChange={() => { }}
                groupBy="employees" // Dummy value
                onGroupByChange={() => { }}
                weekStart={date}
                onWeekChange={() => { }}
                hideActions={true}
                limitedTabs={true}
                isEmployee={true}
            />

            <div className="mb-6 mt-8">
                <h1 className="text-2xl font-bold text-gray-900">My Reported Issues</h1>
                <p className="text-gray-600 mt-1">Track the status of your reported shift issues</p>
            </div>

            {/* Pending Issues */}
            {pendingIssues.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Pending ({pendingIssues.length})
                    </h2>
                    <div className="space-y-4">
                        {pendingIssues.map((issue) => (
                            <IssueCard key={issue._id} issue={issue} />
                        ))}
                    </div>
                </div>
            )}

            {/* Resolved Issues */}
            {resolvedIssues.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Resolved ({resolvedIssues.length})
                    </h2>
                    <div className="space-y-4">
                        {resolvedIssues.map((issue) => (
                            <IssueCard key={issue._id} issue={issue} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {issues && issues.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">You haven&apos;t reported any issues yet</p>
                </div>
            )}
        </section>
    );
}
