import mongoose, { Schema, Document } from "mongoose";

export interface IShiftIssue extends Document {
  shift: mongoose.Types.ObjectId;
  reportedBy: mongoose.Types.ObjectId;
  reason: string;
  description: string;
  status: "pending" | "resolved";
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ShiftIssueSchema = new Schema<IShiftIssue>(
  {
    shift: {
      type: Schema.Types.ObjectId,
      ref: "Shift",
      required: true,
    },
    reportedBy: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: "Account",
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
ShiftIssueSchema.index({ shift: 1 });
ShiftIssueSchema.index({ reportedBy: 1 });
ShiftIssueSchema.index({ status: 1 });
ShiftIssueSchema.index({ createdAt: -1 });

const ShiftIssue =
  mongoose.models.ShiftIssue ||
  mongoose.model<IShiftIssue>("ShiftIssue", ShiftIssueSchema);

export default ShiftIssue;
