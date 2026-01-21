import { connectDB } from "@/server/db/connect";
import Employee, {
  IEmployee,
  IEmployeePopulated,
} from "@/server/models/Employee";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import { EmailService } from "./EmailService";
import Account from "../models/Account";
import { CONFIG } from "@/utils/constants";

const createMany = async (
  data: Partial<IEmployee>[]
): Promise<ServiceResponse<boolean>> => {
  await connectDB();

  for (const employeeData of data) {
    // Check if email already exists for this company or globally as user?
    // Use dummyEmail as per model schema for unverified employees?
    // User requested to ignore if email exists.
    // Assuming check logic based on dummyEmail for invited employees.
    const exists = await Employee.findOne({
      dummyEmail: employeeData.dummyEmail,
      company: employeeData.company,
    });

    if (exists) continue;

    await Employee.create(employeeData);

    const company = await Account.findById(employeeData.company);
    EmailService.employeeInvitation({
      employeeName: employeeData.dummyName || "Employee",
      companyName: company?.companyName || "Your Company",
      link: `${CONFIG.website.host}/register?invitation=${employeeData.dummyEmail}`,
    })({
      to: employeeData.dummyEmail!,
      subject: `Invitation to join ${company?.companyName || "a company"} on ${CONFIG.website.name}`,
    });
  }

  return true;
};

const create = async (
  data: Partial<IEmployee>
): Promise<ServiceResponse<IEmployee>> => {
  await connectDB();
  try {
    const employee = await Employee.create(data);

    const company = await Account.findById(data.company);
    EmailService.employeeInvitation({
      employeeName: data.dummyName || "Employee",
      companyName: company?.companyName || "Your Company",
      link: `${CONFIG.website.host}/register?invitation=${data.dummyEmail}`,
    })({
      to: data.dummyEmail!,
      subject: `Invitation to join ${company?.companyName || "a company"} on ${CONFIG.website.name}`,
    });

    return JSON.parse(JSON.stringify(employee));
  } catch {
    return new AppError("Failed to create employee", {
      description: "An error occurred while creating the employee record.",
    });
  }
};

const getAll = async (
  companyId: string
): Promise<ServiceResponse<IEmployee[]>> => {
  await connectDB();
  try {
    const employees = await Employee.find({
      status: { $ne: "deleted" },
      company: companyId,
    })
      .sort({ createdAt: -1 })
      .populate("account")
      .populate("company")
      .lean();
    return JSON.parse(JSON.stringify(employees));
  } catch {
    return new AppError("Failed to fetch employees", {
      description: "An error occurred while fetching the employee list.",
    });
  }
};

const update = async (
  id: string,
  data: Partial<IEmployee>
): Promise<ServiceResponse<IEmployee>> => {
  await connectDB();
  try {
    const employee = await Employee.findByIdAndUpdate(id, data, { new: true });
    if (!employee) return new AppError("Employee not found");
    return JSON.parse(JSON.stringify(employee));
  } catch {
    return new AppError("Failed to update employee");
  }
};

const remove = async (id: string): Promise<ServiceResponse<boolean>> => {
  await connectDB();
  try {
    const employee = await Employee.findByIdAndUpdate(id, {
      status: "deleted",
    });
    if (!employee) return new AppError("Employee not found");
    return true;
  } catch {
    return new AppError("Failed to delete employee");
  }
};

const getByAccount = async (
  accountId: string
): Promise<ServiceResponse<IEmployee>> => {
  await connectDB();
  try {
    const employee = await Employee.findOne({
      account: accountId,
      status: { $ne: "deleted" },
    });

    if (!employee) return new AppError("Employee not found");
    return JSON.parse(JSON.stringify(employee));
  } catch {
    return new AppError("Failed to fetch employee");
  }
};

const getManyByIds = async (
  ids: string[]
): Promise<ServiceResponse<IEmployeePopulated[]>> => {
  await connectDB();
  try {
    const employees = await Employee.find({ _id: { $in: ids } }).populate(
      "account"
    );
    return JSON.parse(JSON.stringify(employees));
  } catch {
    return new AppError("Failed to fetch employees");
  }
};

export const EmployeeService = {
  createMany,
  create,
  getAll,
  update,
  delete: remove,
  getByAccount,
  getManyByIds,
};
