"use client";

import { $addEmployee } from "@/actions/employees/addEmployee";
import { useAccountStore } from "@/hooks/stores/accountStore";
import { useAppActionState } from "@/hooks/useAppActionState";
import { useState } from "react";
import AppInput from "../form/AppInput";
import FormButton from "../form/FormButton";
import AppModal from "../layout/AppModal";
import { LuUserPlus } from "react-icons/lu";

export default function AddEmployeeModal({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);
    const account = useAccountStore((s) => s.account);

    const { action, state, submitting, formKey } = useAppActionState($addEmployee, {
        moreFields: {
            companyId: account?._id?.toString() ?? "",
        },
        onSuccess: () => setOpen(false),
    });

    return (
        <AppModal
            isOpen={open}
            onOpenChange={setOpen}
            trigger={children}
            title="Add Employee"
            subtitle="Invite a new member to your team. They will receive an invitation email to join your workspace."
            icon={<LuUserPlus />}
        >
            <form key={formKey} action={action} className="grid gap-4">
                <AppInput
                    name="fullname"
                    title="Full Name"
                    placeholder="John Doe"
                    required
                    error={state.fieldErrors?.fullname}
                />
                <AppInput
                    name="email"
                    title="Email Address"
                    placeholder="john@example.com"
                    type="email"
                    required
                    error={state.fieldErrors?.email}
                />
                <AppInput
                    name="jobTitle"
                    title="Job Title"
                    placeholder="Software Engineer"
                    error={state.fieldErrors?.jobTitle}
                />

                {state.error && (
                    <p className="text-red-500 text-sm font-medium text-center">{state.error}</p>
                )}

                <FormButton loading={submitting} className="btn btn-primary mt-2 w-full justify-center">
                    Add Employee
                </FormButton>
            </form>
        </AppModal>
    );
}
