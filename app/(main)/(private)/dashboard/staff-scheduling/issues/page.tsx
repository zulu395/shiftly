"use client";

import { $getShiftIssues } from "@/actions/shift-issues/getShiftIssues";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import AppSelect from "@/components/form/AppSelect";
import IssueCard from "@/components/shifts/IssueCard";
import { ANY } from "@/types";
import type { ShiftIssue } from "@/types/shift-issues";
import { AppError } from "@/utils/appError";
import Header from "../Header";

export default function IssuesPage() {
    const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all");

    const { data: issues, refetch } = useQuery({
        queryKey: ["shift-issues"],
        queryFn: async () => {
            const res = await $getShiftIssues();
            if (res instanceof AppError) throw res;
            return res as unknown as ShiftIssue[];
        },
    });



    const filteredIssues = issues?.filter((issue) => {
        if (filter === "all") return true;
        return issue.status === filter;
    }) || [];

    const date = new Date(); // Current date for weekStart prop

    return (
        <section className="app-container-fluid app-container-fluid-y">
            <Header
                currentView="full" // Dummy value as view is handled by page route
                onViewChange={() => { }}
                groupBy="employees" // Dummy value
                onGroupByChange={() => { }}
                weekStart={date}
                onWeekChange={() => { }}
                hideActions={true}
                limitedTabs={true}
            />

            <div className="flex items-center justify-between mb-6 mt-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shift Issues</h1>
                    <p className="text-gray-600 mt-1">View and resolve reported shift issues</p>
                </div>

                <div className="w-[200px]">
                    <AppSelect
                        name="filter"
                        value={filter}
                        onChange={(val) => setFilter(val as ANY)}
                        options={[
                            { title: "All Issues", value: "all" },
                            { title: "Pending", value: "pending" },
                            { title: "Resolved", value: "resolved" },
                        ]}
                    />
                </div>
            </div>

            {/* Issues List */}
            <div className="space-y-4">
                {filteredIssues.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No {filter !== "all" ? filter : ""} issues found</p>
                    </div>
                ) : (
                    filteredIssues.map((issue) => (
                        <IssueCard
                            key={issue._id}
                            issue={issue}
                            onResolveSuccess={() => refetch()}
                            showResolveButton={true}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
