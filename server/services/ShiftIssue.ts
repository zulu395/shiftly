import { connectDB } from "@/server/db/connect";
import ShiftIssue, { IShiftIssue } from "@/server/models/ShiftIssue";
import { ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";

const create = async (
  data: Partial<IShiftIssue>
): Promise<ServiceResponse<IShiftIssue>> => {
  await connectDB();
  try {
    const issue = await ShiftIssue.create(data);
    return JSON.parse(JSON.stringify(issue));
  } catch (error) {
    console.error("Error creating shift issue:", error);
    return new AppError("Failed to create shift issue");
  }
};

const getAll = async (
  companyId: string
): Promise<ServiceResponse<IShiftIssue[]>> => {
  await connectDB();
  try {
    const issues = await ShiftIssue.find()
      .populate({
        path: "shift",
        match: { company: companyId },
      })
      .populate("reportedBy", "account dummyName dummyEmail")
      .populate("resolvedBy", "fullname email")
      .sort({ createdAt: -1 });

    // Filter out issues where shift is null (doesn't belong to company)
    const filteredIssues = issues.filter((issue) => issue.shift !== null);

    return JSON.parse(JSON.stringify(filteredIssues));
  } catch (error) {
    console.error("Error fetching shift issues:", error);
    return new AppError("Failed to fetch shift issues");
  }
};

const getByEmployee = async (
  employeeId: string
): Promise<ServiceResponse<IShiftIssue[]>> => {
  await connectDB();
  try {
    const issues = await ShiftIssue.find({ reportedBy: employeeId })
      .populate("shift")
      .populate("reportedBy", "account dummyName dummyEmail")
      .populate("resolvedBy", "fullname email")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(issues));
  } catch (error) {
    console.error("Error fetching employee shift issues:", error);
    return new AppError("Failed to fetch shift issues");
  }
};

const getById = async (id: string): Promise<ServiceResponse<IShiftIssue>> => {
  await connectDB();
  try {
    const issue = await ShiftIssue.findById(id)
      .populate("shift")
      .populate("reportedBy", "account dummyName dummyEmail")
      .populate("resolvedBy", "fullname email");

    if (!issue) return new AppError("Shift issue not found");

    return JSON.parse(JSON.stringify(issue));
  } catch (error) {
    console.error("Error fetching shift issue:", error);
    return new AppError("Failed to fetch shift issue");
  }
};

const markResolved = async (
  id: string,
  resolvedBy: string
): Promise<ServiceResponse<IShiftIssue>> => {
  await connectDB();
  try {
    const issue = await ShiftIssue.findByIdAndUpdate(
      id,
      {
        status: "resolved",
        resolvedBy,
        resolvedAt: new Date(),
      },
      { new: true }
    )
      .populate("shift")
      .populate("reportedBy", "account dummyName dummyEmail")
      .populate("resolvedBy", "fullname email");

    if (!issue) return new AppError("Shift issue not found");

    return JSON.parse(JSON.stringify(issue));
  } catch (error) {
    console.error("Error resolving shift issue:", error);
    return new AppError("Failed to resolve shift issue");
  }
};

export const ShiftIssueService = {
  create,
  getAll,
  getByEmployee,
  getById,
  markResolved,
};
