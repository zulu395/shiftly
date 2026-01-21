"use client";

import { $onboardCompany } from "@/actions/onboard/company";
import FormBackButton from "@/components/auth/FormBackButton";
import AppInput, { AppInputProps } from "@/components/form/AppInput";
import AppSelect, { AppSelectProps } from "@/components/form/AppSelect";
import FormButton from "@/components/form/FormButton";
import { COMPANY_DATA } from "@/data/company";
import { useAccountStore } from "@/hooks/stores/accountStore";
import { useAppActionState } from "@/hooks/useAppActionState";

export default function Page() {
  const account = useAccountStore(s => s.account)

  const { action, state, submitting } = useAppActionState($onboardCompany, {
    moreFields: { account: account?._id.toString() }
  });

  return (
    <div className="grid gap-2 w-full">
      <h1 className="h1 text-center font-bold">Tell us about your company</h1>
      <p className="h5 text-center font-medium text-pretty">
        Just a few quick details to get your team ready to start managing
        shifts.
      </p>
      <form action={action} className="grid gap-4 py-6">
        {fields.map((field, i) => (
          <AppInput
            key={i}
            {...field}
            error={state.fieldErrors?.[field.name]}
          />
        ))}
        {selectFields.map((field, i) => (
          <AppSelect
            key={i}
            {...field}
            error={state.fieldErrors?.[field.name]}
          />
        ))}

        {state.error && (
          <div className="text-red-500 text-sm text-center">{state.error}</div>
        )}

        <FormButton loading={submitting} className="btn btn-primary mt-2">Continue</FormButton>
        <FormBackButton />
      </form>
    </div>
  );
}

const fields: AppInputProps[] = [
  {
    name: "companyName",
    placeholder: "Example LLC",
    title: "Company Name",
    required: true,
  },
  {
    name: "companyAddress",
    placeholder: "123 Main street",
    title: "Company Address",
    required: true,
  },
];

const selectFields: AppSelectProps[] = [
  {
    name: "companyTotalEmployees",
    options: COMPANY_DATA.employeesRange,
    title: "Total Empoyees",
  },
  {
    name: "companyNiche",
    options: COMPANY_DATA.industriesAndNiches,
    title: "Industry / Niche",
  },
];
