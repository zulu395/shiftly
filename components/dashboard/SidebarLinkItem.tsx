"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SidebarLinkItemProps = {
  icon: React.ReactNode;
  title: string;
  href: string;
};

export default function SidebarLinkItem({
  href,
  icon,
  title,
}: SidebarLinkItemProps) {
  const pathname = usePathname();
  const isActive = pathname === (href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 h5 font-medium rounded-md text-gray-900 transition-all duration-200",
        {
          "text-white bg-linear-to-r from-brand-primary-dark to-brand-primary":
            isActive,
          "text-black hover:bg-brand-primary/10": !isActive,
        }
      )}
    >
      <span className=" scale-125">{icon}</span>
      <span>{title}</span>
    </Link>
  );
}
