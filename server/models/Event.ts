import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  duration?: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  locationUrl?: string;
  location?: string;
  company: mongoose.Types.ObjectId;
  status: "scheduled" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface SerializableEvent extends Omit<
  IEvent,
  | keyof Document
  | "date"
  | "startTime"
  | "endTime"
  | "createdAt"
  | "updatedAt"
  | "company"
> {
  _id: string;
  date: string;
  startTime?: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  company: string; // ID
}

const EventSchema: Schema<IEvent> = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
    },
    endTime: {
      type: String,
    },
    status: {
      type: String,
      enum: ["scheduled", "cancelled"],
      default: "scheduled",
    },
    timezone: {
      type: String,
    },
    locationUrl: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Company reference is required"],
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.index({ company: 1, date: 1 });

const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);

export default Event;
