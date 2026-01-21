"use client";

import { $onboardCompanyTeam } from "@/actions/onboard/company-team";
import FormBackButton from "@/components/auth/FormBackButton";
import InviteTeamList from "@/components/auth/InviteTeamList";
import FormButton from "@/components/form/FormButton";
import { useAccountStore } from "@/hooks/stores/accountStore";
import { useAppActionState } from "@/hooks/useAppActionState";
import { MappedUserData } from "@/types/csv";
import { paths } from "@/utils/paths";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const [data, setData] = useState<MappedUserData[] | null>(null);
  const account = useAccountStore((s) => s.account);

  const { action, submitting, state } = useAppActionState($onboardCompanyTeam, {
    moreFields: {
      company: account?._id?.toString() ?? "",
      employees: JSON.stringify(data),
    },
  });

  const btnDisabled = !data || data.length === 0;

  return (
    <div className="grid gap-2 w-full">
      <h1 className="h1 text-center font-bold text-pretty">
        Invite your team to join you
      </h1>
      <p className="h5 text-center font-medium text-pretty">
        Invite employees to join your workspace and start managing shifts
        together.
      </p>
      <form action={action} className="grid gap-4 py-6 w-full ">
        <InviteTeamList onDataChange={setData} />
        {state.error && (
          <p className="text-red-500 text-sm text-center font-medium">
            {state.error}
          </p>
        )}
        <FormButton
          loading={submitting}
          disabled={btnDisabled}
          className="btn btn-primary mt-2"
        >
          Continue
        </FormButton>
        <div className="grid grid-cols-2 gap-3">
          <FormBackButton />
          <Link
            href={paths.dashboard}
            className="btn btn-flat "
            role="button"
            type="button"
          >
            Skip
          </Link>
        </div>
      </form>
    </div>
  );
}
