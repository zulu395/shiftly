"use client"

import { $register } from "@/actions/auth/register";
import AppInput, { AppInputProps } from "@/components/form/AppInput";
import FormButton from "@/components/form/FormButton";
import { useAppActionState } from "@/hooks/useAppActionState";
import { useChangeSearchParams } from "@/hooks/useChangeSearchParams";
import { paths } from "@/utils/paths";
import Link from "next/link";

export default function Form() {
    const { action, state, } = useAppActionState($register);
    const { paramsObj } = useChangeSearchParams()

    const fields: AppInputProps[] = [
        {
            name: "fullname",
            placeholder: "John Doe",
            title: "Full name",
            type: "text",
            required: true,
        },
        {
            name: "email",
            placeholder: "example@test.com",
            title: "Email Address",
            type: "email",
            required: true,
            value: paramsObj?.invitation
        },
        {
            name: "phone",
            placeholder: "+356 012345678",
            title: "Phone Number",
            type: "tel",
            required: true,
        },
        {
            name: "password",
            placeholder: "Password",
            title: "Password",
            type: "password",
            required: true,
        },
    ];

    return (
        <div className="grid gap-2 w-full">
            <h1 className="h1 text-center font-bold">Create your account</h1>
            <p className="h5 text-center font-medium text-pretty">
                Join Shiftly to simplify how you manage and track work shifts. Whether
                you’re organizing teams or clocking in.
            </p>
            <form action={action} className="grid gap-4 py-6">
                {fields.map((field, i) => (
                    <AppInput key={i} {...field} error={state.fieldErrors?.[field.name]} />
                ))}
                <FormButton className="btn btn-primary mt-2">
                    Create an account
                </FormButton>
                {/* <OrLine />
        <ContinueWithGoogleButton /> */}
                <p className="h5 text-center">
                    <span>Already have an account?&nbsp;&nbsp;</span>
                    <Link
                        className="text-brand-primary hover:underline"
                        href={paths.login}
                    >
                        Log in
                    </Link>
                </p>
            </form>
        </div>
    );
}


