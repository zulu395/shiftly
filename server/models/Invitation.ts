import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInvitation extends Document {
  email: string;
  role: "company" | "employee";
  token: string;
  expiresAt: Date;
  inviter: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "expired";
  createdAt: Date;
  updatedAt: Date;
}

const InvitationSchema: Schema<IInvitation> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["company", "employee"],
      default: "employee",
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    inviter: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Index to expire documents automatically? or just keep them and check date.
// Usually manual check is better if we want to show "Expired" status in UI.
// But we can add a TTL index on `expiresAt` if we want auto-deletion.
// Let's stick to logical expiry for now so we can show history.

const Invitation: Model<IInvitation> =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>("Invitation", InvitationSchema);

export default Invitation;
