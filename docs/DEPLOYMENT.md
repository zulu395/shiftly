# Deployment Guide

This document provides comprehensive instructions for deploying and configuring the Shiftly platform.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Environment Variables](#environment-variables)
- [Database Configuration](#database-configuration)
- [Third-Party Services](#third-party-services)
- [Local Development](#local-development)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Environment Setup

### Prerequisites

- **Node.js**: Version 20 or higher
- **Bun**: Latest version (package manager)
- **MongoDB**: Version 6.0 or higher (local or Atlas)
- **Git**: For version control

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

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Run development server**:

```bash
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env` file in the project root with the following variables:

### Required Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/shiftly
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shiftly?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email Service (Plunk)
PLUNK_API_KEY=your-plunk-api-key

# Real-time Messaging (PubNub)
NEXT_PUBLIC_PUBNUB_PUBLISH_KEY=your-pubnub-publish-key
NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY=your-pubnub-subscribe-key
PUBNUB_SECRET_KEY=your-pubnub-secret-key
```

### Optional Variables

```env
# Analytics (if using)
NEXT_PUBLIC_GA_ID=your-google-analytics-id

# Sentry (if using)
SENTRY_DSN=your-sentry-dsn

# File Upload (if using cloud storage)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_S3_BUCKET=your-s3-bucket-name
AWS_REGION=us-east-1
```

### Environment Variable Descriptions

| Variable                           | Description                                    | Required |
| ---------------------------------- | ---------------------------------------------- | -------- |
| `MONGODB_URI`                      | MongoDB connection string                      | ✅       |
| `JWT_SECRET`                       | Secret key for JWT token generation            | ✅       |
| `JWT_EXPIRES_IN`                   | JWT token expiration time                      | ✅       |
| `NODE_ENV`                         | Environment mode (`development`, `production`) | ✅       |
| `NEXT_PUBLIC_APP_URL`              | Application base URL                           | ✅       |
| `PLUNK_API_KEY`                    | Plunk email service API key                    | ✅       |
| `NEXT_PUBLIC_PUBNUB_PUBLISH_KEY`   | PubNub publish key                             | ✅       |
| `NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY` | PubNub subscribe key                           | ✅       |
| `PUBNUB_SECRET_KEY`                | PubNub secret key                              | ✅       |

## Database Configuration

### Local MongoDB

1. **Install MongoDB**:
   - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB**:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

3. **Set connection string**:

```env
MONGODB_URI=mongodb://localhost:27017/shiftly
```

### MongoDB Atlas (Cloud)

1. **Create account** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create cluster**:
   - Choose free tier (M0) for development
   - Select region closest to your users
   - Create cluster

3. **Configure network access**:
   - Add your IP address
   - For production, add application server IPs

4. **Create database user**:
   - Username and password
   - Grant read/write permissions

5. **Get connection string**:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

6. **Set connection string**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/shiftly?retryWrites=true&w=majority
```

### Database Indexes

The application automatically creates necessary indexes. To manually create them:

```javascript
// In MongoDB shell or Compass
db.accounts.createIndex({ email: 1 }, { unique: true });
db.employees.createIndex({ account: 1, company: 1 }, { unique: true });
db.shifts.createIndex({ company: 1, date: 1 });
db.shifts.createIndex({ employee: 1, date: 1 });
db.events.createIndex({ company: 1, date: 1 });
```

## Third-Party Services

### Plunk (Email Service)

1. **Create account** at [useplunk.com](https://useplunk.com)

2. **Get API key**:
   - Navigate to Settings → API Keys
   - Create new API key
   - Copy key

3. **Set environment variable**:

```env
PLUNK_API_KEY=your-plunk-api-key
```

4. **Configure email templates** (optional):
   - Create templates in Plunk dashboard
   - Use template IDs in email service

### PubNub (Real-time Messaging)

1. **Create account** at [pubnub.com](https://www.pubnub.com)

2. **Create app**:
   - Navigate to Apps → Create New App
   - Name your app

3. **Get keys**:
   - Click on your app
   - Copy Publish Key, Subscribe Key, and Secret Key

4. **Set environment variables**:

```env
NEXT_PUBLIC_PUBNUB_PUBLISH_KEY=your-publish-key
NEXT_PUBLIC_PUBNUB_SUBSCRIBE_KEY=your-subscribe-key
PUBNUB_SECRET_KEY=your-secret-key
```

5. **Configure features**:
   - Enable Presence (for online status)
   - Enable Message Persistence (for message history)
   - Enable Access Manager (for security)

## Local Development

### Running the Development Server

```bash
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Features

- **Hot Module Replacement**: Automatic page refresh on code changes
- **TypeScript**: Type checking in development
- **ESLint**: Code linting
- **Tailwind CSS**: JIT compilation

### Building for Production Locally

```bash
bun run build
bun start
```

### Linting

```bash
bun run lint
```

## Production Deployment

### Vercel (Recommended)

1. **Install Vercel CLI**:

```bash
npm i -g vercel
```

2. **Login to Vercel**:

```bash
vercel login
```

3. **Deploy**:

```bash
vercel
```

4. **Set environment variables**:
   - Go to Vercel dashboard
   - Navigate to Settings → Environment Variables
   - Add all required environment variables
   - Redeploy

5. **Configure domains** (optional):
   - Add custom domain in Vercel dashboard
   - Update DNS records

### Alternative: Docker

1. **Create Dockerfile**:

```dockerfile
FROM oven/bun:latest AS base

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

EXPOSE 3000

CMD ["bun", "start"]
```

2. **Build image**:

```bash
docker build -t shiftly .
```

3. **Run container**:

```bash
docker run -p 3000:3000 --env-file .env shiftly
```

### Environment-Specific Configuration

**Production checklist**:

- [ ] Set `NODE_ENV=production`
- [ ] Use strong `JWT_SECRET` (32+ characters)
- [ ] Configure production MongoDB URI
- [ ] Set up SSL/TLS certificates
- [ ] Enable CORS for allowed origins
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Enable error tracking (Sentry)
- [ ] Configure CDN for static assets
- [ ] Set up automated backups

## Troubleshooting

### Common Issues

#### Database Connection Failed

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:

- Verify MongoDB is running
- Check `MONGODB_URI` in `.env`
- Ensure network access is configured (Atlas)
- Check firewall settings

#### JWT Token Invalid

**Error**: `JsonWebTokenError: invalid token`

**Solutions**:

- Clear browser cookies
- Verify `JWT_SECRET` is set
- Check token expiration time
- Ensure consistent secret across deployments

#### Email Not Sending

**Error**: Email service errors

**Solutions**:

- Verify `PLUNK_API_KEY` is correct
- Check Plunk dashboard for errors
- Ensure email templates exist
- Check rate limits

#### PubNub Connection Failed

**Error**: PubNub connection errors

**Solutions**:

- Verify all PubNub keys are set
- Check PubNub dashboard for status
- Ensure keys match environment
- Check network connectivity

### Performance Optimization

**Database**:

- Ensure indexes are created
- Use lean queries where possible
- Implement pagination for large datasets
- Monitor slow queries

**Frontend**:

- Enable Next.js image optimization
- Use dynamic imports for large components
- Implement code splitting
- Enable compression

**Caching**:

- Use Redis for session storage (optional)
- Implement API response caching
- Use CDN for static assets

### Monitoring

**Recommended tools**:

- **Vercel Analytics**: Built-in for Vercel deployments
- **Sentry**: Error tracking and monitoring
- **MongoDB Atlas**: Database monitoring
- **PubNub Insights**: Real-time messaging analytics

### Backup and Recovery

**Database backups**:

```bash
# MongoDB dump
mongodump --uri="mongodb://localhost:27017/shiftly" --out=./backup

# MongoDB restore
mongorestore --uri="mongodb://localhost:27017/shiftly" ./backup/shiftly
```

**Automated backups** (MongoDB Atlas):

- Enable automatic backups in Atlas dashboard
- Configure backup frequency
- Set retention period

## Security Best Practices

- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Keep dependencies updated
- [ ] Enable CSRF protection
- [ ] Implement proper CORS configuration
- [ ] Use strong password hashing (bcrypt)
- [ ] Regular security audits

## Scaling Considerations

**Horizontal Scaling**:

- Use load balancer
- Implement session sharing (Redis)
- Use CDN for static assets
- Database read replicas

**Vertical Scaling**:

- Upgrade server resources
- Optimize database queries
- Implement caching strategies
- Use connection pooling
