import { IAccount } from "@/server/models/Account";

export type PopulatedEmployee = {
  _id: string;
  account?: IAccount;
  company: IAccount;
  dummyEmail: string;
  dummyName: string;
  jobTitle?: string;
  hourlyRate?: number;
  status: "active" | "inactive" | "invited";
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};
