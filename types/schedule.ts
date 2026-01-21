export type Employee = {
  _id: string;
  fullname: string;
  hourlyRate: number;
  totalHours: string;
};

export type ShiftStatus = "assigned" | "unassigned";

export type Shift = {
  _id: string;
  date: string; // Format: YYYY-MM-DD
  startTime: string; // Format: HH:MM AM/PM
  endTime: string; // Format: HH:MM AM/PM
  position: string;
  location?: string;
  break?: string;
  details?: string; // Used for notes
  hourlyRate: number;
  totalPay: number;
  duration: string;
  status: ShiftStatus;
  repeat?: string;
  employeeId?: string;
};

export type ScheduleView =
  | "full"
  | "my"
  | "pending"
  | "unavailability"
  | "availability";

export type ScheduleGroupBy = "employees" | "positions" | "locations";

// Dummy employees data
export const dummyEmployees: Employee[] = [
  {
    _id: "emp1",
    fullname: "Ikechukwu Osuji",
    hourlyRate: 50.0,
    totalHours: "17hr 15min",
  },
  {
    _id: "emp2",
    fullname: "Izuchukwu Nwankwo",
    hourlyRate: 50.0,
    totalHours: "17hr 15min",
  },
];

// Dummy shifts data matching the design image
export const dummyShifts: Shift[] = [
  // Unassigned shifts
  {
    _id: "unassigned1",
    date: "2025-12-05",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "UI/UX Designer",
    location: "Heskay",
    break: "None",
    details: "",
    hourlyRate: 0,
    totalPay: 0,
    duration: "8hrs",
    status: "unassigned",
  },
  {
    _id: "unassigned2",
    date: "2025-12-08",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "QA Tester",
    details: "Figma",
    hourlyRate: 0,
    totalPay: 0,
    duration: "8hrs",
    status: "unassigned",
  },
  {
    _id: "unassigned3",
    date: "2025-12-29",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "Developer",
    details: "Figma",
    hourlyRate: 0,
    totalPay: 0,
    duration: "8hrs",
    status: "unassigned",
  },

  // Assigned shifts for Ikechukwu Osuji
  {
    _id: "shift1",
    date: "2025-12-25",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "UI/UX Designer",
    details: "Heskay",
    hourlyRate: 50.0,
    totalPay: 25.0,
    duration: "8hrs",
    status: "assigned",
    employeeId: "emp1",
  },
  {
    _id: "shift2",
    date: "2025-12-28",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "QA Tester",
    details: "Figma",
    hourlyRate: 50.0,
    totalPay: 25.0,
    duration: "8hrs",
    status: "assigned",
    employeeId: "emp1",
  },
  {
    _id: "shift3",
    date: "2025-12-29",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "Designer",
    details: "Figma",
    hourlyRate: 50.0,
    totalPay: 25.0,
    duration: "8hrs",
    status: "assigned",
    employeeId: "emp1",
  },

  // Assigned shifts for Izuchukwu Nwankwo
  {
    _id: "shift4",
    date: "2025-12-25",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "UI/UX Designer",
    details: "Heskay",
    hourlyRate: 50.0,
    totalPay: 25.0,
    duration: "8hrs",
    status: "assigned",
    employeeId: "emp2",
  },
  {
    _id: "shift5",
    date: "2025-12-28",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "QA Tester",
    details: "Figma",
    hourlyRate: 50.0,
    totalPay: 25.0,
    duration: "8hrs",
    status: "assigned",
    employeeId: "emp2",
  },
  {
    _id: "shift6",
    date: "2025-12-29",
    startTime: "9:00 AM",
    endTime: "5:00 PM",
    position: "Developer",
    details: "Figma",
    hourlyRate: 50.0,
    totalPay: 25.0,
    duration: "8hrs",
    status: "assigned",
    employeeId: "emp2",
  },
];
