"use client";

import { $updateProfile } from "@/actions/account/updateProfile";
import AppInput from "@/components/form/AppInput";
import FormButton from "@/components/form/FormButton";
import { FormMessage } from "@/components/form/FormMessage";
import { useAccountStore } from "@/hooks/stores/accountStore";
import { useAppActionState } from "@/hooks/useAppActionState";

export default function EditProfilePage() {
    const account = useAccountStore((s) => s.account);
    const { action, state, submitting } = useAppActionState($updateProfile);

    if (!account) return null;

    return (
        <div className="py-4">
            <form action={action} className="grid gap-4">
                <AppInput
                    name="fullname"
                    title="Full Name"
                    placeholder="John Doe"
                    value={account.fullname}
                    error={state.fieldErrors?.fullname}
                />
                <AppInput
                    name="phone"
                    title="Phone Number"
                    placeholder="+1234567890"
                    value={account.phone}
                    error={state.fieldErrors?.phone}
                />

                <FormMessage res={state} />

                <div className="pt-4 flex justify-end">
                    <FormButton loading={submitting} className="btn btn-primary !px-6">
                        Save Changes
                    </FormButton>
                </div>
            </form>
        </div>
    );
}
