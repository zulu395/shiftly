# API Documentation

This document provides comprehensive documentation for all server actions in the Shiftly platform.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Account Management](#account-management)
- [Employee Management](#employee-management)
- [Shift Management](#shift-management)
- [Event Management](#event-management)
- [Availability](#availability)
- [Contacts](#contacts)
- [Conversations & Messages](#conversations--messages)
- [Analytics](#analytics)
- [Onboarding](#onboarding)

## Overview

All server actions follow a consistent pattern:

- Prefixed with `$` (e.g., `$login`, `$createShift`)
- Located in `actions/` directory, organized by domain
- Use `"use server"` directive
- Validate authentication via `$getAccountFromSession`
- Return `ActionResponse` or `ServiceResponse` types
- Use Zod for input validation

### Response Types

```typescript
type ActionResponse<T = unknown> = {
  error?: string;
  success?: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
};

type ServiceResponse<T = unknown> = T | AppError;
```

## Authentication

### $login

**File**: `actions/auth/login.ts`

Authenticates a user and creates a session.

**Parameters**:

```typescript
{
  email: string;
  password: string;
}
```

**Returns**: `ActionResponse`

**Behavior**:

- Validates credentials
- Creates JWT token in HTTP-only cookie
- Redirects to dashboard if onboarded
- Redirects to onboarding if not onboarded
- For employees, sets company context cookie

**Example**:

```typescript
const result = await $login(undefined, formData);
if (result.error) {
  toast.error(result.error);
}
```

---

### $register

**File**: `actions/auth/register.ts`

Registers a new company account.

**Parameters**:

```typescript
{
  fullname: string;
  email: string;
  phone?: string;
  password: string;
}
```

**Returns**: `ActionResponse`

**Validation**:

- Email must be valid and unique
- Password minimum 6 characters
- Full name required

---

## Account Management

### $getAccountFromSession

**File**: `actions/account/account.ts`

Retrieves the current authenticated user's account.

**Returns**: `ServiceResponse<IAccount>`

**Usage**:

```typescript
const account = await $getAccountFromSession();
if (account instanceof AppError || !account) {
  return new AppError("Unauthorized");
}
```

---

### $updateProfile

**File**: `actions/account/updateProfile.ts`

Updates the current user's profile information.

**Parameters**:

```typescript
{
  fullname?: string;
  phone?: string;
  avatar?: string;
}
```

**Returns**: `ActionResponse`

---

### $changePassword

**File**: `actions/account/changePassword.ts`

Changes the current user's password.

**Parameters**:

```typescript
{
  old: string;
  new: string;
}
```

**Returns**: `ActionResponse`

**Validation**:

- Old password must match current password
- New password minimum 6 characters

---

## Employee Management

### $getAllEmployees

**File**: `actions/employees/getAllEmployees.ts`

Retrieves all employees for the current company with pagination and search.

**Parameters**:

```typescript
{
  page?: number;
  limit?: number;
  q?: string;
  status?: "active" | "inactive" | "invited" | "deleted";
}
```

**Returns**: `ServiceResponse<Paginated<IEmployee>>`

**Features**:

- Pagination support
- Search by name or email
- Filter by status
- Populates account details

---

### $addEmployee

**File**: `actions/employees/addEmployee.ts`

Adds a new employee to the company.

**Parameters**:

```typescript
{
  dummyName: string;
  dummyEmail: string;
  jobTitle?: string;
  hourlyRate?: number;
  isAdmin?: boolean;
}
```

**Returns**: `ActionResponse`

**Behavior**:

- Creates employee record
- Sends invitation email
- Sets status to "invited"

---

### $editEmployee

**File**: `actions/employees/editEmployee.ts`

Updates an existing employee's information.

**Parameters**:

```typescript
{
  employeeId: string;
  dummyName?: string;
  dummyEmail?: string;
  jobTitle?: string;
  hourlyRate?: number;
  isAdmin?: boolean;
  status?: "active" | "inactive";
}
```

**Returns**: `ActionResponse`

---

### $deleteEmployee

**File**: `actions/employees/deleteEmployee.ts`

Soft deletes an employee (sets status to "deleted").

**Parameters**:

```typescript
{
  employeeId: string;
}
```

**Returns**: `ActionResponse`

---

### $getEmployments

**File**: `actions/employees/getEmployments.ts`

Gets all companies where the current user is employed.

**Returns**: `ServiceResponse<IEmployee[]>`

**Use Case**: For employees to switch between companies

---

### $switchCompany

**File**: `actions/employees/switchCompany.ts`

Switches the active company context for an employee.

**Parameters**:

```typescript
{
  companyId: string;
}
```

**Returns**: `ActionResponse`

**Behavior**:

- Updates company context cookie
- Redirects to dashboard

---

## Shift Management

### $createShift

**File**: `actions/shifts/createShift.ts`

Creates one or more shifts (supports recurring shifts).

**Parameters**:

```typescript
{
  date: string;
  startTime: string;
  endTime: string;
  position: string;
  location?: string;
  break?: string;
  repeat?: "Never" | "Daily" | "Weekly";
  repeatDays?: number[];
  repeatEnd?: string;
  note?: string;
  employees?: string[];
  publish?: "yes" | "no";
}
```

**Returns**: `ActionResponse`

**Features**:

- Single or recurring shift creation
- Daily or weekly repetition
- Custom repeat days for weekly
- Auto-assign to employees
- Publish immediately or keep as draft

**Example**:

```typescript
const formData = new FormData();
formData.append("date", "2024-01-20");
formData.append("startTime", "09:00");
formData.append("endTime", "17:00");
formData.append("position", "Server");
formData.append("repeat", "Weekly");
formData.append("repeatDays", JSON.stringify([1, 3, 5]));
formData.append("repeatEnd", "2024-02-20");

const result = await $createShift(undefined, formData);
```

---

### $getShiftsByRange

**File**: `actions/shifts/getShiftsByRange.ts`

Retrieves shifts within a date range with filtering.

**Parameters**:

```typescript
{
  startDate: string;
  endDate: string;
  employees?: string[];
  positions?: string[];
  status?: "published" | "unpublished";
}
```

**Returns**: `ServiceResponse<IShift[]>`

**Features**:

- Date range filtering
- Filter by employees
- Filter by positions
- Filter by published status
- Populates employee details

---

### $getMyShiftsByRange

**File**: `actions/shifts/getMyShiftsByRange.ts`

Retrieves shifts for the current employee within a date range.

**Parameters**:

```typescript
{
  startDate: string;
  endDate: string;
}
```

**Returns**: `ServiceResponse<IShift[]>`

---

### $updateShift

**File**: `actions/shifts/updateShift.ts`

Updates an existing shift.

**Parameters**:

```typescript
{
  shiftId: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  position?: string;
  location?: string;
  break?: string;
  note?: string;
  employees?: string[];
  status?: "assigned" | "unassigned";
}
```

**Returns**: `ActionResponse`

---

### $deleteShift

**File**: `actions/shifts/deleteShift.ts`

Deletes a shift or group of recurring shifts.

**Parameters**:

```typescript
{
  shiftId: string;
  deleteAll?: boolean;
}
```

**Returns**: `ActionResponse`

**Behavior**:

- If `deleteAll` is true, deletes all shifts in the group
- Otherwise, deletes only the specified shift

---

### $getAllShifts

**File**: `actions/shifts/getAllShifts.ts`

Retrieves all shifts for the current company.

**Returns**: `ServiceResponse<IShift[]>`

---

## Event Management

### $createEvent

**File**: `actions/events/createEvent.ts`

Creates a new company event.

**Parameters**:

```typescript
{
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  locationUrl?: string;
  timezone?: string;
  attendees?: string[];
}
```

**Returns**: `ActionResponse`

---

### $getEventsByRange

**File**: `actions/events/getEventsByRange.ts`

Retrieves events within a date range.

**Parameters**:

```typescript
{
  startDate: string;
  endDate: string;
}
```

**Returns**: `ServiceResponse<IEvent[]>`

---

### $updateEvent

**File**: `actions/events/updateEvent.ts`

Updates an existing event.

**Parameters**:

```typescript
{
  eventId: string;
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  locationUrl?: string;
}
```

**Returns**: `ActionResponse`

---

### $cancelEvent

**File**: `actions/events/cancelEvent.ts`

Cancels an event (sets status to "cancelled").

**Parameters**:

```typescript
{
  eventId: string;
}
```

**Returns**: `ActionResponse`

---

### $deleteEvent

**File**: `actions/events/deleteEvent.ts`

Permanently deletes an event.

**Parameters**:

```typescript
{
  eventId: string;
}
```

**Returns**: `ActionResponse`

---

### $respondToEvent

**File**: `actions/events/respondToEvent.ts`

Responds to an event invitation.

**Parameters**:

```typescript
{
  eventId: string;
  status: "accepted" | "declined" | "maybe";
}
```

**Returns**: `ActionResponse`

---

## Availability

### $getAvailability

**File**: `actions/availability.ts`

Retrieves the current employee's weekly availability.

**Returns**: `ServiceResponse<IAvailability>`

---

### $updateAvailability

**File**: `actions/availability.ts`

Updates the current employee's weekly availability.

**Parameters**:

```typescript
{
  weeklySlots: Record<string, boolean>;
}
```

**Returns**: `ActionResponse`

**Example**:

```typescript
const weeklySlots = {
  "monday-09:00": true,
  "monday-10:00": true,
  "tuesday-14:00": true,
};

await $updateAvailability({ weeklySlots });
```

---

## Contacts

### $getAllContacts

**File**: `actions/contacts/getAllContacts.ts`

Retrieves all contacts for the current company.

**Returns**: `ServiceResponse<IContact[]>`

---

### $addContact

**File**: `actions/contacts/addContact.ts`

Adds a new contact.

**Parameters**:

```typescript
{
  employeeId: string;
}
```

**Returns**: `ActionResponse`

---

### $blockContact

**File**: `actions/contacts/blockContact.ts`

Blocks a contact.

**Parameters**:

```typescript
{
  contactId: string;
}
```

**Returns**: `ActionResponse`

---

### $deleteContact

**File**: `actions/contacts/deleteContact.ts`

Deletes a contact.

**Parameters**:

```typescript
{
  contactId: string;
}
```

**Returns**: `ActionResponse`

---

## Conversations & Messages

### $getConversations

**File**: `actions/conversations/getConversations.ts`

Retrieves all conversations for the current user.

**Returns**: `ServiceResponse<IConversation[]>`

---

### $createConversation

**File**: `actions/conversations/createConversation.ts`

Creates a new conversation.

**Parameters**:

```typescript
{
  participants: string[];
}
```

**Returns**: `ActionResponse<IConversation>`

---

### $getMessages

**File**: `actions/conversations/getMessages.ts`

Retrieves messages for a conversation.

**Parameters**:

```typescript
{
  conversationId: string;
}
```

**Returns**: `ServiceResponse<IMessage[]>`

---

## Analytics

### $getAnalytics

**File**: `actions/analytics/getAnalytics.ts`

Retrieves analytics data for the company dashboard.

**Returns**: `ServiceResponse<AnalyticsData>`

**Data Includes**:

- Total employees
- Total shifts
- Upcoming events
- Recent activity

---

## Onboarding

### $completeCompanyOnboarding

**File**: `actions/onboard/completeCompanyOnboarding.ts`

Completes the onboarding process for a company.

**Parameters**:

```typescript
{
  companyName: string;
  companyAddress: string;
  companyNiche: string;
  companyTotalEmployees: string;
  companyGoals: string[];
}
```

**Returns**: `ActionResponse`

---

### $completeEmployeeOnboarding

**File**: `actions/onboard/completeEmployeeOnboarding.ts`

Completes the onboarding process for an employee.

**Returns**: `ActionResponse`

---

## Error Handling

All server actions follow consistent error handling:

```typescript
const result = await $serverAction(params);

if (result instanceof AppError) {
  toast.error(result.message);
  return;
}

if (result.error) {
  toast.error(result.error);
  return;
}

if (result.fieldErrors) {
  Object.entries(result.fieldErrors).forEach(([field, errors]) => {
    console.error(`${field}: ${errors.join(", ")}`);
  });
  return;
}

toast.success(result.success);
```

## Best Practices

### DO

✅ Always check authentication before calling actions
✅ Use form data for mutations
✅ Handle all error cases (error, fieldErrors)
✅ Show user feedback with toast notifications
✅ Revalidate paths after mutations
✅ Use Zod schemas for validation

### DON'T

❌ Call server actions from server components
❌ Ignore error responses
❌ Skip input validation
❌ Forget to handle loading states
❌ Make multiple sequential calls when batch is possible
