"use client"

import Link from "next/link";
import { HiOutlineBell } from "react-icons/hi2";

import Avatar from "../common/Avatar";
import { paths } from "@/utils/paths";
import AppLogo from "../common/AppLogo";
import MobileSidebar from "./MobileSidebar";
import { useAccountStore } from "@/hooks/stores/accountStore";
import SettingsModal from "../settings/SettingsModal";
import { LuSettings } from "react-icons/lu";

export default function TopBar() {
  const account = useAccountStore(s => s.account)

  return (
    <header>
      <div className="flex justify-between items-center app-container-fluid py-3">
        <div>
          <div className="lg:hidden gap-2 flex items-center">
            <AppLogo size={32} />
            <MobileSidebar />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-icon text-xl" title="Notifications">
            <HiOutlineBell />
          </button>
          <SettingsModal>
            <button
              className="btn-icon text-xl relative"
              title="Switch Company"
            >
              <LuSettings />
            </button>
          </SettingsModal>


          <Link href={paths.dashboard}>
            <Avatar alt={account?.fullname} size={34} />
          </Link>
        </div>
      </div>
    </header>
  );
}
