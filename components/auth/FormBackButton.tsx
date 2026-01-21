"use client";

import { useRouter } from "next/navigation";
import { LuChevronLeft } from "react-icons/lu";

export default function FormBackButton() {
  const { back } = useRouter();

  return (
    <button onClick={back} role="button" type="button" className="btn btn-flat">
      <LuChevronLeft />
      Back
    </button>
  );
}
