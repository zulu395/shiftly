"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LuSearch, LuX, LuUser } from "react-icons/lu";
import { toast } from "sonner";
import { PopulatedEmployee } from "@/types/employee";
import { $getAllEmployees } from "@/actions/employees/getAllEmployees";
import { $createConversation } from "@/actions/conversations/create";
import { AppError } from "@/utils/appError";
import { useQuery } from "@tanstack/react-query";
import { useAccountStore } from "@/hooks/stores/accountStore";
import { ANY } from "@/types";

interface NewConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NewConversationModal({ isOpen, onClose }: NewConversationModalProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const { data: employees } = useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const res = await $getAllEmployees();
            if (res instanceof AppError) return [];
            return res.filter(e => !!e.account);
        },
        enabled: isOpen,
    });

    const account = useAccountStore(s => s.account);

    const filteredEmployees = (() => {
        let list = employees || [];

        // Remove current user
        if (account?._id) {
            list = list.filter(e => e.account?._id !== account._id);
        }

        // Add Company if user is employee
        if (employees && employees.length > 0 && account?.role === 'employee') {
            const company = employees[0].company;
            // Create a fake employee entry for the company
            const companyEntry: ANY = {
                _id: "company_chat", // Special ID
                account: {
                    _id: company._id,
                    fullname: company.companyName || company.fullname || "Company Support",
                },
                dummyName: company.companyName || company.fullname,
                jobTitle: "Company Management",
                isCompany: true
            };

            // Check if company matches search
            const name = companyEntry.account.fullname || "";
            if (name.toLowerCase().includes(search.toLowerCase())) {
                const matchesSearch = list.filter((emp) => {
                    const name = emp.account?.fullname || emp.dummyName || "";
                    return name.toLowerCase().includes(search.toLowerCase());
                });
                return [companyEntry, ...matchesSearch];
            }
        }

        return list.filter((emp) => {
            const name = emp.account?.fullname || emp.dummyName || "";
            return name.toLowerCase().includes(search.toLowerCase());
        });
    })();

    const handleSelect = async (employee: PopulatedEmployee) => {
        // Need account ID to start conversation
        const accountId = employee.account?._id;
        if (!accountId) {
            toast.error("This employee has no linked account");
            return;
        }

        setLoading(true);
        try {
            const res = await $createConversation(accountId.toString());
            if (res instanceof AppError) {
                toast.error(res.message);
            } else {
                onClose();
                router.push(`/dashboard/messages/${res._id}`);
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">New Message</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <LuX className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-4 space-y-4">
                    <div className="relative">
                        <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                            autoFocus
                        />
                    </div>

                    <div className="h-64 overflow-y-auto space-y-1">
                        {filteredEmployees.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                No employees found
                            </div>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <button
                                    key={emp._id}
                                    onClick={() => handleSelect(emp)}
                                    disabled={loading}
                                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-500">
                                        {/* Avatar placeholder */}
                                        <LuUser className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-medium text-sm text-gray-900">
                                            {emp.account?.fullname || emp.dummyName}
                                        </p>
                                        <p className="text-xs text-gray-500">{emp.jobTitle || "Employee"}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
