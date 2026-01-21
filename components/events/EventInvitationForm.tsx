"use client";

import { $respondToInvite } from "@/actions/events/respondToInvite";
import { useAppActionState } from "@/hooks/useAppActionState";
import { LuCheck, LuLoader, LuX } from "react-icons/lu";
import { toast } from "sonner";

type EventInvitationFormProps = {
    eventId: string;
    prefilledEmail?: string;
};

export default function EventInvitationForm({
    eventId,
    prefilledEmail = "",
}: EventInvitationFormProps) {
    const { action, submitting } = useAppActionState($respondToInvite, {
        onSuccess: (res) => {
            if (res.success) {
                toast.success(res.success);
            }
        },
        onError: (res) => {
            if (res.error) {
                toast.error(res.error);
            }
        },
    });

    return (
        <form action={action} className="border-t border-gray-100 pt-4">
            <input type="hidden" name="eventId" value={eventId} />

            <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Email Address
                </label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    defaultValue={prefilledEmail}
                    placeholder="Enter your email to verify invitation"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm"
                />
            </div>

            <p className="text-sm text-gray-500 mb-4">Respond</p>
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    name="response"
                    value="accepted"
                    disabled={submitting}
                    className="btn btn-primary py-2! px-5! flex items-center gap-2 text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitting ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuCheck className="w-4 h-4" />}
                    Accept
                </button>
                <button
                    type="submit"
                    name="response"
                    value="rejected"
                    disabled={submitting}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium text-sm px-4 py-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitting ? <LuLoader className="w-4 h-4 animate-spin" /> : <LuX className="w-4 h-4" />}
                    Decline
                </button>
            </div>
        </form>
    );
}
