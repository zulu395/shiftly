import AppLogo from "@/components/common/AppLogo";
import SidebarLinks from "@/components/dashboard/SidebarLinks";
import SidebarProfileCard from "@/components/dashboard/SidebarProfileCard";
import { paths } from "@/utils/paths";
import Link from "next/link";

export default function LeftPane() {
  return (
    <aside className="hidden lg:block w-72 min-w-72 h-screen px-4 py-10 bg-light sticky top-0 left-0">
      <div className="flex flex-col items-stretch justify-start gap-12 h-full">
        <Link href={paths.dashboard} className="flex gap-2 items-end">
          <AppLogo size={32} />
          <p className="h4 text-brand-primary font-bold">Shiftly</p>
        </Link>
        <div className="flex-1">
          <SidebarLinks />
        </div>
        <div className="">
          <SidebarProfileCard />
        </div>
      </div>
    </aside>
  );
}
