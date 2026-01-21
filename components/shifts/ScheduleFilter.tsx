"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ANY } from "@/types";
import { LuFilter, LuCheck } from "react-icons/lu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type FilterOption = {
    label: string;
    value: string;
};

type ScheduleFilterProps = {
    employees: FilterOption[];
    positions: string[];
};

export default function ScheduleFilter({ employees, positions }: ScheduleFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [open, setOpen] = useState(false);

    // State for filters
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedPositions, setSelectedPositions] = useState<string[]>([]);
    const [status, setStatus] = useState<"all" | "published" | "not-published">("all");

    // Initialize from URL
    useEffect(() => {
        const empParam = searchParams.get("employees");
        const posParam = searchParams.get("positions");
        const statusParam = searchParams.get("status");

        requestAnimationFrame(() => {

            if (empParam) setSelectedEmployees(empParam.split(","));
            if (posParam) setSelectedPositions(posParam.split(","));
            if (statusParam === "published" || statusParam === "not-published") {
                setStatus(statusParam as ANY);
            } else {
                setStatus("all");
            }
        })
    }, [searchParams, open]);

    const handleApply = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedEmployees.length > 0) {
            params.set("employees", selectedEmployees.join(","));
        } else {
            params.delete("employees");
        }

        if (selectedPositions.length > 0) {
            params.set("positions", selectedPositions.join(","));
        } else {
            params.delete("positions");
        }

        if (status !== "all") {
            params.set("status", status);
        } else {
            params.delete("status");
        }

        router.push(`?${params.toString()}`);
        setOpen(false);
    };

    const handleClear = () => {
        setSelectedEmployees([]);
        setSelectedPositions([]);
        setStatus("all");
    };

    const toggleEmployee = (id: string) => {
        setSelectedEmployees((prev) =>
            prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
        );
    };

    const togglePosition = (pos: string) => {
        setSelectedPositions((prev) =>
            prev.includes(pos) ? prev.filter((p) => p !== pos) : [...prev, pos]
        );
    };

    const activeFilterCount =
        selectedEmployees.length +
        selectedPositions.length +
        (status !== "all" ? 1 : 0);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className={cn(
                        "flex items-center gap-2 text-sm px-3 py-2 border rounded-md transition-colors",
                        activeFilterCount > 0
                            ? "bg-brand-primary/10 border-brand-primary text-brand-primary font-medium"
                            : "border-gray-300 hover:bg-gray-50 text-gray-700"
                    )}
                >
                    <LuFilter className="w-4 h-4" />
                    <span>Filter</span>
                    {activeFilterCount > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 text-[10px] bg-brand-primary text-white rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                    <h4 className="font-semibold text-sm">Filters</h4>
                    {activeFilterCount > 0 && (
                        <button
                            onClick={handleClear}
                            className="text-xs text-red-500 hover:text-red-600 font-medium"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <div className="p-4 space-y-5 max-h-[60vh] overflow-y-auto">
                    {/* Employees */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Employees
                        </label>
                        <div className="space-y-1">
                            {employees.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No employees found</p>
                            ) : (
                                employees.map((emp) => (
                                    <label
                                        key={emp.value}
                                        className="flex items-center gap-2 text-sm p-1.5 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                selectedEmployees.includes(emp.value)
                                                    ? "bg-brand-primary border-brand-primary text-white"
                                                    : "border-gray-300 bg-white"
                                            )}
                                        >
                                            {selectedEmployees.includes(emp.value) && (
                                                <LuCheck className="w-3 h-3" />
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedEmployees.includes(emp.value)}
                                            onChange={() => toggleEmployee(emp.value)}
                                        />
                                        <span className="truncate">{emp.label}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Positions */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Positions
                        </label>
                        <div className="space-y-1">
                            {positions.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">No positions found</p>
                            ) : (
                                positions.map((pos) => (
                                    <label
                                        key={pos}
                                        className="flex items-center gap-2 text-sm p-1.5 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                        <div
                                            className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                selectedPositions.includes(pos)
                                                    ? "bg-brand-primary border-brand-primary text-white"
                                                    : "border-gray-300 bg-white"
                                            )}
                                        >
                                            {selectedPositions.includes(pos) && (
                                                <LuCheck className="w-3 h-3" />
                                            )}
                                        </div>
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={selectedPositions.includes(pos)}
                                            onChange={() => togglePosition(pos)}
                                        />
                                        <span className="truncate">{pos}</span>
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                        </label>
                        <div className="flex gap-2">
                            {(["all", "published", "not-published"] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    className={cn(
                                        "px-3 py-1.5 text-xs rounded-full border transition-colors",
                                        status === s
                                            ? "bg-brand-primary text-white border-brand-primary"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    )}
                                >
                                    {s === "all"
                                        ? "All"
                                        : s === "published"
                                            ? "Published"
                                            : "Not Published"}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
                    <button
                        onClick={handleApply}
                        className="btn btn-primary w-full py-2 text-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
