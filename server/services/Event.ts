import { connectDB } from "@/server/db/connect";
import Event, { IEvent } from "@/server/models/Event";
import EventAttendee from "@/server/models/EventAttendee";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { type Event as EventType } from "@/types/event";

const create = async (
  data: Partial<IEvent>,
): Promise<ServiceResponse<IEvent>> => {
  await connectDB();
  try {
    const event = await Event.create(data);
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error({ error });

    return new AppError("Failed to create event", {
      description: "An error occurred while creating the event.",
    });
  }
};

const getAll = async (
  companyId: string,
): Promise<ServiceResponse<EventType[]>> => {
  await connectDB();
  try {
    const events = await Event.find({ company: companyId })
      .sort({ date: 1 })
      .lean();
    return JSON.parse(JSON.stringify(events));
  } catch {
    return new AppError("Failed to fetch events");
  }
};

const getById = async (id: string): Promise<ServiceResponse<EventType>> => {
  await connectDB();
  try {
    const event = await Event.findById(id).lean();
    if (!event) return new AppError("Event not found");

    const attendees = await EventAttendee.find({ event: id })
      .populate("account", "avatar")
      .lean();

    return JSON.parse(JSON.stringify({ ...event, attendees }));
  } catch {
    return new AppError("Failed to fetch event");
  }
};

const remove = async (id: string): Promise<ServiceResponse<boolean>> => {
  await connectDB();
  try {
    await Event.findByIdAndDelete(id);
    await EventAttendee.deleteMany({ event: id });
    return true;
  } catch {
    return new AppError("Failed to delete event");
  }
};

const getForEmployee = async (
  email: string,
): Promise<ServiceResponse<EventType[]>> => {
  await connectDB();
  try {
    // Find all invitations for this email
    const invitations = await EventAttendee.find({ email }).select("event");
    const eventIds = invitations.map((inv) => inv.event);

    // Fetch the actual events
    const events = await Event.find({
      _id: { $in: eventIds },
      status: "invited",
    })
      .sort({ date: 1 })
      .lean();

    return JSON.parse(JSON.stringify(events));
  } catch {
    return new AppError("Failed to fetch events");
  }
};

const cancel = async (id: string): Promise<ServiceResponse<EventType>> => {
  await connectDB();
  try {
    const event = await Event.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true },
    ).lean();
    if (!event) return new AppError("Event not found");
    return JSON.parse(JSON.stringify(event));
  } catch {
    return new AppError("Failed to cancel event");
  }
};

export const EventService = {
  create,
  getAll,
  getForEmployee,
  getById,
  delete: remove,
  cancel,
};
