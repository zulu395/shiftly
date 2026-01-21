import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShift extends Document {
  date: Date;
  startTime: string;
  endTime: string;
  position: string;
  location?: string;
  break?: string;
  details?: string;
  hourlyRate: number;
  totalPay: number;
  duration: string;
  status: "assigned" | "unassigned";
  repeat?: string;
  employee?: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  groupId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShiftSchema: Schema<IShift> = new Schema(
  {
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
    startTime: {
      type: String,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: String,
      required: [true, "End time is required"],
    },
    position: {
      type: String,
      required: [true, "Position is required"],
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    break: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    hourlyRate: {
      type: Number,
      required: [true, "Hourly rate is required"],
      default: 0,
    },
    totalPay: {
      type: Number,
      default: 0,
    },
    duration: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["assigned", "unassigned"],
      default: "unassigned",
    },
    repeat: {
      type: String,
      trim: true,
      default: "Never",
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "Company reference is required"],
    },
    groupId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying by date range and company
ShiftSchema.index({ company: 1, date: 1 });
ShiftSchema.index({ employee: 1, date: 1 });

const Shift: Model<IShift> =
  mongoose.models.Shift || mongoose.model<IShift>("Shift", ShiftSchema);

export default Shift;
