"use client";

import { useState } from "react";
import { LuSettings } from "react-icons/lu";
import { useAccountStore } from "@/hooks/stores/accountStore";

export default function CompanySelector() {
    const [, setIsOpen] = useState(false);
    const account = useAccountStore(s => s.account);

    // Only show for employees
    if (account?.role !== "employee") return null;

    // How to get current company ID? 
    // We can read it from cookie or make global state.
    // For now, let's just open the modal.
    // Ideally, the server passes the current company ID to the layout, or we fetch it.

    return (
        <>
            <button
                className="btn-icon text-xl relative"
                title="Switch Company"
                onClick={() => setIsOpen(true)}
            >
                <LuSettings />
            </button>

        </>
    );
}
