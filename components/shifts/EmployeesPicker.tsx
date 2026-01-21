"use client";

import { useQuery } from "@tanstack/react-query";
import { $getAllEmployees } from "@/actions/employees/getAllEmployees";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState, useMemo } from "react";
import { LuSearch, LuCheck } from "react-icons/lu";
import Avatar from "../common/Avatar";
import { cn } from "@/lib/utils";
import { AppError } from "@/utils/appError";

type EmployeesPickerProps = {
    value: string[];
    onChange: (ids: string[]) => void;
    error?: string[];
};

export default function EmployeesPicker({ value, onChange, error }: EmployeesPickerProps) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const { data: employees, isLoading } = useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await $getAllEmployees();
            if (res instanceof AppError) throw res;
            return res;
        },
    });

    const filteredEmployees = useMemo(() => {
        if (!employees) return [];
        return employees.filter((emp) => {
            const name = emp.account?.fullname || emp.dummyName || "";
            return name.toLowerCase().includes(search.toLowerCase());
        });
    }, [employees, search]);

    const selectedEmployees = useMemo(() => {
        if (!employees) return [];
        return employees.filter((emp) => value.includes(emp._id.toString()));
    }, [employees, value]);

    const toggleEmployee = (id: string) => {
        if (value.includes(id)) {
            onChange(value.filter((v) => v !== id));
        } else {
            onChange([...value, id]);
        }
    };

    return (
        <div className="grid gap-1">
            <label className="inline-block pb-1 text-black-300 text-label">
                Employees
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "flex items-center gap-2 w-full px-4 py-2 border rounded-xl text-left min-h-[44px] transition-colors",
                            error ? "bg-red-100 border-red-200" : "bg-white border-gray-200 hover:border-brand-primary/50"
                        )}
                    >
                        {selectedEmployees.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                                {selectedEmployees.map((emp) => (
                                    <span key={emp._id.toString()} className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-lg text-xs font-medium border border-brand-primary/20">
                                        {emp.account?.fullname || emp.dummyName}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <span className="text-gray-400">Select employees...</span>
                        )}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <div className="p-3 border-b flex items-center gap-2">
                        <LuSearch className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="w-full outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto p-1">
                        {isLoading ? (
                            <div className="p-4 text-center text-sm text-gray-500 italic font-medium">
                                Loading employees...
                            </div>
                        ) : filteredEmployees.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">
                                No employees found
                            </div>
                        ) : (
                            filteredEmployees.map((emp) => {
                                const id = emp._id.toString();
                                const isSelected = value.includes(id);
                                const name = emp.account?.fullname || emp.dummyName;
                                const email = emp.account?.email || emp.dummyEmail;
                                return (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => toggleEmployee(id)}
                                        className="flex items-center gap-3 w-full p-2 hover:bg-brand-primary/5 rounded-lg transition-colors text-left group"
                                    >
                                        <div className="shrink-0">
                                            <Avatar src="" alt={name} size={32} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                {name}
                                            </p>
                                            <p className="text-xs text-gray-500 truncate">
                                                {emp.jobTitle || email}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center text-white scale-90">
                                                <LuCheck size={14} strokeWidth={3} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </PopoverContent>
            </Popover>
            {error && <p className="text-red-600 text-xs font-medium mt-1">{error[0]}</p>}
        </div>
    );
}
