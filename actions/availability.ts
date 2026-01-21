"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { AvailabilityService } from "@/server/services/Availability";
import { IAvailability, IAvailabilityDay } from "@/server/models/Availability";
import { AppError } from "@/utils/appError";
import { format } from "date-fns";
import Employee, { IEmployeePopulated } from "@/server/models/Employee"; // Need to fetch Employee info
import { connectDB } from "@/server/db/connect";

async function getEmployeeForAccount(accountId: string) {
  await connectDB();
  // Find an active employee record for this account
  // If multiple, picking the first found active one? Or what logic?
  // Ideally, use a context logic if available. For now, findOne.
  const employee = await Employee.findOne({
    account: accountId,
    status: { $ne: "deleted" },
  });
  return employee;
}

export async function $getAvailability() {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  const employee = await getEmployeeForAccount(String(account._id));
  if (!employee) {
    // If no employee record found, maybe they are just an account without employee profile?
    return new AppError("Employee profile not found");
  }

  return await AvailabilityService.get(String(employee._id));
}

export async function $updateAvailability(days: IAvailabilityDay[]) {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  const employee = await getEmployeeForAccount(String(account._id));
  if (!employee) {
    return new AppError("Employee profile not found");
  }

  return await AvailabilityService.update(
    String(account._id),
    String(employee._id),
    days,
  );
}

export async function $checkShiftConflicts(
  employeeIds: string[],
  date: string,
  startTime: string,
  endTime: string,
  location: string = "Onsite",
): Promise<{ conflict: boolean; message: string }> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return { conflict: false, message: "" };
  }

  if (!employeeIds.length || !date || !startTime || !endTime) {
    return { conflict: false, message: "" };
  }

  try {
    const dayOfWeek = format(new Date(date), "EEEE");
    const availabilities =
      await AvailabilityService.getForEmployees(employeeIds);

    let conflictCount = 0;

    for (const empId of employeeIds) {
      const availability = availabilities.find(
        (a) => String(a.employeeId) === empId,
      );

      // Default: If no availability record, assume available (no constraints set)
      if (!availability) continue;

      const dayConfig = availability.days.find((d) => d.day === dayOfWeek);

      // Default: If no day config, assume available
      if (!dayConfig) continue;

      // 1. Check if user marked as Not Available
      if (!dayConfig.isAvailable) {
        conflictCount++;
        continue;
      }

      // 2. Check time range overlap
      if (startTime < dayConfig.startTime || endTime > dayConfig.endTime) {
        conflictCount++;
        continue; // Conflict found, count and move to next emp
      }

      // 3. Check Location
      // If employee is "Remote" and shift is "Onsite" -> Conflict
      // If employee is "Onsite", we assume they can do Onsite. Can they do Remote? Maybe?
      // Let's enforce strict match for now based on user request "check this".
      // Actually, if availability is "Remote", they likely cannot be "Onsite".
      // If availability is "Onsite", maybe they can handle Remote?
      // But let's assume if shift is Remote and they are Onsite, it's fine?
      // Or simply: Shift Location MUST === Availability Location?
      // User said: "to match the employee availability locations".
      // Let's assume strict equality for safety first.
      if (dayConfig.location && location && dayConfig.location !== location) {
        conflictCount++;
      }
    }

    if (conflictCount > 0) {
      return {
        conflict: true,
        message: `There is conflict with this shift and the employee(s) schedule (Time or Location)`,
      };
    }

    return { conflict: false, message: "" };

    return { conflict: false, message: "" };
  } catch (error) {
    console.error("Conflict check error:", error);
    return { conflict: false, message: "" };
  }
}

export type AvailabilityWithEmployee = {
  employee: IEmployeePopulated;
  availability: IAvailability | null;
};

export async function $getCompanyAvailability(): Promise<
  AvailabilityWithEmployee[] | AppError
> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  // Ensure only Company role calls this (or Admin?)
  // Assuming 'company' or similar role based on context found in other actions.
  // Actually, getAllEmployees logic has custom checks.
  // For now, assume if logged in as company, we fetch employees for that account (as company).

  const companyId = String(account._id);

  await connectDB();

  try {
    const employees = await Employee.find({
      company: companyId,
      status: { $ne: "deleted" },
    })
      .populate("account")
      .populate("company"); // To match PopulatedEmployee type broadly

    if (!employees || employees.length === 0) {
      return [];
    }

    const employeeIds = employees.map((e) => e._id.toString());
    const availabilities =
      await AvailabilityService.getForEmployees(employeeIds);

    const result: AvailabilityWithEmployee[] = employees.map((e) => {
      const av = availabilities.find(
        (a) => String(a.employeeId) === e._id.toString(),
      );
      return {
        employee: JSON.parse(JSON.stringify(e)) as IEmployeePopulated,
        availability: av ? av : null,
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching company availability:", error);
    return new AppError("Failed to fetch company availability");
  }
}

export const $getEmployeesAndAvailability = $getCompanyAvailability;
