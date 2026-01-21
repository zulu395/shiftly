import { connectDB } from "@/server/db/connect";
import EventAttendee, { IEventAttendee } from "@/server/models/EventAttendee";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { EmailService } from "./EmailService";
import Event from "@/server/models/Event";
import { paths } from "@/utils/paths";

type InviteParams = {
  eventId: string;
  people: { fullname: string; email: string; account?: string }[];
};

const inviteMany = async ({
  eventId,
  people,
}: InviteParams): Promise<ServiceResponse<boolean>> => {
  await connectDB();
  try {
    const event = await Event.findById(eventId);
    if (!event) return new AppError("Event not found");

    for (const person of people) {
      // Check if already invited
      const exists = await EventAttendee.findOne({
        event: eventId,
        email: person.email,
      });

      if (!exists) {
        await EventAttendee.create({
          event: eventId,
          ...person,
        });

        // Send Email

        EmailService.eventInvitation({
          email: person.email,
          eventTitle: event.title,
          eventDate: event.date,
          link: paths.eventInviteSingle(eventId, true), // Adjust link as needed
        })({ to: person.email, subject: `Event Invitation: ${event.title}` });
      }
    }

    return true;
  } catch (error) {
    console.error({ error });

    return new AppError("Failed to invite attendees");
  }
};

const updateStatus = async (
  id: string,
  status: "accepted" | "rejected",
  rejectReason?: string,
): Promise<ServiceResponse<IEventAttendee>> => {
  await connectDB();
  try {
    const attendee = await EventAttendee.findByIdAndUpdate(
      id,
      { status, rejectReason },
      { new: true },
    );
    if (!attendee) return new AppError("Attendee not found");
    return JSON.parse(JSON.stringify(attendee));
  } catch {
    return new AppError("Failed to update status");
  }
};

const updateStatusByEmail = async (
  eventId: string,
  email: string,
  status: "accepted" | "rejected",
  rejectReason?: string,
): Promise<ServiceResponse<IEventAttendee>> => {
  await connectDB();
  try {
    const attendee = await EventAttendee.findOneAndUpdate(
      { event: eventId, email },
      { status, rejectReason },
      { new: true },
    );
    if (!attendee) return new AppError("You were not invited for this event");
    return JSON.parse(JSON.stringify(attendee));
  } catch {
    return new AppError("Failed to update status");
  }
};

export const EventAttendeeService = {
  inviteMany,
  updateStatus,
  updateStatusByEmail,
};
