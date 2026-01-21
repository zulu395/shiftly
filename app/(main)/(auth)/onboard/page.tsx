"use client";

import ToggleGroup, { ToggleGroupProps } from "@/components/form/ToggleGroup";
import { paths } from "@/utils/paths";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [selected, setSelected] = useState<string|undefined>(undefined);
  const { push } = useRouter();

  function handleProceed() {
    if (selected) push(selected);
  }

  return (
    <div className="w-full grid gap-2">
      <h1 className="h1 text-center font-bold">
        How will you be using Shiftly?
      </h1>
      <p className="h5 text-center font-medium text-pretty">
        Choose the option that best describes you — we’ll set things up to fit
        your needs.
      </p>
      <div className="py-6 gap-4">
        <div className="grid gap-4 grid-cols-2">
          {toggleItems.map((item, i) => (
            <ToggleGroup
              key={i}
              {...item}
              active={selected === item.value}
              onClick={setSelected}
            />
          ))}
        </div>
      </div>
      <button
        className="btn btn-primary"
        disabled={!selected}
        onClick={handleProceed}
      >
        Continue
      </button>
    </div>
  );
}

const toggleItems: ToggleGroupProps[] = [
  {
    title: "I'm a company / manager",
    subtitle: "Create and manage employee schedules",
    value: paths.onboardCompany,
  },
  {
    title: "I'm an Employee",
    subtitle: "View, swap and track my shifts",
    value: paths.onboardEmployee,
  },
];
