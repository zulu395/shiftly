# Contributing to Shiftly

Thank you for your interest in contributing to Shiftly! This document provides guidelines and best practices for development.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Architecture Patterns](#architecture-patterns)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Common Pitfalls](#common-pitfalls)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on code quality and maintainability
- Follow established patterns and conventions

## Getting Started

### Prerequisites

- Node.js 20+
- Bun package manager
- MongoDB 6.0+
- Git

### Setup

1. **Fork the repository**

2. **Clone your fork**:

```bash
git clone https://github.com/your-username/shiftly.git
cd shiftly
```

3. **Install dependencies**:

```bash
bun install
```

4. **Set up environment**:

```bash
cp .env.example .env
```

5. **Start development server**:

```bash
bun dev
```

## Development Workflow

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature

1. **Create branch from develop**:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. **Make changes following code style guide**

3. **Commit with descriptive messages**:

```bash
git add .
git commit -m "feat: add employee availability tracking"
```

4. **Push to your fork**:

```bash
git push origin feature/your-feature-name
```

5. **Create pull request** to `develop` branch

### Commit Message Convention

Follow conventional commits:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

**Examples**:

```
feat: add shift template functionality
fix: resolve shift overlap validation issue
docs: update API documentation for events
refactor: extract shift validation logic to service
```

## Code Style Guide

### General Rules

Based on `.agent/gemini.md`:

- **NO COMMENTS IN CODE** - Code should be self-documenting
- Use TypeScript for all files
- Follow industry standard patterns
- Be direct and implement professional code
- Use meaningful variable and function names

### TypeScript

**DO**:

```typescript
interface CreateShiftParams {
  date: Date;
  startTime: string;
  endTime: string;
  position: string;
}

async function createShift(
  params: CreateShiftParams,
): Promise<ServiceResponse<IShift>> {
  await connectDB();
  const shift = await Shift.create(params);
  return JSON.parse(JSON.stringify(shift));
}
```

**DON'T**:

```typescript
async function createShift(params: any) {
  const shift = await Shift.create(params);
  return shift;
}
```

### Naming Conventions

| Type                | Convention         | Example              |
| ------------------- | ------------------ | -------------------- |
| Server Actions      | `$camelCase`       | `$getShiftsByRange`  |
| Services            | `PascalCase`       | `ShiftService`       |
| Models              | `PascalCase`       | `Shift`, `Employee`  |
| Components          | `PascalCase`       | `ShiftCalendar`      |
| Interfaces (Models) | `I` + `PascalCase` | `IShift`, `IAccount` |
| Types               | `PascalCase`       | `ServiceResponse`    |
| Functions           | `camelCase`        | `validateShift`      |
| Constants           | `UPPER_SNAKE_CASE` | `MAX_SHIFTS`         |

### File Organization

```typescript
import { external } from "external-package";
import { internal } from "@/internal/module";
import { type } from "@/types";

export interface ComponentProps {
  prop: string;
}

export function Component({ prop }: ComponentProps) {
  return <div>{prop}</div>;
}
```

## Architecture Patterns

### Adding a New Feature

Follow the 3-layer architecture:

#### 1. Create Model

**File**: `server/models/NewModel.ts`

```typescript
import mongoose, { Schema, Document, Model } from "mongoose";

export interface INewModel extends Document {
  field: string;
  createdAt: Date;
  updatedAt: Date;
}

const NewModelSchema: Schema<INewModel> = new Schema(
  {
    field: { type: String, required: true },
  },
  { timestamps: true },
);

const NewModel: Model<INewModel> =
  mongoose.models.NewModel ||
  mongoose.model<INewModel>("NewModel", NewModelSchema);

export default NewModel;
```

#### 2. Create Service

**File**: `server/services/NewModel.ts`

```typescript
import { connectDB } from "@/server/db/connect";
import NewModel, { INewModel } from "@/server/models/NewModel";
import { AppError } from "@/utils/appError";
import { ServiceResponse } from "@/types";

const create = async (
  data: Partial<INewModel>,
): Promise<ServiceResponse<INewModel>> => {
  await connectDB();
  try {
    const result = await NewModel.create(data);
    return JSON.parse(JSON.stringify(result));
  } catch (error) {
    console.error("Error creating:", error);
    return new AppError("Failed to create");
  }
};

const getAll = async (): Promise<ServiceResponse<INewModel[]>> => {
  await connectDB();
  try {
    const results = await NewModel.find({});
    return JSON.parse(JSON.stringify(results));
  } catch (error) {
    console.error("Error fetching:", error);
    return new AppError("Failed to fetch");
  }
};

export const NewModelService = { create, getAll };
```

#### 3. Create Server Action

**File**: `actions/newmodel/create.ts`

```typescript
"use server";

import { NewModelService } from "@/server/services/NewModel";
import { $getAccountFromSession } from "../account/account";
import { AppError } from "@/utils/appError";
import { ActionResponse } from "@/types";
import { z } from "zod";

const schema = z.object({
  field: z.string().min(1, "Field is required"),
});

export async function $createNewModel(
  _: ActionResponse,
  formData: FormData,
): Promise<ActionResponse> {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return { error: "Unauthorized" };
  }

  const data = Object.fromEntries(formData);
  const result = schema.safeParse(data);

  if (!result.success) {
    return {
      error: "Invalid data",
      fieldErrors: result.error.flatten().fieldErrors,
    };
  }

  const response = await NewModelService.create(result.data);

  if (response instanceof AppError) {
    return { error: response.message };
  }

  return { success: "Created successfully", data: response };
}
```

#### 4. Create Component

**File**: `components/newmodel/NewModelForm.tsx`

```typescript
"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { $createNewModel } from "@/actions/newmodel/create";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormMessage } from "@/components/form/FormMessage";

export function NewModelForm() {
  const [state, formAction] = useFormState($createNewModel, {});

  return (
    <form action={formAction} className="space-y-4">
      <Input name="field" placeholder="Enter field" required />
      <FormMessage error={state.error} success={state.success} />
      <Button type="submit">Create</Button>
    </form>
  );
}
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guide
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Documentation updated (if needed)
- [ ] Commits follow convention
- [ ] Branch is up to date with develop

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Changes Made

- Change 1
- Change 2

## Testing

How to test the changes

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by at least one maintainer
3. **Testing** by reviewer
4. **Approval** required before merge
5. **Squash and merge** to develop

## Testing Guidelines

See [TESTING.md](./TESTING.md) for comprehensive testing guidelines.

### Quick Testing Checklist

- [ ] Unit tests for services
- [ ] Integration tests for server actions
- [ ] Component tests for UI
- [ ] Manual testing for user flows
- [ ] Edge case testing
- [ ] Error handling testing

## Common Pitfalls

### ❌ Forgetting to Serialize Data

**Wrong**:

```typescript
const shift = await Shift.findById(id);
return shift;
```

**Correct**:

```typescript
const shift = await Shift.findById(id);
return JSON.parse(JSON.stringify(shift));
```

### ❌ Skipping Authentication

**Wrong**:

```typescript
export async function $deleteShift(shiftId: string) {
  return await ShiftService.delete(shiftId);
}
```

**Correct**:

```typescript
export async function $deleteShift(shiftId: string) {
  const account = await $getAccountFromSession();
  if (account instanceof AppError || !account) {
    return new AppError("Unauthorized");
  }
  return await ShiftService.delete(shiftId);
}
```

### ❌ Not Connecting to Database

**Wrong**:

```typescript
const getAll = async () => {
  const data = await Model.find({});
  return data;
};
```

**Correct**:

```typescript
const getAll = async () => {
  await connectDB();
  const data = await Model.find({});
  return JSON.parse(JSON.stringify(data));
};
```

### ❌ Using `any` Type

**Wrong**:

```typescript
function processData(data: any) {
  return data.field;
}
```

**Correct**:

```typescript
interface DataType {
  field: string;
}

function processData(data: DataType) {
  return data.field;
}
```

### ❌ Putting Business Logic in Components

**Wrong**:

```typescript
function ShiftForm() {
  const handleSubmit = async (data) => {
    await connectDB();
    const shift = await Shift.create(data);
    return shift;
  };
}
```

**Correct**:

```typescript
function ShiftForm() {
  const [state, formAction] = useFormState($createShift, {});

  return <form action={formAction}>...</form>;
}
```

## Package Management

### Using Bun

**Install package**:

```bash
bun add package-name
```

**Install dev dependency**:

```bash
bun add -d package-name
```

**Remove package**:

```bash
bun remove package-name
```

**Update packages**:

```bash
bun update
```

## Navigation

### Using paths.ts

Always use `paths.ts` for navigation:

**Wrong**:

```typescript
router.push("/dashboard/staff-scheduling");
```

**Correct**:

```typescript
import { paths } from "@/utils/paths";

router.push(paths.staffScheduling);
```

## Hooks

### Using react-use

Leverage `react-use` hooks for common functionality:

```typescript
import { useCookie, useLocalStorage, useDebounce } from "react-use";

const [token] = useCookie("auth-token");
const [settings, setSettings] = useLocalStorage("settings", {});
const debouncedSearch = useDebounce(searchTerm, 300);
```

## Questions?

If you have questions:

1. Check existing documentation
2. Review similar implementations in codebase
3. Ask in pull request comments
4. Contact maintainers

Thank you for contributing to Shiftly! 🎉
