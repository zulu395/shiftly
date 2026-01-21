"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RiMenu2Line } from "react-icons/ri";
import SidebarLinks from "./SidebarLinks";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    requestAnimationFrame(() => setOpen(false));
  }, [pathname]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="btn-icon text-xl">
          <RiMenu2Line />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3 rounded-xl" align="start">
        <div className="grid gap-4">
          <SidebarLinks />
        </div>
      </PopoverContent>
    </Popover>
  );
}
