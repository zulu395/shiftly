"use client";

import { $inviteAttendees } from "@/actions/events/inviteAttendees";
import { $getEvent } from "@/actions/events/getEvent";
import Avatar from "@/components/common/Avatar";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Event, EventAttendee } from "@/types/event";
import { AppError } from "@/utils/appError";
import { paths } from "@/utils/paths";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { LuCalendar, LuLink, LuLoader, LuSend, LuX } from "react-icons/lu";
import { ReactMultiEmail } from "react-multi-email";
import "react-multi-email/dist/style.css";
import { toast } from "sonner";

type Participant = EventAttendee

type AddParticipantsModalProps = {
    event: Event;
    isOpen: boolean;
    onClose: () => void;
    onSendInvites?: (emails: string[]) => void;
};

/**
 * AddParticipantsModal - Centered modal for adding participants to an event via email.
 * Features email tag input using react-multi-email package.
 */
export default function AddParticipantsModal({
    event: initialEvent,
    isOpen,
    onClose,
    onSendInvites,
}: AddParticipantsModalProps) {
    const [emails, setEmails] = useState<string[]>([]);
    const [isInviting, setIsInviting] = useState(false);

    const { data: eventDetails, isLoading, refetch } = useQuery({
        queryKey: ["event", initialEvent._id],
        queryFn: async () => {
            const res = await $getEvent(initialEvent._id);
            if (res instanceof AppError) throw res;
            return res as Event;
        },
        enabled: isOpen, // Only fetch when open
        initialData: initialEvent, // Use passed event as initial data (optimistic)
    });


    const attendees = eventDetails?.attendees || [];

    const participants: Participant[] = attendees.map((attendee) => ({
        ...attendee,
    }));

    const handleSendInvites = async () => {
        if (emails.length > 0) {
            setIsInviting(true);
            const res = await $inviteAttendees({
                eventId: initialEvent._id,
                emails,
            });
            setIsInviting(false);

            if (res.success) {
                toast.success(res.success);
                setEmails([]);
                refetch(); // Refresh list
                onSendInvites?.(emails); // Optional callback if parent needs it
            } else if (res.error) {
                toast.error(res.error);
            }
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(paths.eventInviteSingle(initialEvent._id, true)).then(() => {
            toast.success("Link copied to clipboard");
        }).catch(() => {
            toast.error("Failed to copy link to clipboard");
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-4 py-3">

                    <div className="border-b mb-2 border-gray-100 flex flex-row items-center justify-between space-y-0 shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-50 rounded-lg">
                                <LuCalendar className="w-4 h-4 text-brand-primary" />
                            </div>
                            <DialogTitle className="text-base font-semibold text-gray-900">
                                Add Participants
                            </DialogTitle>
                        </div>

                    </div>
                    {/* Email Input Section */}
                    <div className="">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Invite users
                        </label>
                        <div className="flex gap-2 items-stretch">
                            <div className="flex-1">
                                <ReactMultiEmail
                                    placeholder="Enter email addresses"
                                    emails={emails}
                                    onChange={setEmails}
                                    getLabel={(email, index, removeEmail) => (
                                        <div
                                            key={index}
                                            data-tag
                                            className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-2.5 py-1 rounded-full text-sm mr-1.5 mb-1"
                                        >
                                            <span>{email}</span>
                                            <button
                                                type="button"
                                                data-tag-handle
                                                onClick={() => removeEmail(index)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <LuX className="w-3 h-3" />
                                            </button>
                                        </div>
                                    )}
                                    className="react-multi-email-custom"
                                />
                            </div>
                            <button
                                onClick={handleSendInvites}
                                disabled={emails.length === 0 || isInviting}
                                className="flex items-center gap-1.5 px-3 py-3 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors h-fit whitespace-nowrap"
                            >
                                {isInviting ? <LuLoader className="w-3.5 h-3.5 animate-spin" /> : <LuSend className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-100 mt-3" />
                </DialogHeader>

                <div className="absolute right-12 top-4">
                    <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-1.5 text-brand-primary hover:text-brand-primary-dark transition-colors text-sm font-medium"
                    >
                        Copy link
                        <LuLink className="w-3.5 h-3.5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-4">

                    {isLoading ? (
                        <div className="text-center py-4 text-gray-500">Loading attendees...</div>
                    ) : (
                        <div className="space-y-2">
                            {participants.map((participant) => (
                                <div
                                    key={participant._id}
                                    className="flex items-center justify-between py-2"
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            src={participant.account?.avatar}
                                            alt={participant.fullname}
                                            size={36}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {participant.fullname}
                                            </p>
                                            <p className="text-xs text-brand-primary">
                                                {participant.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`text-xs uppercase font-semibold ${participant.status === "invited"
                                                ? "text-blue-500"
                                                : participant.status === "accepted"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            {participant.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {participants.length === 0 && (
                                <p className="text-sm text-gray-500 text-center italic">No participants yet.</p>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
