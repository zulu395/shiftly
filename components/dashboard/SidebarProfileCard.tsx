"use client"

import { paths } from "@/utils/paths";
import Link from "next/link";
import Avatar from "../common/Avatar";
import { HiOutlineLogout } from "react-icons/hi";
import { useCookie } from "react-use"
import { cookieKeys } from "@/utils/cookies";
import { useAccountStore } from "@/hooks/stores/accountStore";

export default function SidebarProfileCard() {
  const account = useAccountStore(s => s.account)
  const [, , removeCookie] = useCookie(cookieKeys.account)
  function signOut() {
    removeCookie()
    window.location.href = paths.login;
  }

  return (
    <div className="border border-gray-300 rounded-md p-2 flex items-center gap-5">
      <Link href={paths.dashboard} className="flex w-[calc(100%-50px)] gap-3 items-center">
        <Avatar alt={account?.fullname} />
        <div className="flex-1">
          <p className="text-sm font-semibold line-clamp-1">{account?.fullname}</p>
          <p className="text-xs font-medium line-clamp-1">{account?.email}</p>
        </div>
      </Link>
      <button className="btn btn-flat hover:text-red-500"
        title="Sign-out"
        onClick={signOut}
      >
        <HiOutlineLogout />
      </button>
    </div>
  );
}
