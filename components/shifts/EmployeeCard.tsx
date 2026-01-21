"use client";

import type { Employee } from "@/types/schedule";
import Avatar from "../common/Avatar";

type EmployeeCardProps = {
    employee: Employee;
};

export default function EmployeeCard({ employee }: EmployeeCardProps) {
    // Get initials from employee name
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="flex items-start gap-3">
            <Avatar alt={getInitials(employee.fullname)} />
            <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">
                    {employee.fullname}
                </div>
                <div className="text-xs text-gray-500">
                    {employee.totalHours} ~ ${employee.hourlyRate?.toFixed(2) || "0.00"}
                </div>
            </div>
        </div>
    );
}
