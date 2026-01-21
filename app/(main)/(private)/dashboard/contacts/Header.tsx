"use client";

import NewContactModal from "@/components/contacts/NewContactModal";
import AddEmployeeModal from "@/components/contacts/AddEmployeeModal";
import { paths } from "@/utils/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuPlus } from "react-icons/lu";

export default function Header() {
  const pathname = usePathname();

  const tabs = [
    { label: "Employees", path: paths.dashboardContacts },
    { label: "Event Contacts", path: paths.dashboardContactsEventContacts },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4">
        <h1 className="h3 font-semibold">Contacts</h1>
        {pathname === paths.dashboardContacts ? (
          <AddEmployeeModal>
            <button className="btn btn-primary py-2! px-4!">
              <LuPlus />
              <span>Add employee</span>
            </button>
          </AddEmployeeModal>
        ) : (
          <NewContactModal>
            <button className="btn btn-primary py-2! px-4!">
              <LuPlus />
              <span>Add contact</span>
            </button>
          </NewContactModal>
        )}
      </div>

      <div className="flex items-center gap-6 border-b border-gray-200">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          return (
            <Link
              key={tab.path}
              href={tab.path}
              className={`pb-3 px-1 text-sm font-medium transition-colors relative ${isActive
                ? "text-brand-primary"
                : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {tab.label}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
