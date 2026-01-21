import { $getAccountFromSession } from "@/actions/account/account";
import EventInvitationForm from "@/components/events/EventInvitationForm";
import Avatar from "@/components/common/Avatar";
import { EventService } from "@/server/services/Event";
import { AppError } from "@/utils/appError";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LuCalendar, LuMapPin, LuUsers } from "react-icons/lu";
import { format } from "date-fns";

type PageProps = {
    params: Promise<{ slug: string }>;
};

export default async function EventInvitationPage({ params }: PageProps) {
    const { slug } = await params;

    // Fetch real event
    const eventRes = await EventService.getById(slug);

    if (eventRes instanceof AppError || eventRes.status === "cancelled") {
        return notFound();
    }

    const event = eventRes;

    // Get current user for email prefill
    const account = await $getAccountFromSession();
    const prefilledEmail = !(account instanceof AppError) ? account?.email : "";

    // Format date for display
    const formattedDate = format(new Date(event.date), "EEE, MMM do, yyyy");
    // const timeRange = event.startTime && event.endTime // Assuming these fields exist in model or handled via duration/date logic if added later. 
    //     // Based on model review, startTime/endTime are optional strings.
    //     ? `${event.startTime}—${event.endTime} (${event.timezone || "UTC"})`
    //     : "";

    const displayedAttendees = event.attendees?.slice(0, 5) || [];
    const remainingCount = (event.attendees?.length || 0) - displayedAttendees.length;



    return (
        <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {event.title}
                    </h1>
                    <p className="text-gray-600">
                        Please Respond below. Your response will be sent to the organizer
                    </p>
                </div>

                {/* Event Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    {/* Time and Date */}
                    <div className="flex items-start gap-3 mb-4">
                        <LuCalendar className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <span className="text-sm text-gray-500 mr-2">Time and Date:</span>
                            <span className="text-sm text-gray-900">
                                {formattedDate} {event.duration ? `• ${event.duration}` : ""}
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    {event.location && (
                        <div className="flex items-start gap-3 mb-4">
                            <LuMapPin className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="text-sm text-gray-500 mr-2">Location</span>
                                <Link
                                    href={event.locationUrl ?? ""}
                                    target="_blank"
                                    className="text-sm text-brand-primary hover:underline inline-flex items-center gap-1"
                                >
                                    {event.location}
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Guest */}
                    <div className="flex items-center gap-3 mb-6">
                        <LuUsers className="w-5 h-5 text-gray-400 shrink-0" />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">Guests:</span>
                            <div className="flex -space-x-2">
                                {displayedAttendees.map((attendee, index) => (
                                    <div
                                        key={attendee._id}
                                        className="relative"
                                        style={{ zIndex: displayedAttendees.length - index }}
                                    >
                                        <Avatar
                                            src={attendee.account?.avatar}
                                            alt={attendee.fullname}
                                            size={28}
                                        />
                                    </div>
                                ))}
                                {remainingCount > 0 && (
                                    <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-white flex items-center justify-center text-xs font-semibold text-white relative z-0">
                                        +{remainingCount}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Description:</h3>
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                            {event.description}
                        </p>
                    </div>

                    {/* Respond Section */}
                    <EventInvitationForm
                        eventId={event._id}
                        prefilledEmail={prefilledEmail || undefined}
                    />
                </div>
            </div>
        </main>
    );
}
