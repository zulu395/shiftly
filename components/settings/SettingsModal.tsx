import React, { useMemo, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Building2, User, Lock } from "lucide-react";
import CompanySelectorModal from "../dashboard/CompanySelectorModal";
import { useAccountStore } from "@/hooks/stores/accountStore";
import { useRouter } from "next/navigation";
import { paths } from "@/utils/paths";

interface SettingsModalProps {
    children: React.ReactNode;
}

const SettingsModal = ({ children }: SettingsModalProps) => {
    const account = useAccountStore((s) => s.account);
    const router = useRouter();

    const [companyModalOpen, setCompanyModalOpen] = useState(false);

    const settingsActions = useMemo(() => {
        if (!account) return [];
        const actions = [

            {
                label: "Edit Profile",
                icon: User,
                onClick: () => router.push(paths.dashboardSettingsEditProfile),
            },
            {
                label: "Change Password",
                icon: Lock,
                onClick: () => router.push(paths.dashboardSettingsChangePassword),
            },
        ];

        if (account.role === "employee") {
            actions.unshift({
                label: "Switch Company",
                icon: Building2,
                onClick: () => setCompanyModalOpen(true),
            });
        }
        return actions;
    }, [account, router]);

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2 py-4">
                        {settingsActions.map((action) => (
                            <div
                                key={action.label}
                                className="w-full flex items-center py-2 hover:bg-black/10 cursor-pointer rounded-lg justify-start gap-3 px-2"
                                onClick={action.onClick}
                            >
                                <action.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{action.label}</span>
                            </div>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
            <CompanySelectorModal
                isOpen={companyModalOpen}
                onClose={() => setCompanyModalOpen(false)}
            />
        </>
    );
};

export default SettingsModal;
