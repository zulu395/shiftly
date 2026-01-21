"use client";

import type { Event } from "@/types/event";
import { LuPlus } from "react-icons/lu";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

type EventCardProps = {
    event: Event;
    onMenuClick?: (event: Event) => void;
    onAddAttendee?: (event: Event) => void;
    onClick?: (event: Event) => void;
};

/**
 * EventCard displays a single event with status badge, attendees, and details.
 */
export default function EventCard({
    event,
    onAddAttendee,
    onClick,
}: EventCardProps) {
    const displayedAttendees = event.attendees?.slice(0, 2) || [];
    const remainingCount = (event.attendeeCount || event.attendees?.length || 0) - displayedAttendees.length;
    const isPast = event.date < new Date().toISOString();

    return (
        <div

            onClick={() => event.status !== "cancelled" ? onClick?.(event) : null}
            className={cn("bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer", {
                "opacity-70 pointer-events-none": event.status === "cancelled",
            })}
        >
            {/* Header Row: Status Badge, Avatars, Add Button */}
            <div className="flex items-center justify-between mb-3">
                {
                    event.status === "cancelled" ? (
                        <span
                            className="text-xs font-medium px-2 py-0.5 rounded text-red-600 bg-red-50"
                        >
                            Cancelled
                        </span>
                    ) : (
                        <span
                            className={`text-xs font-medium px-2 py-0.5 rounded ${isPast
                                ? "text-gray-600 bg-gray-100"
                                : "text-green-600 bg-green-50"
                                }`}
                        >
                            {isPast ? "Past" : "Upcoming"}
                        </span>
                    )
                }

                <div className="flex items-center gap-1">
                    {/* Avatar Stack */}
                    <div className="flex -space-x-2">
                        {displayedAttendees.map((attendee, index) => (
                            <div
                                key={attendee._id}
                                className="w-7 h-7 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-700"
                                style={{ zIndex: displayedAttendees.length - index }}
                                title={attendee.fullname}
                            >
                                {attendee.fullname
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                            </div>
                        ))}
                        {remainingCount > 0 && (
                            <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs font-semibold text-white">
                                +{remainingCount}
                            </div>
                        )}
                    </div>

                    {/* Add Attendee Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddAttendee?.(event);
                        }}
                        className="w-7 h-7 rounded-full border border-dashed border-gray-300 flex items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors"
                        title="Add attendee"
                    >
                        <LuPlus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-1">
                {event.title}
            </h3>

            {/* Description Row with Menu Button */}
            <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-xs text-gray-600 line-clamp-2 flex-1">
                    {event.description}
                </p>

            </div>

            <div className="text-xs text-brand-primary font-medium">
                {event.duration} • {format(new Date(event.date), "EEE, MMM do")}
            </div>
        </div>
    );
}
