"use client";

import Stepper from "@/components/common/Stepper";
import { paths } from "@/utils/paths";
import { usePathname } from "next/navigation";

const STEPS = [
  "Company info",
  "Personalization",
  "Import",
  "Invite team",
] as const;

const pathsMap: Record<string, (typeof STEPS)[number]> = {
  [paths.onboardCompany]: STEPS[0],
  [paths.onboardCompanyGoals]: STEPS[1],
  [paths.onboardCompanyEmployeeList]: STEPS[2],
  [paths.onboardCompanyTeam]: STEPS[3],
};

export default function LayoutStepper() {
  const pathname = usePathname();

  return (
    <div className="py-10 w-full">
      <Stepper steps={STEPS} currentStep={pathsMap[pathname]} />
    </div>
  );
}
