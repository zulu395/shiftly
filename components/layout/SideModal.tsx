"use client";

import { Activity, useEffect, useLayoutEffect, useState } from "react";
import { LuX } from "react-icons/lu";
import { motion, useSpring } from "motion/react";

type SideModalProps = {
  trigger?: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function SideModal({
  trigger,
  children,
  title,
  subtitle,
  open = false,
  onOpenChange,
}: SideModalProps) {
  const [isOpen, setIsOpen] = useState(open);
  const x = useSpring("50%", { stiffness: 200, damping: 30 });

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      setIsOpen(open);
    });
  }, [open]);

  useEffect(() => {
    requestAnimationFrame(() => {
      x.set(isOpen ? "0%" : "50%");
    });
  }, [isOpen, x]);

  const handleOpenChange = (v: boolean) => {
    setIsOpen(v);
    onOpenChange?.(v);
  };

  return (
    <>
      {trigger && (
        <div className="cursor-pointer" onClick={() => handleOpenChange(true)}>
          {trigger}
        </div>
      )}
      <Activity mode={isOpen ? "visible" : "hidden"}>
        <div className="fixed inset-0 w-full h-full flex items-stretch bg-black/30 z-50">
          <div onClick={() => handleOpenChange(false)} className="flex-1"></div>
          <motion.div
            style={{ opacity: 1, x }}
            className="w-[540px] max-w-full md:rounded-l-xl bg-white flex flex-col items-start gap-2 app-container-fluid pt-6"
          >
            <div className="mb-2">
              <button
                className="btn-icon text-xl"
                onClick={() => handleOpenChange(false)}
              >
                <LuX />
              </button>
            </div>
            {title && <h2 className="h3 font-semibold">{title}</h2>}
            {subtitle && <p className="h5 text-gray-500">{subtitle}</p>}
            <div className="w-full border-b" />
            <div className="flex-1 w-full overflow-y-auto">
              {children}
              <div className="h-6"></div>
            </div>
          </motion.div>
        </div>
      </Activity>
    </>
  );
}
