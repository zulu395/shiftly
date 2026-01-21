"use client";

import { $deleteEmployee } from "@/actions/employees/deleteEmployee";
import { useAppActionState } from "@/hooks/useAppActionState";
import { PopulatedEmployee } from "@/types/employee";
import FormButton from "../form/FormButton";
import AppModal from "../layout/AppModal";
import { LuTrash2 } from "react-icons/lu";

export default function DeleteEmployeeModal({
    isOpen,
    onClose,
    employee,
}: {
    isOpen: boolean;
    onClose: () => void;
    employee: PopulatedEmployee;
}) {
    const { action, state, submitting } = useAppActionState($deleteEmployee, {
        moreFields: {
            id: employee._id,
        },
        onSuccess: onClose,
    });

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Employee"
            subtitle={`Are you sure you want to delete ${employee.dummyName}?`}
            icon={<LuTrash2 />}
        >
            <div className="flex flex-col gap-6">
                <p className="text-gray-600 text-center">
                    This will remove the employee from the active list. This action cannot be undone.
                </p>

                <form action={action} className="flex gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn btn-secondary !rounded-lg"
                    >
                        Cancel
                    </button>
                    <FormButton
                        loading={submitting}
                        className="flex-1 btn btn-primary bg-red-600! border-red-600! hover:bg-red-700!"
                    >
                        Delete
                    </FormButton>
                </form>

                {state.error && (
                    <p className="text-red-500 text-sm font-medium text-center">{state.error}</p>
                )}
            </div>
        </AppModal>
    );
}
