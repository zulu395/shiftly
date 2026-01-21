"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { LuCalendar, LuClock, LuMapPin, LuUser } from "react-icons/lu";
import type { Event } from "@/types/event";
import Avatar from "../common/Avatar";
import { $getEvent } from "@/actions/events/getEvent";
import { AppError } from "@/utils/appError";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { $getAccountFromSession } from "@/actions/account/account";
import CancelEventForm from "./CancelEventForm";

type EventDetailsModalProps = {
    event: Event | null;
    open: boolean;
    onClose: () => void;
};

export default function EventDetailsModal({
    event,
    open,
    onClose,
}: EventDetailsModalProps) {
    const { data: eventDetails, } = useQuery({
        queryKey: ["event", event?._id],
        queryFn: async () => {
            const res = await $getEvent(event!._id);
            if (res instanceof AppError) throw res;
            return res as Event;
        },
        enabled: open && !!event, // Only fetch when open
        initialData: event, // Use passed event as initial data (optimistic)
    });

    const [confirmCancelOpen, setConfirmCancelOpen] = useState(false);

    const { data: account } = useQuery({
        queryKey: ["account"],
        queryFn: async () => {
            const res = await $getAccountFromSession();
            if (res instanceof AppError) return null;
            return res;
        }
    });

    if (!event) return null;

    const isCompany = account?.role === "company";
    const isCancelled = eventDetails?.status === "cancelled";

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden max-h-[85vh] flex flex-col">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex justify-between items-start">
                        <div>
                            <DialogTitle className="text-xl font-bold flex items-center gap-2">
                                {event.title}
                                {isCancelled && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full border border-red-200">Cancelled</span>}
                            </DialogTitle>
                            <p className="text-sm text-gray-500 mt-1">{event.description}</p>
                        </div>
                        {isCompany && !isCancelled && (
                            <button
                                onClick={() => setConfirmCancelOpen(true)}
                                className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                Cancel Event
                            </button>
                        )}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 pt-2">
                    {/* Key Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <LuCalendar className="w-4 h-4 text-brand-primary" />
                            <span>{format(new Date(event.date), "MMMM do, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <LuClock className="w-4 h-4 text-brand-primary" />
                            <span>{event.duration}</span>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-2 text-sm text-gray-700 col-span-2">
                                <LuMapPin className="w-4 h-4 text-brand-primary" />
                                <span>{event.location}</span>
                            </div>
                        )}
                        {event.timezone && (
                            <div className="flex items-center gap-2 text-sm text-gray-700 col-span-2">
                                <span className="font-medium text-xs bg-gray-100 px-2 py-1 rounded">
                                    {event.timezone}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 my-4" />

                    {/* Attendees */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <LuUser className="w-4 h-4" />
                        Attendees
                    </h3>

                    <div className="space-y-3">
                        {eventDetails?.attendees && eventDetails.attendees.length > 0 ? (
                            eventDetails.attendees.map((attendee) => (
                                <div key={attendee._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            src={attendee.account?.avatar}
                                            alt={attendee.fullname} // Avatar component uses Name
                                            size={32}
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{attendee.fullname}</p>
                                            <p className="text-xs text-gray-500">{attendee.email}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <StatusBadge status={attendee.status} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-500 italic">No attendees found.</p>
                        )}
                    </div>
                </div>
            </DialogContent>

            {/* Confirmation Modal */}
            <Dialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Cancel Event?</DialogTitle>
                    </DialogHeader>
                    <div className="py-4 text-gray-600 text-sm">
                        Are you sure you want to cancel this event? This action will notify all regular attendees via email.
                    </div>
                    <div className="flex justify-end gap-3 mt-4">

                        <CancelEventForm
                            eventId={event._id}
                            onSuccess={() => {
                                setConfirmCancelOpen(false);
                                onClose();
                            }}
                            onCancel={() => setConfirmCancelOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}

function StatusBadge({ status }: { status: string }) {
    const styles = {
        invited: "bg-blue-50 text-blue-700 border-blue-100",
        accepted: "bg-green-50 text-green-700 border-green-100",
        rejected: "bg-red-50 text-red-700 border-red-100",
    } as const;

    const style = styles[status as keyof typeof styles] || styles.invited;

    return (
        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${style}`}>
            {status}
        </span>
    );
}
