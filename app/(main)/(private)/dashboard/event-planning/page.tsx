"use client";

import { useMemo, useState } from "react";
import { LuPlus } from "react-icons/lu";
import type { Event, EventFilterTab } from "@/types/event";
import Header from "./Header";
import EventCard from "@/components/events/EventCard";
import NewEventModal from "@/components/events/NewEventModal";
import AddParticipantsModal from "@/components/events/AddParticipantsModal";
import EventDetailsModal from "@/components/events/EventDetailsModal";
import { useQuery } from "@tanstack/react-query";
import { $getEvents } from "@/actions/events/getEvents";
import { $getAccountFromSession } from "@/actions/account/account";
import { AppError } from "@/utils/appError";

export default function EventPlanningPage() {
    const [currentTab, setCurrentTab] = useState<EventFilterTab>("all");
    const [selectedEventForParticipants, setSelectedEventForParticipants] =
        useState<Event | null>(null);
    const [selectedEventDetails, setSelectedEventDetails] = useState<Event | null>(null);

    const { data: account } = useQuery({
        queryKey: ["account"],
        queryFn: async () => {
            const res = await $getAccountFromSession();
            if (res instanceof AppError) return null;
            return res;
        }
    });

    const { data: events = [], isLoading } = useQuery({
        queryKey: ["events"],
        queryFn: async () => {
            const res = await $getEvents();
            if (res instanceof AppError) throw res;
            return res;
        }
    });

    const filteredEvents = useMemo(() => {
        if (currentTab === "all") return events;
        if (currentTab === "upcoming") {
            return events.filter(e => new Date(e.date) >= new Date());
        }
        return events.filter(e => new Date(e.date) < new Date());
    }, [events, currentTab]);

    const handleMenuClick = (event: Event) => {
        // TODO: Open event menu/options
        console.log("Menu clicked for event:", event._id);
    };

    const handleAddAttendee = (event: Event) => {
        // Stop bubbling if card click opens details
        // e.stopPropagation(); is needed if called from button inside card
        setSelectedEventForParticipants(event);
    };

    const handleCardClick = (event: Event) => {
        setSelectedEventDetails(event);
    }

    const handleCloseParticipantsModal = () => {
        setSelectedEventForParticipants(null);
    };

    const handleSendInvites = (emails: string[]) => {
        console.log("Sending invites to:", emails);
    };

    return (
        <>
            <section className="app-container-fluid app-container-fluid-y">
                <Header
                    currentTab={currentTab}
                    onTabChange={setCurrentTab}
                    createButton={
                        account?.role === "company" ? (
                            <NewEventModal>
                                <button className="btn btn-primary py-2! px-4! flex items-center gap-2">
                                    <LuPlus className="w-4 h-4" />
                                    <span className="text-white">Create Event</span>
                                </button>
                            </NewEventModal>
                        ) : null
                    }
                />

                {/* Events Grid */}
                {isLoading ? (
                    <div className="mt-12 text-center text-gray-500">Loading events...</div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                onMenuClick={handleMenuClick}
                                onAddAttendee={(e) => {
                                    // wrapper to stop propagation if necessary
                                    handleAddAttendee(e);
                                }}
                                onClick={handleCardClick}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && filteredEvents.length === 0 && (
                    <div className="mt-12 text-center">
                        <p className="text-gray-500">No events found.</p>
                    </div>
                )}
            </section>

            {/* Add Participants Modal (For existing events) */}
            {selectedEventForParticipants && (
                <AddParticipantsModal
                    event={selectedEventForParticipants}
                    isOpen={!!selectedEventForParticipants}
                    onClose={handleCloseParticipantsModal}
                    onSendInvites={handleSendInvites}
                />
            )}

            {/* Event Details Modal */}
            <EventDetailsModal
                event={selectedEventDetails}
                open={!!selectedEventDetails}
                onClose={() => setSelectedEventDetails(null)}
            />
        </>
    );
}


