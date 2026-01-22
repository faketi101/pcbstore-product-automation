# PCB Automotions Backend

Production-ready backend for PCB Automotions with MongoDB, session-based authentication, and proper logging.

## Features

- ✅ MongoDB database with Mongoose ODM
- ✅ Session-based authentication (expires on browser close)
- ✅ Password change functionality
- ✅ Morgan logger for development
- ✅ Secure password hashing with bcryptjs
- ✅ Environment-based configuration
- ✅ Production-ready error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

## Installation

1. Install dependencies:
```bash
cd backend
pnpm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update with your values:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=
SESSION_SECRET=
NODE_ENV=development
```

## Migration from JSON to MongoDB

If you have existing users in `data/users.json`, run the migration script:

```bash
node scripts/migrateToMongoDB.js
```

This will:
- Connect to MongoDB
- Migrate all users and their data
- Preserve passwords (already hashed)
- Backup the original JSON file

## Running the Server

### Development mode (with nodemon):
```bash
pnpm run dev
```

### Production mode:
```bash
pnpm start
```

The server will run on `http://localhost:5000` (or your configured PORT).

## API Endpoints

### Authentication

#### Login
```
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

#### Logout
```
POST /api/logout
```

#### Get Current User
```
GET /api/me
```
*Requires authentication*

#### Change Password
```
POST /api/change-password
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```
*Requires authentication*

### Prompts

#### Get User Prompts
```
GET /api/prompts
```
*Requires authentication*

#### Save Prompts
```
POST /api/prompts
Content-Type: application/json

{
  "staticPrompt": "...",
  "mainPromptTemplate": "..."
}
```
*Requires authentication*

#### Reset All Prompts to Default
```
DELETE /api/prompts
```
*Requires authentication*

#### Reset Main Prompt Only
```
DELETE /api/prompts/main
```
*Requires authentication*

#### Reset Static Prompt Only
```
DELETE /api/prompts/static
```
*Requires authentication*

### Reports

#### Create Hourly Report
```
POST /api/reports/hourly
Content-Type: application/json

{
  "data": { ... },
  "date": "2026-01-21",
  "time": "14:00"
}
```
*Requires authentication*

#### Get Daily Report
```
GET /api/reports/daily/:date
```
*Requires authentication*

## Session Configuration

Sessions are configured to:
- Expire when the browser closes (no persistent session)
- Store in MongoDB for scalability
- Use secure cookies in production (HTTPS)
- Be HTTP-only to prevent XSS attacks

## Security Features

- Passwords are hashed using bcryptjs (salt rounds: 10)
- Pre-save hook prevents double hashing
- Session secrets are environment-based
- CORS configured for frontend origin
- HTTP-only session cookies
- Secure cookies in production

## Logging

Morgan logger is configured:
- **Development**: 'dev' format (colored, concise)
- **Production**: 'combined' format (Apache combined log)

## Error Handling

- Centralized error handling middleware
- Detailed error messages in development
- Generic error messages in production
- All errors logged to console

## Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── defaultPrompts.js    # Default prompt templates
├── data/
│   └── users.json           # Legacy user data (for migration)
├── middleware/
│   └── auth.middleware.js   # Session verification
├── models/
│   └── User.model.js        # Mongoose User schema
├── routes/
│   ├── auth.routes.js       # Authentication endpoints
│   ├── prompt.routes.js     # Prompt management
│   └── report.routes.js     # Report management
├── scripts/
│   ├── migrateToMongoDB.js  # Migration script
│   ├── seedUsers.js         # User seeding script
│   └── testReset.js         # Test reset script
├── .env                     # Environment variables (not in git)
├── .env.example             # Example environment file
├── package.json
└── server.js                # Main server file
```

## Development

### Add New User (Admin)
You'll need to create an admin interface or use MongoDB Compass/CLI to add new users.

### Password Requirements
- Minimum 6 characters
- Hashed automatically on save

## Troubleshooting

### MongoDB Connection Issues
- Check your connection string in `.env`
- Ensure IP whitelist in MongoDB Atlas
- Verify network connectivity

### Session Not Persisting
- Check cookie settings in browser
- Ensure CORS credentials are enabled
- Verify SESSION_SECRET is set

### Password Change Not Working
- Ensure current password is correct
- Check minimum length requirement (6 chars)
- Verify user is authenticated

## License

ISC
