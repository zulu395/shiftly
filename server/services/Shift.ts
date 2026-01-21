import { connectDB } from "@/server/db/connect";
import Shift, { IShift } from "@/server/models/Shift";
import { ANY, ServiceResponse } from "@/types";
import { AppError } from "@/utils/appError";
import mongoose from "mongoose";

const create = async (
  data: Partial<IShift> & { employees?: string[] }
): Promise<ServiceResponse<IShift[]>> => {
  await connectDB();
  try {
    const { employees, ...shiftData } = data;

    if (!employees || employees.length === 0) {
      const shift = await Shift.create({
        ...shiftData,
        status: shiftData.status || "unassigned",
      });
      return [JSON.parse(JSON.stringify(shift))];
    }

    const shifts = await Promise.all(
      employees.map((employeeId) =>
        Shift.create({
          ...shiftData,
          employee: new mongoose.Types.ObjectId(employeeId),
          status: shiftData.status || "assigned",
        })
      )
    );

    return JSON.parse(JSON.stringify(shifts));
  } catch (error) {
    console.error("Error creating shift:", error);
    return new AppError("Failed to create shift");
  }
};

const getAll = async (
  companyId: string
): Promise<ServiceResponse<IShift[]>> => {
  await connectDB();
  try {
    const shifts = await Shift.find({ company: companyId }).sort({
      date: 1,
      startTime: 1,
    });
    return JSON.parse(JSON.stringify(shifts));
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return new AppError("Failed to fetch shifts");
  }
};

const getByRange = async (
  companyId: string,
  start: Date,
  end: Date,
  filters?: {
    employeeIds?: string[];
    positions?: string[];
    status?: "published" | "not-published";
  }
): Promise<ServiceResponse<IShift[]>> => {
  await connectDB();
  try {
    const query: ANY = {
      company: companyId,
      date: { $gte: start, $lte: end },
    };

    if (filters) {
      if (filters.employeeIds && filters.employeeIds.length > 0) {
        query.employee = { $in: filters.employeeIds };
      }
      if (filters.positions && filters.positions.length > 0) {
        query.position = { $in: filters.positions };
      }
      if (filters.status) {
        if (filters.status === "published") {
          query.status = "assigned";
        } else if (filters.status === "not-published") {
          query.status = "unassigned";
        }
      }
    }

    const shifts = await Shift.find(query).sort({
      date: 1,
      startTime: 1,
    });
    return JSON.parse(JSON.stringify(shifts));
  } catch (error) {
    console.error("Error fetching shifts by range:", error);
    return new AppError("Failed to fetch shifts");
  }
};

const remove = async (
  id: string,
  companyId: string
): Promise<ServiceResponse<boolean>> => {
  await connectDB();
  try {
    const result = await Shift.deleteOne({ _id: id, company: companyId });
    return result.deletedCount > 0;
  } catch (error) {
    console.error("Error deleting shift:", error);
    return new AppError("Failed to delete shift");
  }
};

const update = async (
  id: string,
  companyId: string,
  data: Partial<IShift>
): Promise<ServiceResponse<IShift>> => {
  await connectDB();
  try {
    const shift = await Shift.findOneAndUpdate(
      { _id: id, company: companyId },
      { $set: data },
      { new: true }
    );
    if (!shift) return new AppError("Shift not found");
    return JSON.parse(JSON.stringify(shift));
  } catch (error) {
    console.error("Error updating shift:", error);
    return new AppError("Failed to update shift");
  }
};

const getByEmployeeAndRange = async (
  employeeId: string,
  start: Date,
  end: Date
): Promise<ServiceResponse<IShift[]>> => {
  await connectDB();
  try {
    const shifts = await Shift.find({
      employee: employeeId,
      date: { $gte: start, $lte: end },
    }).sort({
      date: 1,
      startTime: 1,
    });
    return JSON.parse(JSON.stringify(shifts));
  } catch (error) {
    console.error("Error fetching shifts by employee and range:", error);
    return new AppError("Failed to fetch shifts");
  }
};

export const ShiftService = {
  create,
  getAll,
  getByRange,
  getByEmployeeAndRange,
  remove,
  update,
};
