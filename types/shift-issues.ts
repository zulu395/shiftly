export const SHIFT_ISSUE_REASONS = [
  "Schedule Conflict",
  "Unable to Attend",
  "Incorrect Time",
  "Incorrect Location",
  "Incorrect Position",
  "Personal Emergency",
  "Health Issue",
  "Transportation Issue",
  "Other",
] as const;

export type ShiftIssueReason = (typeof SHIFT_ISSUE_REASONS)[number];

export type ShiftIssueStatus = "pending" | "resolved";

export type ShiftIssue = {
  _id: string;
  shift: {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    position: string;
    location?: string;
  };
  reportedBy: {
    _id: string;
    dummyName?: string;
    dummyEmail?: string;
  };
  reason: ShiftIssueReason;
  description: string;
  status: ShiftIssueStatus;
  resolvedBy?: {
    _id: string;
    fullname: string;
  };
  resolvedAt?: Date;
  createdAt: Date;
};
