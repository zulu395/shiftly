"use client";

import { $changePassword } from "@/actions/account/changePassword";
import AppInput, { AppInputProps } from "@/components/form/AppInput";
import FormButton from "@/components/form/FormButton";
import { FormMessage } from "@/components/form/FormMessage";
import { useAppActionState } from "@/hooks/useAppActionState";

export default function ChangePasswordPage() {
    const { action, state, submitting, formKey } = useAppActionState($changePassword);

    return (
        <div className="py-4">
            <form key={formKey} action={action} className="grid gap-4">
                {fields.map((field, i) => (
                    <AppInput
                        key={i}
                        {...field}
                        error={state.fieldErrors?.[field.name]}
                    />
                ))}

                <FormMessage res={state} />

                <div className="pt-4 flex justify-end">
                    <FormButton loading={submitting} className="btn btn-primary !px-6">
                        Update Password
                    </FormButton>
                </div>
            </form>
        </div>
    );
}

const fields: AppInputProps[] = [
    {
        name: "oldPassword",
        placeholder: "••••••••",
        title: "Current Password",
        type: "password",
        required: true,
    },
    {
        name: "newPassword",
        placeholder: "••••••••",
        title: "New Password",
        type: "password",
        required: true,
    },
    {
        name: "confirmPassword",
        placeholder: "••••••••",
        title: "Confirm New Password",
        type: "password",
        required: true,
    },
];
