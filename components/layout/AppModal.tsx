"use client";

import { AnimatePresence, motion } from "motion/react";
import { ReactNode, useEffect, useState } from "react";
import { LuX } from "react-icons/lu";

type AppModalProps = {
    isOpen?: boolean;
    onClose?: () => void;
    onOpenChange?: (open: boolean) => void;
    trigger?: ReactNode;
    title?: string;
    subtitle?: string;
    children: ReactNode;
    maxWidth?: string;
    icon?: ReactNode;
};

export default function AppModal({
    isOpen: controlledOpen,
    onClose,
    onOpenChange,
    trigger,
    title,
    subtitle,
    children,
    maxWidth = "max-w-[500px]",
    icon,
}: AppModalProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

    const handleOpenChange = (val: boolean) => {
        setInternalOpen(val);
        onOpenChange?.(val);
        if (!val) onClose?.();
    };

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <>
            {trigger && (
                <div className="cursor-pointer" onClick={() => handleOpenChange(true)}>
                    {trigger}
                </div>
            )}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => handleOpenChange(false)}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`relative bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden flex flex-col`}
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between p-6 border-b border-gray-100">
                                <div className="flex gap-4">
                                    {icon && (
                                        <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary text-2xl shrink-0">
                                            {icon}
                                        </div>
                                    )}
                                    <div>
                                        {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
                                        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleOpenChange(false)}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
                                >
                                    <LuX className="text-xl" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
