"use server";

import { $getAccountFromSession } from "@/actions/account/account";
import { connectDB } from "@/server/db/connect";
import Employee, { IEmployeePopulated } from "@/server/models/Employee";
import Event from "@/server/models/Event";
import EventAttendee from "@/server/models/EventAttendee";
import Shift from "@/server/models/Shift";
import { AppError } from "@/utils/appError";
import {
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
} from "date-fns";
import mongoose from "mongoose";

export interface EmployeeShiftData {
  name: string;
  count: number;
}

export interface WeeklyStatsData {
  week: string; // "Jan 1 - Jan 7"
  events: number;
  attendees: number;
  shifts: number;
}

export interface AnalyticsData {
  employeeShifts: EmployeeShiftData[];
  weeklyStats: WeeklyStatsData[];
}

export async function $getAnalyticsData(
  monthIso: string // Date string for any day in the target month
): Promise<AnalyticsData | AppError> {
  const account = await $getAccountFromSession();
  if (!account || account instanceof AppError) {
    return new AppError("Unauthorized");
  }

  if (account.role !== "company") {
    return new AppError("Forbidden: Company access only");
  }

  await connectDB();

  const date = new Date(monthIso);
  const startMonth = startOfMonth(date);
  const endMonth = endOfMonth(date);
  const companyId = new mongoose.Types.ObjectId(account._id.toString());

  // --- 1. Employee Shift Distribution ---
  const employeeShiftStats = await Shift.aggregate([
    {
      $match: {
        company: companyId,
        date: { $gte: startMonth, $lte: endMonth },
      },
    },
    {
      $group: {
        _id: "$employee",
        count: { $sum: 1 },
      },
    },
  ]);

  // Populate names manually since aggregate lookups can be complex with our schemas
  const employeeShifts: EmployeeShiftData[] = [];

  // Get all employee IDs from stats
  const employeeIds = employeeShiftStats.map((s) => s._id).filter((id) => id); // Filter out nulls (unassigned shifts)

  // Fetch employees details (need to join with Account for name, or use dummyName)
  // Employee model has 'account' ref and 'dummyName'.
  // We prefer 'account.fullname' if linked, else 'dummyName'.

  const employees = await Employee.find({ _id: { $in: employeeIds } }).populate(
    "account"
  );

  for (const stat of employeeShiftStats) {
    if (!stat._id) continue;

    const emp = employees.find(
      (e) => e._id.toString() === stat._id.toString()
    ) as unknown as IEmployeePopulated | undefined;
    let name = "Unknown";

    if (emp) {
      // Check if 'account' is populated (it's typed as any/ObjectId usually in mongoose result unless cast)
      // Using a safe check
      if (emp.account && emp.account.fullname) {
        name = emp.account.fullname;
      } else {
        name = emp.dummyName;
      }
    }

    employeeShifts.push({
      name,
      count: stat.count,
    });
  }

  // --- 2. Weekly Stats ---
  const weeklyStats: WeeklyStatsData[] = [];
  const weeks = eachWeekOfInterval(
    { start: startMonth, end: endMonth },
    { weekStartsOn: 1 }
  );

  for (const weekStart of weeks) {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    // Clamp weekEnd to endOfMonth if needed, but usually showing full week overlap is fine or better for trends
    // Let's stick to the strict week range.

    // 1. Shifts Count
    const shiftsCount = await Shift.countDocuments({
      company: companyId,
      date: { $gte: weekStart, $lte: weekEnd },
    });

    // 2. Events Count
    const events = await Event.find({
      company: companyId,
      date: { $gte: weekStart, $lte: weekEnd },
    }).select("_id");

    const eventsCount = events.length;
    const eventIds = events.map((e) => e._id);

    // 3. Attendees Count (for these events)
    const attendeesCount = await EventAttendee.countDocuments({
      event: { $in: eventIds },
      status: "accepted", // Counting only accepted attendees? Or all? User prompt didn't specify. Assuming "accepted" is more meaningful for "attendees".
    });
    // Actually prompt said "Attendees", usually implies people coming. I'll stick to 'accepted'.

    const weekLabel = `${weekStart.getDate()} ${weekStart.toLocaleString("default", { month: "short" })} - ${weekEnd.getDate()} ${weekEnd.toLocaleString("default", { month: "short" })}`;

    weeklyStats.push({
      week: weekLabel,
      shifts: shiftsCount,
      events: eventsCount,
      attendees: attendeesCount,
    });
  }

  return {
    employeeShifts,
    weeklyStats,
  };
}
