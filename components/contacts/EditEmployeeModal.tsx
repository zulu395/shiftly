"use client";

import { $editEmployee } from "@/actions/employees/editEmployee";
import { useAppActionState } from "@/hooks/useAppActionState";
import { PopulatedEmployee } from "@/types/employee";
import AppInput from "../form/AppInput";
import FormButton from "../form/FormButton";
import AppModal from "../layout/AppModal";
import { LuPencil } from "react-icons/lu";

export default function EditEmployeeModal({
    isOpen,
    onClose,
    employee,
}: {
    isOpen: boolean;
    onClose: () => void;
    employee: PopulatedEmployee;
}) {
    const { action, state, submitting, formKey } = useAppActionState($editEmployee, {
        moreFields: {
            id: employee._id,
        },
        onSuccess: onClose,
    });

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Employee"
            subtitle={`Updating details for ${employee.dummyName}`}
            icon={<LuPencil />}
        >
            <form key={formKey} action={action} className="grid gap-4">
                <AppInput
                    name="fullname"
                    title="Full Name"
                    placeholder="Full Name"
                    value={employee.dummyName}
                    readonly
                />
                <AppInput
                    name="email"
                    title="Email Address"
                    placeholder="Email"
                    value={employee.dummyEmail}
                    readonly
                />
                <AppInput
                    name="jobTitle"
                    title="Job Title"
                    placeholder="Software Engineer"
                    value={employee.jobTitle}
                    error={state.fieldErrors?.jobTitle}
                />

                {state.error && (
                    <p className="text-red-500 text-sm font-medium text-center">{state.error}</p>
                )}

                <FormButton loading={submitting} className="btn btn-primary mt-2 w-full justify-center">
                    Save Changes
                </FormButton>
            </form>
        </AppModal>
    );
}
