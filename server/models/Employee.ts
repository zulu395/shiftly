import mongoose, { Schema, Document, Model } from "mongoose";
import { IAccount } from "./Account";

export interface IEmployee extends Document {
  account: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  dummyEmail: string;
  dummyName: string;
  jobTitle?: string;
  hourlyRate?: number;
  status: "active" | "inactive" | "invited" | "deleted";
  isAdmin: boolean; // Can manage other employees/shifts for this company?
  createdAt: Date;
  updatedAt: Date;
}
export interface IEmployeePopulated extends Omit<
  IEmployee,
  "account" | "company"
> {
  account: IAccount;
  company: IAccount;
}
const EmployeeSchema: Schema<IEmployee> = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: false,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    dummyEmail: {
      type: String,
      trim: true,
      required: true,
    },
    dummyName: {
      type: String,
      trim: true,
      required: true,
    },
    jobTitle: {
      type: String,
      trim: true,
    },
    hourlyRate: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "invited", "deleted"],
      default: "active",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user is an employee of a company only once
EmployeeSchema.index(
  { account: 1, company: 1 },
  {
    unique: true,
    partialFilterExpression: { account: { $type: "objectId" } },
    name: "unique_employee_account_company_v2",
  }
);
EmployeeSchema.index({ company: 1, status: 1 });

const Employee: Model<IEmployee> =
  mongoose.models.Employee ||
  mongoose.model<IEmployee>("Employee", EmployeeSchema);

export default Employee;
