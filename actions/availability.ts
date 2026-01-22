"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { AvailabilityService } from "@/server/services/Availability";
import { IAvailability, IAvailabilityDay } from "@/server/models/Availability";
import { AppError } from "@/utils/appError";
import { format, startOfWeek } from "date-fns";
import Employee, { IEmployeePopulated } from "@/server/models/Employee";
import Account from "@/server/models/Account";
import { connectDB } from "@/server/db/connect";
import { EmailService } from "@/server/services/EmailService";

async function getEmployeeForAccount(accountId: string) {
  await connectDB();
  const employee = await Employee.findOne({
    account: accountId,
    status: { $ne: "deleted" },
  });
  return employee;
}

export async function $getAvailability(weekDate?: string | Date) {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  const employee = await getEmployeeForAccount(String(account._id));
  if (!employee) {
    return new AppError("Employee profile not found");
  }

  // Default to current week if not provided
  const targetDate = weekDate ? new Date(weekDate) : new Date();
  const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 });

  return await AvailabilityService.get(String(employee._id), weekStart);
}

export async function $updateAvailability(
  days: IAvailabilityDay[],
  weekDate?: string | Date,
) {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  const employee = await getEmployeeForAccount(String(account._id));
  if (!employee) {
    return new AppError("Employee profile not found");
  }

  const targetDate = weekDate ? new Date(weekDate) : new Date();
  const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 });

  const result = await AvailabilityService.update(
    String(account._id),
    String(employee._id),
    days,
    weekStart,
  );

  // Send Email Notification to Company Admin
  try {
    const companyAccount = await Account.findById(employee.company);
    if (companyAccount) {
      await EmailService.availabilityUpdate({
        employeeName: account.fullname,
        weekDateString: format(weekStart, "PPP"),
        dashboardLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/staff-scheduling`,
      })({
        to: companyAccount.email,
        subject: `Availability Update: ${account.fullname}`,
      });
    }
  } catch (error) {
    console.error("Failed to send availability update email:", error);
    // Don't fail the request if email fails, just log it.
  }

  return result;
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
    const shiftDate = new Date(date);
    const weekStart = startOfWeek(shiftDate, { weekStartsOn: 1 });
    const dayOfWeek = format(shiftDate, "EEEE");

    const availabilities = await AvailabilityService.getForEmployees(
      employeeIds,
      weekStart,
    );

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
        continue; // Conflict found
      }

      // 3. Check Location
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
  } catch (error) {
    console.error("Conflict check error:", error);
    return { conflict: false, message: "" };
  }
}

export type AvailabilityWithEmployee = {
  employee: IEmployeePopulated;
  availability: IAvailability | null;
};

export async function $getCompanyAvailability(
  weekDate?: string | Date,
): Promise<AvailabilityWithEmployee[] | AppError> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }

  const companyId = String(account._id);
  const targetDate = weekDate ? new Date(weekDate) : new Date();
  const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 });

  await connectDB();

  try {
    const employees = await Employee.find({
      company: companyId,
      status: { $ne: "deleted" },
    })
      .populate("account")
      .populate("company");

    if (!employees || employees.length === 0) {
      return [];
    }

    const employeeIds = employees.map((e) => e._id.toString());
    const availabilities = await AvailabilityService.getForEmployees(
      employeeIds,
      weekStart,
    );

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
