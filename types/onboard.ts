import { IAccount } from "@/server/models/Account";
import { IEmployee } from "@/server/models/Employee";

export interface Invite extends Omit<IEmployee, "company" | "_id"> {
  company: IAccount;
  _id: string;
}
