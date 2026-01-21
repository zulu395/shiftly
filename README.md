# Shiftly

> A comprehensive staff scheduling and management platform built with Next.js, React, and MongoDB.

## 🎯 Overview

Shiftly is a modern, full-stack web application designed to streamline staff scheduling, employee management, and team communication for businesses. Built with cutting-edge technologies and following industry best practices, Shiftly provides a robust, scalable solution for workforce management.

## ✨ Key Features

- **📅 Staff Scheduling**: Create, manage, and assign shifts with support for recurring schedules
- **👥 Employee Management**: Comprehensive employee profiles, invitations, and role management
- **📊 Analytics Dashboard**: Real-time insights into workforce metrics and performance
- **📅 Event Planning**: Organize company events with attendee management and RSVP tracking
- **💬 Team Messaging**: Real-time communication powered by PubNub
- **⏰ Availability Tracking**: Employee availability management with weekly slot selection
- **🔔 Notifications**: Email notifications for important updates and invitations
- **🔐 Secure Authentication**: JWT-based authentication with role-based access control

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20 or higher
- **Bun** package manager
- **MongoDB** 6.0 or higher

### Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd shiftly
```

2. **Install dependencies**:

```bash
bun install
```

3. **Set up environment variables**:

```bash
cp .env.example .env
```

Edit `.env` and add your configuration (see [Deployment Guide](./docs/DEPLOYMENT.md) for details).

4. **Run the development server**:

```bash
bun dev
```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs) directory:

- **[Architecture](./docs/ARCHITECTURE.md)** - System architecture and design patterns
- **[API Reference](./docs/API.md)** - Complete server actions documentation
- **[Database](./docs/DATABASE.md)** - Database schema and models
- **[Components](./docs/COMPONENTS.md)** - Component library and usage guide
- **[Deployment](./docs/DEPLOYMENT.md)** - Environment setup and deployment instructions
- **[Contributing](./docs/CONTRIBUTING.md)** - Development guidelines and workflows
- **[Testing](./docs/TESTING.md)** - Testing strategies and best practices

## 🏗️ Technology Stack

### Frontend

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **State Management**: Zustand
- **Animations**: Motion (Framer Motion)

### Backend

- **Runtime**: Node.js with Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with HTTP-only cookies
- **Validation**: Zod schemas
- **Email**: Plunk
- **Real-time**: PubNub

### Development Tools

- **Package Manager**: Bun
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Version Control**: Git

## 🏛️ Architecture

Shiftly follows a **3-layer architecture** pattern:

```
┌─────────────────────────────────────┐
│     Client Components (React)       │
│  ┌─────────────────────────────┐   │
│  │   UI Components & Pages     │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Server Actions (Layer 1)       │
│  ┌─────────────────────────────┐   │
│  │  Auth, Validation, Routing  │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       Services (Layer 2)            │
│  ┌─────────────────────────────┐   │
│  │    Business Logic Layer     │   │
│  └─────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│       Models (Layer 3)              │
│  ┌─────────────────────────────┐   │
│  │   Mongoose Schemas & DB     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

See [Architecture Documentation](./docs/ARCHITECTURE.md) for detailed information.

## 📁 Project Structure

```
shiftly/
├── actions/              # Server Actions (API layer)
│   ├── auth/            # Authentication actions
│   ├── shifts/          # Shift management actions
│   ├── employees/       # Employee management actions
│   └── events/          # Event management actions
├── app/                 # Next.js App Router
│   └── (main)/          # Main application routes
├── components/          # React Components
│   ├── ui/              # Generic UI components
│   ├── shifts/          # Shift-specific components
│   ├── events/          # Event-specific components
│   └── messages/        # Messaging components
├── server/
│   ├── models/          # Mongoose models
│   ├── services/        # Business logic layer
│   └── db/              # Database connection
├── types/               # TypeScript type definitions
├── utils/               # Shared utilities
├── hooks/               # Custom React hooks
├── docs/                # Documentation
└── public/              # Static assets
```

## 🔑 Key Concepts

### Server Actions

All API endpoints are implemented as Next.js Server Actions, prefixed with `$`:

```typescript
import { $createShift } from "@/actions/shifts/createShift";

const result = await $createShift(formData);
```

### Services

Business logic is encapsulated in service classes:

```typescript
import { ShiftService } from "@/server/services/Shift";

const shifts = await ShiftService.getByRange({ startDate, endDate });
```

### Models

Data schemas are defined using Mongoose:

```typescript
import Shift from "@/server/models/Shift";

const shift = await Shift.findById(id);
```

## 🛠️ Development

### Available Scripts

```bash
# Start development server
bun dev

# Build for production
bun run build

# Start production server
bun start

# Run linter
bun run lint
```

### Code Style

- **No comments in code** - Code should be self-documenting
- **TypeScript** for all files
- **Follow naming conventions** (see [Contributing Guide](./docs/CONTRIBUTING.md))
- **Use Bun** for package management
- **Follow 3-layer architecture** pattern

### Adding a New Feature

1. Create Mongoose model in `server/models/`
2. Create service in `server/services/`
3. Create server action in `actions/`
4. Create UI components in `components/`

See [Contributing Guide](./docs/CONTRIBUTING.md) for detailed instructions.

## 🧪 Testing

Testing strategies include:

- **Unit Tests**: Service layer and utilities
- **Integration Tests**: Server actions
- **Component Tests**: React components
- **E2E Tests**: Critical user flows

See [Testing Guide](./docs/TESTING.md) for comprehensive testing documentation.

## 🚢 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Environment Variables

Required environment variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key
- `PLUNK_API_KEY` - Email service API key
- `NEXT_PUBLIC_PUBNUB_PUBLISH_KEY` - PubNub publish key
- `NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY` - PubNub subscribe key

See [Deployment Guide](./docs/DEPLOYMENT.md) for complete setup instructions.

## 📄 License

This project is proprietary and confidential.

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](./docs/CONTRIBUTING.md) for details on our code of conduct and development process.

## 📞 Support

For questions or issues:

1. Check the [documentation](./docs)
2. Review existing issues
3. Create a new issue with detailed information

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org)
- [React](https://react.dev)
- [MongoDB](https://www.mongodb.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)
- [PubNub](https://www.pubnub.com)

---

**Made with ❤️ for better workforce management**
