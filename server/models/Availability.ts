import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAvailabilityDay {
  day: string; // "Monday", "Tuesday", etc.
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: "Remote" | "Onsite";
  isAvailable: boolean;
}

export interface IAvailability extends Document {
  accountId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  weekStartDate: Date;
  days: IAvailabilityDay[];
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AvailabilityDaySchema = new Schema<IAvailabilityDay>(
  {
    day: { type: String, required: true },
    startTime: { type: String, default: "09:00" },
    endTime: { type: String, default: "17:00" },
    location: {
      type: String,
      enum: ["Remote", "Onsite"],
      default: "Onsite",
    },
    isAvailable: { type: Boolean, default: true },
  },
  { _id: false },
);

const AvailabilitySchema: Schema<IAvailability> = new Schema(
  {
    accountId: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    days: [AvailabilityDaySchema],
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

AvailabilitySchema.index({ employeeId: 1, weekStartDate: 1 }, { unique: true });
AvailabilitySchema.index({ accountId: 1 });

const Availability: Model<IAvailability> =
  mongoose.models.Availability ||
  mongoose.model<IAvailability>("Availability", AvailabilitySchema);

export default Availability;
