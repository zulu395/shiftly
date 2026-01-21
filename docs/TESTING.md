# Testing Guide

This document provides comprehensive testing strategies and guidelines for the Shiftly platform.

## Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Stack](#testing-stack)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [Component Testing](#component-testing)
- [E2E Testing](#e2e-testing)
- [Manual Testing](#manual-testing)
- [Test Data Management](#test-data-management)
- [Best Practices](#best-practices)

## Testing Philosophy

Shiftly follows a pragmatic testing approach:

- **Test behavior, not implementation**
- **Focus on critical paths**
- **Maintain fast test execution**
- **Keep tests maintainable**
- **Prioritize integration over unit tests**

### Testing Pyramid

```
        /\
       /  \
      / E2E \
     /______\
    /        \
   /Integration\
  /____________\
 /              \
/  Unit Tests    \
/________________\
```

## Testing Stack

### Recommended Tools

- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: API mocking
- **MongoDB Memory Server**: Database testing

### Setup (Future Implementation)

```bash
bun add -d jest @testing-library/react @testing-library/jest-dom
bun add -d @playwright/test
bun add -d mongodb-memory-server
bun add -d msw
```

## Unit Testing

### Service Layer Tests

Test business logic in services:

**File**: `server/services/__tests__/Shift.test.ts`

```typescript
import { ShiftService } from "../Shift";
import { connectDB } from "@/server/db/connect";
import Shift from "@/server/models/Shift";
import { AppError } from "@/utils/appError";

jest.mock("@/server/db/connect");
jest.mock("@/server/models/Shift");

describe("ShiftService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should create a shift successfully", async () => {
      const mockShift = {
        _id: "123",
        date: new Date(),
        startTime: "09:00",
        endTime: "17:00",
        position: "Server",
      };

      (Shift.create as jest.Mock).mockResolvedValue(mockShift);

      const result = await ShiftService.create(mockShift);

      expect(connectDB).toHaveBeenCalled();
      expect(Shift.create).toHaveBeenCalledWith(mockShift);
      expect(result).toEqual(JSON.parse(JSON.stringify(mockShift)));
    });

    it("should return AppError on failure", async () => {
      (Shift.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

      const result = await ShiftService.create({});

      expect(result).toBeInstanceOf(AppError);
      expect(result.message).toBe("Failed to create shift");
    });
  });

  describe("getByRange", () => {
    it("should fetch shifts within date range", async () => {
      const mockShifts = [
        { date: new Date("2024-01-15"), position: "Server" },
        { date: new Date("2024-01-16"), position: "Chef" },
      ];

      (Shift.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockShifts),
      });

      const result = await ShiftService.getByRange({
        startDate: new Date("2024-01-15"),
        endDate: new Date("2024-01-20"),
        companyId: "company123",
      });

      expect(result).toEqual(JSON.parse(JSON.stringify(mockShifts)));
    });
  });
});
```

### Utility Function Tests

**File**: `utils/__tests__/validators.test.ts`

```typescript
import { validators } from "../validators";

describe("validators", () => {
  describe("email", () => {
    it("should validate correct email", () => {
      const result = validators.email.safeParse("test@example.com");
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const result = validators.email.safeParse("invalid-email");
      expect(result.success).toBe(false);
    });
  });

  describe("password", () => {
    it("should accept password with 6+ characters", () => {
      const result = validators.password.safeParse("password123");
      expect(result.success).toBe(true);
    });

    it("should reject password with less than 6 characters", () => {
      const result = validators.password.safeParse("pass");
      expect(result.success).toBe(false);
    });
  });
});
```

## Integration Testing

### Server Action Tests

Test the full flow from action to service to database:

**File**: `actions/__tests__/shifts.test.ts`

```typescript
import { $createShift } from "../shifts/createShift";
import { $getAccountFromSession } from "../account/account";
import { ShiftService } from "@/server/services/Shift";

jest.mock("../account/account");
jest.mock("@/server/services/Shift");

describe("Shift Actions", () => {
  const mockAccount = {
    _id: "account123",
    role: "company",
    email: "test@company.com",
  };

  beforeEach(() => {
    ($getAccountFromSession as jest.Mock).mockResolvedValue(mockAccount);
  });

  describe("$createShift", () => {
    it("should create shift with valid data", async () => {
      const formData = new FormData();
      formData.append("date", "2024-01-20");
      formData.append("startTime", "09:00");
      formData.append("endTime", "17:00");
      formData.append("position", "Server");
      formData.append("publish", "yes");

      (ShiftService.create as jest.Mock).mockResolvedValue({
        _id: "shift123",
        date: new Date("2024-01-20"),
      });

      const result = await $createShift({}, formData);

      expect(result.success).toBe("Shift created successfully");
      expect(ShiftService.create).toHaveBeenCalled();
    });

    it("should return error for unauthorized user", async () => {
      ($getAccountFromSession as jest.Mock).mockResolvedValue(null);

      const result = await $createShift({}, new FormData());

      expect(result.error).toBe("Unauthorized");
    });

    it("should return validation errors for invalid data", async () => {
      const formData = new FormData();

      const result = await $createShift({}, formData);

      expect(result.error).toBe("Invalid data submitted");
      expect(result.fieldErrors).toBeDefined();
    });
  });
});
```

## Component Testing

### Form Component Tests

**File**: `components/__tests__/CreateShiftModal.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateShiftModal } from "../shifts/CreateShiftModal";
import { $createShift } from "@/actions/shifts/createShift";

jest.mock("@/actions/shifts/createShift");

describe("CreateShiftModal", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render modal when open", () => {
    render(
      <CreateShiftModal
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText("Create Shift")).toBeInTheDocument();
  });

  it("should not render when closed", () => {
    render(
      <CreateShiftModal
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText("Create Shift")).not.toBeInTheDocument();
  });

  it("should submit form with valid data", async () => {
    ($createShift as jest.Mock).mockResolvedValue({
      success: "Shift created",
    });

    render(
      <CreateShiftModal
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    fireEvent.change(screen.getByLabelText("Position"), {
      target: { value: "Server" },
    });
    fireEvent.change(screen.getByLabelText("Start Time"), {
      target: { value: "09:00" },
    });
    fireEvent.change(screen.getByLabelText("End Time"), {
      target: { value: "17:00" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect($createShift).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should display error message on failure", async () => {
    ($createShift as jest.Mock).mockResolvedValue({
      error: "Failed to create shift",
    });

    render(
      <CreateShiftModal
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Failed to create shift")).toBeInTheDocument();
    });
  });
});
```

### UI Component Tests

**File**: `components/__tests__/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../ui/button";

describe("Button", () => {
  it("should render with text", () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();
  });

  it("should handle click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);

    fireEvent.click(screen.getByText("Click Me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeDisabled();
  });

  it("should apply variant classes", () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByText("Delete");
    expect(button).toHaveClass("bg-red-500");
  });
});
```

## E2E Testing

### Playwright Tests

**File**: `e2e/auth.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should login successfully", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "test@company.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("text=Welcome")).toBeVisible();
  });

  test("should show error for invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "wrong@email.com");
    await page.fill('input[name="password"]', "wrongpass");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Invalid email or password")).toBeVisible();
  });

  test("should redirect to onboarding for new users", async ({ page }) => {
    await page.goto("/login");

    await page.fill('input[name="email"]', "newuser@company.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/onboard");
  });
});
```

**File**: `e2e/shifts.spec.ts`

```typescript
import { test, expect } from "@playwright/test";

test.describe("Shift Management", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[name="email"]', "test@company.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");
  });

  test("should create a new shift", async ({ page }) => {
    await page.goto("/dashboard/staff-scheduling");

    await page.click("text=Create Shift");
    await page.fill('input[name="position"]', "Server");
    await page.fill('input[name="startTime"]', "09:00");
    await page.fill('input[name="endTime"]', "17:00");
    await page.click('button:has-text("Create")');

    await expect(page.locator("text=Shift created successfully")).toBeVisible();
  });

  test("should filter shifts by employee", async ({ page }) => {
    await page.goto("/dashboard/staff-scheduling");

    await page.click("text=Filters");
    await page.click("text=John Doe");
    await page.click("text=Apply");

    const shifts = page.locator('[data-testid="shift-card"]');
    await expect(shifts).toHaveCount(3);
  });
});
```

## Manual Testing

### Manual Testing Checklist

#### Authentication Flow

- [ ] Register new company account
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Session persistence
- [ ] Password reset flow

#### Shift Management

- [ ] Create single shift
- [ ] Create recurring shift (daily)
- [ ] Create recurring shift (weekly)
- [ ] Edit existing shift
- [ ] Delete shift
- [ ] Assign employee to shift
- [ ] Filter shifts by employee
- [ ] Filter shifts by position
- [ ] Filter shifts by status

#### Employee Management

- [ ] Add new employee
- [ ] Edit employee details
- [ ] Delete employee
- [ ] Search employees
- [ ] Paginate employee list
- [ ] Send invitation email

#### Event Management

- [ ] Create event
- [ ] Edit event
- [ ] Cancel event
- [ ] Delete event
- [ ] Add attendees
- [ ] Respond to event invitation

#### Messaging

- [ ] Send message
- [ ] Receive message
- [ ] Real-time updates
- [ ] Message history
- [ ] Read receipts

## Test Data Management

### Seed Data

Create seed scripts for test data:

**File**: `scripts/seed.ts`

```typescript
import { connectDB } from "@/server/db/connect";
import Account from "@/server/models/Account";
import Employee from "@/server/models/Employee";
import Shift from "@/server/models/Shift";

async function seed() {
  await connectDB();

  const company = await Account.create({
    fullname: "Test Company",
    email: "test@company.com",
    password: "hashed_password",
    role: "company",
    hasOnboarded: true,
  });

  const employee = await Employee.create({
    dummyName: "John Doe",
    dummyEmail: "john@example.com",
    company: company._id,
    status: "active",
  });

  await Shift.create({
    date: new Date(),
    startTime: "09:00",
    endTime: "17:00",
    position: "Server",
    company: company._id,
    employee: employee._id,
    status: "assigned",
  });

  console.log("Seed data created");
}

seed();
```

### Test Database

Use MongoDB Memory Server for isolated testing:

```typescript
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

## Best Practices

### DO

✅ Test critical user paths
✅ Test error handling
✅ Test edge cases
✅ Use descriptive test names
✅ Keep tests independent
✅ Mock external dependencies
✅ Clean up after tests
✅ Test accessibility

### DON'T

❌ Test implementation details
❌ Write flaky tests
❌ Skip error cases
❌ Use production database
❌ Share state between tests
❌ Test third-party libraries
❌ Over-mock everything

### Test Naming

Use descriptive names:

```typescript
describe("ShiftService", () => {
  describe("create", () => {
    it("should create a shift with valid data", () => {});
    it("should return error when date is invalid", () => {});
    it("should validate employee assignment", () => {});
  });
});
```

### Arrange-Act-Assert Pattern

```typescript
it("should create shift successfully", async () => {
  const shiftData = {
    date: new Date(),
    startTime: "09:00",
    endTime: "17:00",
  };

  const result = await ShiftService.create(shiftData);

  expect(result).toBeDefined();
  expect(result.startTime).toBe("09:00");
});
```

## Running Tests

```bash
# Run all tests
bun test

# Run specific test file
bun test Shift.test.ts

# Run tests in watch mode
bun test --watch

# Run tests with coverage
bun test --coverage

# Run E2E tests
bunx playwright test

# Run E2E tests in UI mode
bunx playwright test --ui
```

## Continuous Integration

Add to CI/CD pipeline:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun test
      - run: bunx playwright install
      - run: bunx playwright test
```
