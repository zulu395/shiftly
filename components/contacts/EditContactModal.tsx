"use client";

import { $editContact } from "@/actions/contacts/editContact";
import { useAppActionState } from "@/hooks/useAppActionState";
import { IContact } from "@/server/models/Contact";
import { ANY } from "@/types";
import AppInput from "../form/AppInput";
import FormButton from "../form/FormButton";
import SideModal from "../layout/SideModal";
import AppSelect from "../form/AppSelect";
import { TIMEZONE_DATA } from "@/data/timezones";

export default function EditContactModal({
    isOpen,
    onClose,
    contact,
}: {
    isOpen: boolean;
    onClose: () => void;
    contact: IContact;
}) {
    const { action, state, submitting, formKey } = useAppActionState($editContact, {
        moreFields: {
            id: (contact._id as ANY).toString(),
        },
        onSuccess: onClose,
    });

    return (
        <SideModal
            open={isOpen}
            onOpenChange={(v) => !v && onClose()}
            title="Edit Contact"
            subtitle={`Updating details for ${contact.fullname}`}
        >
            <form key={formKey} action={action} className="grid gap-4">
                <AppInput
                    name="fullname"
                    title="Full Name"
                    placeholder="John Doe"
                    value={contact.fullname}
                    required
                    error={state.fieldErrors?.fullname}
                />
                <AppInput
                    name="email"
                    title="Email Address"
                    placeholder="john@example.com"
                    type="email"
                    value={contact.email}
                    required
                    error={state.fieldErrors?.email}
                />
                <AppInput
                    name="phone"
                    title="Phone Number"
                    placeholder="(123) 456-7890"
                    type="tel"
                    value={contact.phone}
                    error={state.fieldErrors?.phone}
                />
                <AppInput
                    name="jobTitle"
                    title="Job Title"
                    placeholder="Product Manager"
                    value={contact.jobTitle}
                    error={state.fieldErrors?.jobTitle}
                />
                <AppInput
                    name="company"
                    title="Company Name"
                    placeholder="Beacon Labs"
                    value={contact.company}
                    error={state.fieldErrors?.company}
                />
                <AppInput
                    name="linkedin"
                    title="LinkedIn URL"
                    placeholder="https://linkedin.com/..."
                    value={contact.linkedin}
                    error={state?.fieldErrors?.linkedin}
                />

                <AppSelect
                    name="timezone"
                    title="Timezone"
                    defaultValue={contact.timezone}
                    options={TIMEZONE_DATA.timeZones}
                />

                {state.error && (
                    <p className="text-red-500 text-sm font-medium">{state.error}</p>
                )}

                <FormButton loading={submitting} className="btn btn-primary mt-2">
                    Save Changes
                </FormButton>
            </form>
        </SideModal>
    );
}
