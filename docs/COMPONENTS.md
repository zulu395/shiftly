# Component Library

This document provides comprehensive documentation for the component library used in the Shiftly platform.

## Table of Contents

- [Overview](#overview)
- [Component Organization](#component-organization)
- [UI Components](#ui-components)
- [Feature Components](#feature-components)
- [Styling Guidelines](#styling-guidelines)
- [Best Practices](#best-practices)

## Overview

Shiftly's component library is built with:

- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Radix UI** primitives for accessible components
- **Shadcn UI** pattern for component composition
- **Lucide React** for icons

All components follow these principles:

- **Type Safety**: Full TypeScript support with proper prop types
- **Accessibility**: ARIA attributes and keyboard navigation
- **Responsiveness**: Mobile-first design approach
- **Reusability**: Composable and configurable components
- **Consistency**: Unified design system

## Component Organization

```
components/
├── ui/                    # Generic UI components (Shadcn-based)
│   ├── button.tsx
│   ├── input.tsx
│   ├── dialog.tsx
│   └── ...
├── auth/                  # Authentication components
│   ├── LoginForm.tsx
│   ├── RegisterForm.tsx
│   └── ...
├── shifts/                # Shift scheduling components
│   ├── ShiftCalendar.tsx
│   ├── CreateShiftModal.tsx
│   └── ...
├── events/                # Event management components
│   ├── EventCalendar.tsx
│   ├── EventDetailsModal.tsx
│   └── ...
├── messages/              # Messaging components
│   ├── ChatWindow.tsx
│   ├── MessageList.tsx
│   └── ...
├── dashboard/             # Dashboard components
│   ├── StatCard.tsx
│   ├── AnalyticsChart.tsx
│   └── ...
├── layout/                # Layout components
│   ├── Header.tsx
│   ├── Sidebar.tsx
│   └── ...
├── form/                  # Form components
│   ├── FormButton.tsx
│   ├── FormMessage.tsx
│   └── ...
└── common/                # Common shared components
    ├── LoadingSpinner.tsx
    ├── ErrorBoundary.tsx
    └── ...
```

## UI Components

### Button

**File**: `components/ui/button.tsx`

A versatile button component with multiple variants.

**Props**:

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}
```

**Usage**:

```tsx
<Button variant="default" size="lg">
  Click Me
</Button>

<Button variant="destructive" onClick={handleDelete}>
  Delete
</Button>
```

---

### Input

**File**: `components/ui/input.tsx`

Standard input field component.

**Props**:

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
```

**Usage**:

```tsx
<Input
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### Dialog

**File**: `components/ui/dialog.tsx`

Modal dialog component built on Radix UI.

**Components**:

- `Dialog` - Root component
- `DialogTrigger` - Trigger button
- `DialogContent` - Modal content
- `DialogHeader` - Header section
- `DialogTitle` - Title
- `DialogDescription` - Description
- `DialogFooter` - Footer section

**Usage**:

```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Modal description</DialogDescription>
    </DialogHeader>
    <div>Modal content</div>
    <DialogFooter>
      <Button>Save</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

### Select

**File**: `components/ui/select.tsx`

Dropdown select component.

**Components**:

- `Select` - Root component
- `SelectTrigger` - Trigger button
- `SelectContent` - Dropdown content
- `SelectItem` - Individual option
- `SelectValue` - Selected value display

**Usage**:

```tsx
<Select value={position} onValueChange={setPosition}>
  <SelectTrigger>
    <SelectValue placeholder="Select position" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="server">Server</SelectItem>
    <SelectItem value="chef">Chef</SelectItem>
    <SelectItem value="manager">Manager</SelectItem>
  </SelectContent>
</Select>
```

---

### Popover

**File**: `components/ui/popover.tsx`

Popover component for contextual content.

**Components**:

- `Popover` - Root component
- `PopoverTrigger` - Trigger element
- `PopoverContent` - Popover content

**Usage**:

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div>Popover content</div>
  </PopoverContent>
</Popover>
```

---

## Feature Components

### ShiftCalendar

**File**: `components/shifts/ShiftCalendar.tsx`

Weekly calendar view for shift scheduling.

**Props**:

```typescript
interface ShiftCalendarProps {
  shifts: IShift[];
  employees: IEmployee[];
  onCellClick: (date: Date, employeeId?: string) => void;
  onShiftClick: (shift: IShift) => void;
}
```

**Features**:

- Weekly view with employee rows
- Drag-and-drop support
- Color-coded shifts by status
- Hover actions for creating shifts

**Usage**:

```tsx
<ShiftCalendar
  shifts={shifts}
  employees={employees}
  onCellClick={(date, employeeId) => openCreateModal(date, employeeId)}
  onShiftClick={(shift) => openEditModal(shift)}
/>
```

---

### CreateShiftModal

**File**: `components/shifts/CreateShiftModal.tsx`

Modal for creating new shifts.

**Props**:

```typescript
interface CreateShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
  defaultEmployeeId?: string;
}
```

**Features**:

- Tabbed interface (Custom / Templates)
- Recurring shift support
- Employee assignment
- Publish immediately option

**Usage**:

```tsx
<CreateShiftModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  defaultDate={selectedDate}
  defaultEmployeeId={selectedEmployee}
/>
```

---

### EventCalendar

**File**: `components/events/EventCalendar.tsx`

Calendar view for company events.

**Props**:

```typescript
interface EventCalendarProps {
  events: IEvent[];
  onEventClick: (event: IEvent) => void;
  onDateClick: (date: Date) => void;
}
```

**Features**:

- Month/week/day views
- Event status indicators
- Attendee avatars
- Quick create on date click

---

### ChatWindow

**File**: `components/messages/ChatWindow.tsx`

Real-time messaging interface.

**Props**:

```typescript
interface ChatWindowProps {
  conversation: IConversation;
  messages: IMessage[];
  onSendMessage: (content: string) => void;
}
```

**Features**:

- Real-time message updates via PubNub
- Message grouping by sender
- Timestamp display
- Typing indicators
- Read receipts

---

### StatCard

**File**: `components/dashboard/StatCard.tsx`

Dashboard statistics card.

**Props**:

```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}
```

**Usage**:

```tsx
<StatCard
  title="Total Employees"
  value={employeeCount}
  icon={<Users className="h-4 w-4" />}
  trend={{ value: 12, isPositive: true }}
/>
```

---

### FormButton

**File**: `components/form/FormButton.tsx`

Form submission button with loading state.

**Props**:

```typescript
interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
}
```

**Usage**:

```tsx
<FormButton loading={isPending} loadingText="Saving...">
  Save Changes
</FormButton>
```

---

### FormMessage

**File**: `components/form/FormMessage.tsx`

Form feedback message component.

**Props**:

```typescript
interface FormMessageProps {
  error?: string;
  success?: string;
}
```

**Usage**:

```tsx
<FormMessage error={state.error} success={state.success} />
```

---

### Header

**File**: `components/layout/Header.tsx`

Application header with navigation.

**Features**:

- Company logo
- Navigation links
- User profile dropdown
- Notifications
- Company switcher (for employees)

---

### Sidebar

**File**: `components/layout/Sidebar.tsx`

Application sidebar navigation.

**Features**:

- Collapsible design
- Active route highlighting
- Icon + text labels
- Role-based menu items

---

## Styling Guidelines

### Tailwind CSS Classes

Use Tailwind utility classes for styling:

```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <Button className="ml-auto">Action</Button>
</div>
```

### Class Variance Authority (CVA)

For components with variants, use CVA:

```typescript
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-gray-300 bg-white hover:bg-gray-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);
```

### Tailwind Merge

Use `cn` utility for merging classes:

```typescript
import { cn } from "@/lib/utils";

<Button className={cn("w-full", className)} />
```

---

## Best Practices

### Component Structure

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onAction();
    setIsLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <Button onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Click Me"}
      </Button>
    </div>
  );
}
```

### DO

✅ Use TypeScript for all components
✅ Define prop interfaces
✅ Use `"use client"` directive for interactive components
✅ Extract reusable logic into custom hooks
✅ Use semantic HTML elements
✅ Add ARIA labels for accessibility
✅ Handle loading and error states
✅ Use Tailwind classes for styling
✅ Keep components focused and single-purpose

### DON'T

❌ Use inline styles
❌ Put business logic in components
❌ Forget to handle edge cases
❌ Skip prop validation
❌ Use `any` type
❌ Create deeply nested components
❌ Forget responsive design
❌ Skip accessibility attributes

### Accessibility

Always include proper ARIA attributes:

```tsx
<button
  aria-label="Close modal"
  aria-pressed={isActive}
  aria-disabled={isDisabled}
>
  <X className="h-4 w-4" />
</button>
```

### Responsive Design

Use Tailwind responsive prefixes:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map((item) => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</div>
```

### Custom Hooks

Extract component logic into hooks:

```typescript
function useShiftForm(initialShift?: IShift) {
  const [formData, setFormData] = useState(initialShift || {});
  const [errors, setErrors] = useState({});

  const validate = () => {
    // Validation logic
  };

  const submit = async () => {
    if (!validate()) return;
    // Submit logic
  };

  return { formData, setFormData, errors, submit };
}
```

### Loading States

Always handle loading states:

```tsx
function MyComponent() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData().then((result) => {
      setData(result);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (!data) return <EmptyState />;

  return <DataDisplay data={data} />;
}
```

### Error Boundaries

Wrap components in error boundaries:

```tsx
import { ErrorBoundary } from "react-error-boundary";

<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>;
```
