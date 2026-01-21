"use client";

import { $acceptInvite } from "@/actions/onboard/employee/acceptInvite";

import { Invite } from "@/types/onboard";

import { useTransition } from "react";
import { toast } from "sonner";
import { LuBuilding } from "react-icons/lu";

export default function InviteCard({ invite }: { invite: Invite }) {
    const [isPending, startTransition] = useTransition();

    const handleAccept = () => {
        startTransition(async () => {
            const res = await $acceptInvite(invite._id);
            if (res && res.error) {
                toast.error(res.error);
            } else {
                toast.success("Invitation accepted!");
            }
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                    <LuBuilding className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">
                        {invite.company?.fullname || "Unknown Company"}
                    </h3>
                    <p className="text-xs text-gray-500">
                        Invited you to join as {invite.jobTitle || "Employee"}
                    </p>
                </div>
            </div>

            <button
                onClick={handleAccept}
                disabled={isPending}
                className="btn btn-sm btn-primary"
            >
                {isPending ? "Joining..." : "Accept"}
            </button>
        </div>
    );
}
