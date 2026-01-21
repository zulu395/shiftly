import AppInput, { AppInputProps } from "@/components/form/AppInput";
import FormButton from "@/components/form/FormButton";
import { paths } from "@/utils/paths";
import Link from "next/link";

export default function Page() {
  return (
    <div className="grid gap-2 w-full">
      <h1 className="h1 text-center font-bold">Reset your password</h1>
      <p className="h5 text-center font-medium">
        Enter your email address associated with your account and will send you
        an email instruction to reset
      </p>
      <form action="" className="grid gap-4 py-6">
        {fields.slice(0, 1).map((field, i) => (
          <AppInput key={i} {...field} />
        ))}
        <FormButton className="btn btn-primary mt-2">Reset Password</FormButton>
        <p className="h5 text-center">
          <span>Know your password?&nbsp;&nbsp;</span>
          <Link
            className="text-brand-primary hover:underline"
            href={paths.login}
          >
            Login instead
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
