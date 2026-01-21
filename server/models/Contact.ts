import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  fullname: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  company?: string;
  linkedin?: string;
  timezone?: string;
  owner: mongoose.Types.ObjectId;
  status: "active" | "deleted";
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "deleted"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

ContactSchema.index({ owner: 1, email: 1 });

const Contact: Model<IContact> =
  mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
