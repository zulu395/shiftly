"use client";

import { $onboardCompanyEmployeeList } from "@/actions/onboard/company-employee-list";
import { CsvUploader } from "@/components/auth/CsvUploader";
import FormBackButton from "@/components/auth/FormBackButton";
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

  const { action, submitting } = useAppActionState(
    $onboardCompanyEmployeeList,
    {
      moreFields: {
        company: account?._id?.toString() ?? "",
        employees: JSON.stringify(data),
      },
    }
  );

  const btnDisabled = !data || data.length === 0;

  return (
    <div className="grid gap-2 w-full">
      <h1 className="h1 text-center font-bold text-pretty">
        Import your employee list
      </h1>
      <p className="h5 text-center font-medium text-pretty">
        Import your employee data using a spreadsheet file.
      </p>
      <form action={action} className="grid gap-4 py-6 w-full ">
        <CsvUploader onDataChange={setData} />
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
            href={paths.onboardCompanyTeam}
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
