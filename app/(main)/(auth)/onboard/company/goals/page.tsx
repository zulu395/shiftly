"use client";

import { $onboardCompanyGoals } from "@/actions/onboard/company-goals";
import FormBackButton from "@/components/auth/FormBackButton";
import FormButton from "@/components/form/FormButton";
import { SelectPillGroup } from "@/components/ui/select-pill";
import { COMPANY_DATA } from "@/data/company";
import { useAccountStore } from "@/hooks/stores/accountStore";
import { useAppActionState } from "@/hooks/useAppActionState";
import { useState } from "react";

export default function Page() {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const account = useAccountStore((s) => s.account);

  const { action, state, submitting } = useAppActionState(
    $onboardCompanyGoals,
    {
      moreFields: {
        account: account?._id?.toString() ?? "",
        goals: JSON.stringify(selectedOptions),
      },
    }
  );

  return (
    <div className="grid gap-2 w-full">
      <h1 className="h1 text-center font-bold text-pretty">
        What are your main goals with Shiftly?
      </h1>
      <p className="h5 text-center font-medium text-pretty">
        Tell us what you’d like to get out of Shiftly so we can set things up
        just right.
      </p>
      <form action={action} className="grid gap-4 py-6">
        <SelectPillGroup
          options={COMPANY_DATA.goals}
          selectedItems={selectedOptions}
          onSelectedItemsChange={setSelectedOptions}
        />

        {state.error && (
          <div className="text-red-500 text-sm text-center">{state.error}</div>
        )}

        <FormButton loading={submitting} className="btn btn-primary mt-2">
          Continue
        </FormButton>
        <FormBackButton />
      </form>
    </div>
  );
}
