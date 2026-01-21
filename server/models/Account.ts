import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccount extends Document {
  fullname: string;
  email: string;
  phone?: string;
  password?: string;
  role: "company" | "employee";
  avatar?: string;
  // Company specific fields
  companyName?: string;
  companyAddress?: string;
  companyTotalEmployees?: string;
  companyNiche?: string;
  companyGoals?: string[];

  status: "active" | "inactive" | "suspended";
  hasOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AccountSchema: Schema<IAccount> = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address",
      ],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Do not return password by default
    },
    role: {
      type: String,
      enum: ["company", "employee"],
      default: "employee",
    },
    avatar: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyAddress: {
      type: String,
      trim: true,
    },
    companyTotalEmployees: {
      type: String,
      trim: true,
    },
    companyNiche: {
      type: String,
      trim: true,
    },
    companyGoals: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    hasOnboarded: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model recompilation error in Next.js
const Account: Model<IAccount> =
  mongoose.models.Account || mongoose.model<IAccount>("Account", AccountSchema);

export default Account;
