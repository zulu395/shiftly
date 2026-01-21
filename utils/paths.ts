export const paths = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",

  eventInviteSingle: (eventId: string, withHost = false) =>
    `${
      withHost ? (process.env.NEXT_PUBLIC_HOST ?? "") : ""
    }/event/invitation/${eventId}`,

  onboard: "/onboard",
  onboardCompany: "/onboard/company",
  onboardCompanyGoals: "/onboard/company/goals",
  onboardCompanyEmployeeList: "/onboard/company/employee-list",
  onboardCompanyTeam: "/onboard/company/team",
  onboardEmployee: "/onboard/employee",
  onboardEmployeeInvites: "/onboard/employee/invites",
  onboardEmployeeNoTeam: "/onboard/employee/no-team",

  dashboard: "/dashboard",
  dashboardEventPlanning: "/dashboard/event-planning",
  dashboardStaffScheduling: "/dashboard/staff-scheduling",
  dashboardStaffSchedulingMy: "/dashboard/staff-scheduling/my",
  dashboardStaffSchedulingIssues: "/dashboard/staff-scheduling/issues",
  dashboardStaffSchedulingMyIssues: "/dashboard/staff-scheduling/my-issues",
  dashboardStaffSchedulingAvailability:
    "/dashboard/staff-scheduling/availability",
  dashboardTasks: "/dashboard/tasks",
  dashboardMessages: "/dashboard/messages",
  dashboardAnalytics: "/dashboard/analytics",
  dashboardContacts: "/dashboard/contacts",
  dashboardContactsEventContacts: "/dashboard/contacts/event-contacts",
  dashboardSettingsEditProfile: "/dashboard/settings/edit-profile",
  dashboardSettingsChangePassword: "/dashboard/settings/change-password",
  dashboardAvailability: "/dashboard/availability",
} as const;

export const employeeRestrictedPaths = [
  paths.dashboardTasks,
  paths.dashboardAnalytics,
  paths.dashboardContacts,
  paths.dashboardContactsEventContacts,
];
