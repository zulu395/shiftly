"use client";

import { $deleteContact } from "@/actions/contacts/deleteContact";
import { useAppActionState } from "@/hooks/useAppActionState";
import { IContact } from "@/server/models/Contact";
import { ANY } from "@/types";
import FormButton from "../form/FormButton";
import AppModal from "../layout/AppModal";
import { LuTrash2 } from "react-icons/lu";

export default function DeleteContactModal({
    isOpen,
    onClose,
    contact,
}: {
    isOpen: boolean;
    onClose: () => void;
    contact: IContact;
}) {
    const { action, state, submitting } = useAppActionState($deleteContact, {
        moreFields: {
            id: (contact._id as ANY).toString(),
        },
        onSuccess: onClose,
    });

    return (
        <AppModal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Contact"
            subtitle={`Are you sure you want to delete ${contact.fullname}?`}
            icon={<LuTrash2 />}
        >
            <div className="flex flex-col gap-6">
                <p className="text-gray-600 text-center">
                    This will remove the contact from your directory. This action cannot be undone.
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
