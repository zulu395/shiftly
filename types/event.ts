import { SerializableEvent } from "@/server/models/Event";

export type EventStatus = "upcoming" | "past";

export type EventAttendeeStatus = "invited" | "accepted" | "rejected";

export type EventAttendee = {
  _id: string;
  event: string;
  account?: {
    _id: string;
    avatar?: string;
  };
  fullname: string;
  email: string;
  status: EventAttendeeStatus;
  rejectReason?: string;
};

export type Event = SerializableEvent & {
  _id: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  location?: string;
  locationUrl?: string;
  attendees?: EventAttendee[];
  attendeeCount?: number; // Virtual or calculated
  createdAt: string;
  updatedAt: string;
};

export type EventFilterTab = "all" | "upcoming" | "past";
