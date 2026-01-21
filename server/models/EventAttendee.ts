import mongoose, { Schema, Document, Model } from "mongoose";

export type EventAttendeeStatus = "invited" | "accepted" | "rejected";

export interface IEventAttendee extends Document {
  event: mongoose.Types.ObjectId;
  account?: mongoose.Types.ObjectId;
  fullname: string;
  email: string;
  status: EventAttendeeStatus;
  rejectReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventAttendeeSchema: Schema<IEventAttendee> = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: ["invited", "accepted", "rejected"],
      default: "invited",
    },
    rejectReason: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

EventAttendeeSchema.index({ event: 1, email: 1 }, { unique: true });
EventAttendeeSchema.index({ account: 1 });

const EventAttendee: Model<IEventAttendee> =
  mongoose.models.EventAttendee ||
  mongoose.model<IEventAttendee>("EventAttendee", EventAttendeeSchema);

export default EventAttendee;
