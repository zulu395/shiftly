"use client";

import { $addContact } from "@/actions/contacts/addContact";
import { useAppActionState } from "@/hooks/useAppActionState";
import { useState } from "react";
import AppInput from "../form/AppInput";
import FormButton from "../form/FormButton";
import SideModal from "../layout/SideModal";
import AppSelect from "../form/AppSelect";
import { TIMEZONE_DATA } from "@/data/timezones";

export default function NewContactModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const { action, state, submitting, formKey } = useAppActionState($addContact, {
    onSuccess: () => setOpen(false),
  });

  return (
    <SideModal
      open={open}
      onOpenChange={setOpen}
      trigger={children}
      title="Add Contact"
      subtitle="Manually add a contact to your directory for quick access and future scheduling."
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
          name="phone"
          title="Phone Number"
          placeholder="(123) 456-7890"
          type="tel"
          error={state.fieldErrors?.phone}
        />
        <AppInput
          name="jobTitle"
          title="Job Title"
          placeholder="Product Manager"
          error={state.fieldErrors?.jobTitle}
        />
        <AppInput
          name="company"
          title="Company Name"
          placeholder="Beacon Labs"
          error={state.fieldErrors?.company}
        />
        <AppInput
          name="linkedin"
          title="LinkedIn URL"
          placeholder="https://linkedin.com/..."
          error={state.fieldErrors?.linkedin}
        />

        <AppSelect
          name="timezone"
          title="Timezone"
          options={TIMEZONE_DATA.timeZones}
        />

        {state.error && (
          <p className="text-red-500 text-sm font-medium">{state.error}</p>
        )}

        <FormButton loading={submitting} className="btn btn-primary mt-2">
          Save Contact
        </FormButton>
      </form>
    </SideModal>
  );
}
