"use client"

import { $login } from "@/actions/auth/login";
import AppInput, { AppInputProps } from "@/components/form/AppInput";
import FormButton from "@/components/form/FormButton";
import { useAppActionState } from "@/hooks/useAppActionState";
import { paths } from "@/utils/paths";
import Link from "next/link";

export default function Page() {
  const { action, state, submitting } = useAppActionState($login);

  return (
    <div className="grid gap-2 w-full">
      <h1 className="h1 text-center font-bold">Login to your account</h1>
      <p className="h5 text-center font-medium">
        Enter your details to access your account
      </p>
      <form action={action} className="grid gap-4 py-6">
        {fields.map((field, i) => (
          <AppInput key={i} {...field} error={state.fieldErrors?.[field.name]} />
        ))}
        {state.error && (
          <div className="text-red-500 text-sm text-center">{state.error}</div>
        )}
        <FormButton loading={submitting} className="btn btn-primary mt-2">Login</FormButton>
        {/* <OrLine />
        <ContinueWithGoogleButton /> */}
        <p className="h5 text-center">
          <span>No account yet?&nbsp;&nbsp;</span>
          <Link className="text-brand-primary hover:underline" href={paths.register}>
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}

const fields: AppInputProps[] = [
  {
    name: "email",
    placeholder: "example@test.com",
    title: "Email Address",
    type: "email",
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
