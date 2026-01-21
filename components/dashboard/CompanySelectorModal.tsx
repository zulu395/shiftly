"use client";

import { $getEmployments } from "@/actions/employees/getEmployments";
import { $switchCompany } from "@/actions/employees/switchCompany";
import { AppError } from "@/utils/appError";
import AppSelect from "@/components/form/AppSelect";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useCookie } from "react-use";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cookieKeys } from "@/utils/cookies";
import { IEmployeePopulated } from "@/server/models/Employee";
import { Dialog, DialogContent } from "../ui/dialog";

type CompanySelectorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    currentCompanyId?: string;
};

export default function CompanySelectorModal({
    isOpen,
    onClose,
    currentCompanyId,
}: CompanySelectorModalProps) {
    const [cookieCompanyId] = useCookie(cookieKeys.companyId);
    const [selectedCompany, setSelectedCompany] = useState(
        currentCompanyId || cookieCompanyId || ""
    );
    const [isPending, startTransition] = useTransition();

    const { data: employments = [], isLoading } = useQuery({
        queryKey: ["employments"],
        queryFn: async () => {
            const res = await $getEmployments();
            if (res instanceof AppError) {
                toast.error(res.message);
                return [];
            }
            if (!selectedCompany && res.length > 0) {
                setSelectedCompany(res[0].company._id?.toString());
            }
            return res as unknown as IEmployeePopulated[];
        },
        enabled: isOpen,
    });

    const switchMutation = useMutation({
        mutationFn: $switchCompany,
        onSuccess: (res) => {
            if (res && res.error) {
                toast.error(res.error);
            } else {
                toast.success("Switched company");
                onClose();
                window.location.reload();
            }
        },
        onError: () => {
            toast.error("An unexpected error occurred");
        },
    });

    const handleSwitch = () => {
        if (!selectedCompany) return;
        startTransition(() => {
            switchMutation.mutate(selectedCompany);
        });
    };

    if (!isOpen) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose} >
            <DialogContent>


                <h3 className="font-semibold text-gray-900">Select Company</h3>


                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center py-4 text-gray-500">Loading companies...</div>
                    ) : employments.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No companies found.</div>
                    ) : (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <AppSelect
                                name="company"
                                value={selectedCompany}
                                onChange={setSelectedCompany}
                                options={employments.map((emp) => ({
                                    title: emp.company.companyName ?? emp.company.fullname,
                                    value: emp.company._id.toString(),
                                }))}
                                placeholder="Select a company"
                            />
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSwitch}
                        disabled={isPending || !selectedCompany || switchMutation.isPending}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 rounded-md disabled:opacity-50"
                    >
                        {isPending || switchMutation.isPending ? "Switching..." : "Switch"}
                    </button>
                </div>

            </DialogContent>
        </Dialog>
    );
}
