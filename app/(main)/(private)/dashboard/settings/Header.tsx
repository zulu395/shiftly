"use client";

import { paths } from "@/utils/paths";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    const tabs = [
        { label: "Edit Profile", path: paths.dashboardSettingsEditProfile },
        { label: "Change Password", path: paths.dashboardSettingsChangePassword },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center gap-4">
                <h1 className="h3 font-semibold">Settings</h1>
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
