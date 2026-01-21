"use client";

import { TIMEZONE_DATA } from "@/data/timezones";
import { EVENT_DATA } from "@/data/events";
import AppInput from "../form/AppInput";
import AppSelect from "../form/AppSelect";
import FormButton from "../form/FormButton";
import SideModal from "../layout/SideModal";
import EmployeesPicker from "../shifts/EmployeesPicker";
import { useState } from "react";
import { useAppActionState } from "@/hooks/useAppActionState";
import { $createEvent } from "@/actions/events/createEvent";
import { toast } from "sonner";

type NewEventModalProps = {
    children: React.ReactNode;
};

/**
 * NewEventModal - Side modal for creating a new event.
 */
export default function NewEventModal({ children }: NewEventModalProps) {
    const [open, setOpen] = useState(false);
    const [participants, setParticipants] = useState<string[]>([]);

    const { action, submitting, state } = useAppActionState($createEvent, {
        onSuccess: () => {
            toast.success("Event created successfully");
            setOpen(false);
            setParticipants([]);
        },
    });

    return (
        <SideModal
            open={open}
            onOpenChange={setOpen}
            trigger={children}
            title="Create a New Event"
            subtitle="Add the details below to schedule the event and invite participants."
        >
            <form action={action} className="grid gap-4 py-4 px-1">
                {/* Title of Event */}
                <AppInput
                    name="title"
                    placeholder="Enter event title"
                    title="Title of Event"
                    type="text"
                    required
                    error={state.fieldErrors?.title}
                />

                {/* Event type/category */}
                <AppSelect
                    name="category"
                    title="Event type/category"
                    options={EVENT_DATA.categories}
                    placeholder="Select category"
                    error={state.fieldErrors?.category}
                />

                {/* Start Date */}
                <div className="grid grid-cols-2 gap-4">
                    <AppInput
                        name="startDate"
                        placeholder="00 / 00 / 0000"
                        title="Start Date"
                        type="datetime-local" // Changed to datetime-local for convenience
                        required
                        error={state.fieldErrors?.startDate}
                    />

                    {/* Duration */}
                    <AppSelect
                        name="duration"
                        title="Duration"
                        options={EVENT_DATA.durations}
                        placeholder="Select duration"
                        defaultValue="30 mins"
                        error={state.fieldErrors?.duration}
                    />
                </div>

                {/* Location */}
                <AppInput
                    name="location"
                    placeholder="Add Location name"
                    title="Location Name"
                    type="text"
                    error={state.fieldErrors?.location}
                />
                <AppInput
                    name="locationUrl"
                    placeholder="Add Location url for maps"
                    title="Location URL"
                    type="url"
                    error={state.fieldErrors?.location}
                />

                {/* Participants */}
                <EmployeesPicker
                    value={participants}
                    onChange={setParticipants}
                    error={state.fieldErrors?.participants}
                />
                <input type="hidden" name="participants" value={participants.join(",")} />

                {/* Time zone (Optional) */}
                <AppSelect
                    name="timezone"
                    title="Time zone (Optional)"
                    options={TIMEZONE_DATA.timeZones}
                    placeholder="Select timezone"
                    defaultValue="UTC"
                    error={state.fieldErrors?.timezone}
                />

                {state.error && (
                    <p className="text-red-500 text-sm">{state.error}</p>
                )}

                <FormButton loading={submitting} className="btn btn-primary mt-2">
                    Create and Invite
                </FormButton>
            </form>
        </SideModal>
    );
}
