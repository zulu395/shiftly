"use client"

import { $completeProfile } from "@/actions/onboard/employee/completeProfile";
import FormBackButton from "@/components/auth/FormBackButton";
import AppInput, { AppInputProps } from "@/components/form/AppInput";
import FormButton from "@/components/form/FormButton";
import { useAccountStore } from "@/hooks/stores/accountStore";
import { useAppActionState } from "@/hooks/useAppActionState";

export default function Form() {
    const account = useAccountStore(s => s.account)
    const { action, state } = useAppActionState($completeProfile);

    const fields: AppInputProps[] = [
        {
            name: "fullname",
            placeholder: "John Doe",
            title: "Full name",
            type: "text",
            required: true,
            value: account?.fullname
        },
        {
            name: "phone",
            placeholder: "+356 012345678",
            title: "Phone Number",
            type: "tel",
            required: true,
            value: account?.phone
        },
    ];


    return (
        <form action={action} className="grid gap-4 py-6">
            {fields.map((field, i) => (
                <AppInput key={i} {...field} error={state.fieldErrors?.[field.name]} />
            ))}
            {state.error && (
                <div className="text-red-500 text-sm text-center">{state.error}</div>
            )}
            <FormButton className="btn btn-primary mt-2">Continue</FormButton>
            <FormBackButton />
        </form>
    );
}

