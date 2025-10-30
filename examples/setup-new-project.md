# New Project Setup Example

Complete workflow for setting up a new project using primitives plugin.

## Scenario

You've just cloned a new repository and need to get up and running quickly.

## Workflow

### Step 1: Install and verify dependencies

```bash
/install
```

**Output:**
```
🔍 Verifying required tooling...

Checking Git CLI:
  ✓ git version 2.45.2
  ✓ Git configured:
      user.name: John Doe
      user.email: john@example.com

Checking GitHub CLI:
  ✓ gh version 2.51.0
  ✓ Authenticated as: johndoe
  ✓ Default protocol: https

📖 Reading project-specific setup...

Found: INSTALL.md

Following installation instructions:

1. Installing Node.js dependencies
   $ bun install
   ✓ 847 packages installed (2.3s)

2. Setting up database
   $ docker-compose up -d postgres
   ✓ Container postgres started

3. Running migrations
   $ bun run migrate:latest
   ✓ Ran 12 migrations

4. Checking environment configuration
   ⚠️ Missing .env.local file

   Using skill: check-env-keys

   === Keys in .env.example ===
   DATABASE_URL
   JWT_SECRET
   REDIS_URL
   SMTP_HOST
   SMTP_PORT
   SMTP_USER
   SMTP_PASS
   AWS_REGION
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY

   === Keys in .env.local ===
   (file not found)

5. Health checks
   $ bun run health:check
   ✓ Database: Connected
   ✓ Redis: Connected
   ✗ SMTP: Configuration missing
   ⚠️ AWS: Credentials not set (optional)

📊 Installation Summary

✅ Completed:
  - Git CLI verified
  - GitHub CLI authenticated
  - Dependencies installed (847 packages)
  - Database running and migrated
  - Redis connected

⚠️ Missing/Incomplete:
  - .env.local file not created
  - SMTP configuration incomplete (required for email features)
  - AWS credentials not set (optional - only needed for S3 uploads)

📋 Next Steps:

1. Create .env.local:
   $ cp .env.example .env.local

2. Configure required variables:
   - DATABASE_URL (✓ auto-configured by docker-compose)
   - JWT_SECRET (generate: openssl rand -base64 32)
   - REDIS_URL (✓ auto-configured)
   - SMTP_* (contact team for credentials)

3. Optional: Configure AWS credentials for S3 uploads
   - AWS_REGION
   - AWS_ACCESS_KEY_ID
   - AWS_SECRET_ACCESS_KEY

4. Re-run health checks:
   $ bun run health:check

5. Start development:
   $ /start

Would you like help configuring the missing items?
```

### Step 2: Configure environment

Based on the output, create `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials, then verify:

```bash
# Use the check-env-keys skill
# Automatically invoked, or check manually:
```

**Output:**
```
=== Keys in .env.local ===
AWS_ACCESS_KEY_ID
AWS_REGION
AWS_SECRET_ACCESS_KEY
DATABASE_URL
JWT_SECRET
REDIS_URL
SMTP_HOST
SMTP_PASS
SMTP_PORT
SMTP_USER

=== Keys in .env.example ===
AWS_ACCESS_KEY_ID
AWS_REGION
AWS_SECRET_ACCESS_KEY
DATABASE_URL
JWT_SECRET
REDIS_URL
SMTP_HOST
SMTP_PASS
SMTP_PORT
SMTP_USER

✓ All required keys present
✓ No missing configurations
```

### Step 3: Prime context window

Understand the codebase structure before diving in:

```bash
/prime
```

**Output:**
```
📂 Running git ls-files...

Repository contents (324 files):

Core application:
  src/
    api/          # REST API endpoints (23 files)
    services/     # Business logic (18 files)
    models/       # Database models (12 files)
    utils/        # Helper functions (15 files)
    middleware/   # Express middleware (8 files)
    types/        # TypeScript types (10 files)
    config/       # Configuration (5 files)

Testing:
  tests/
    unit/         # Unit tests (45 files)
    integration/  # Integration tests (28 files)
    fixtures/     # Test data (12 files)

Infrastructure:
  docker/         # Docker configurations (4 files)
  migrations/     # Database migrations (12 files)
  scripts/        # Utility scripts (8 files)

Documentation:
  docs/           # Project documentation (15 files)
  README.md
  CONTRIBUTING.md
  INSTALL.md
  RUN.md

Configuration:
  package.json
  tsconfig.json
  .env.example
  docker-compose.yml

📖 Reading README.md...

Project: Task Management API
Description: RESTful API for team task management with real-time updates

Tech Stack:
  - Runtime: Bun + TypeScript
  - Framework: Express.js
  - Database: PostgreSQL (with Kysely query builder)
  - Cache: Redis
  - Real-time: Socket.io
  - Queue: BullMQ
  - Tests: Vitest
  - API Docs: OpenAPI/Swagger

Architecture:
  - Layered architecture (API → Services → Models)
  - Repository pattern for data access
  - Event-driven with background workers
  - JWT authentication
  - Role-based access control

Key Features:
  - Task CRUD operations
  - Real-time task updates
  - Team collaboration
  - File attachments (S3)
  - Email notifications
  - Task comments and activity log
  - Export to PDF/CSV

Development:
  - Start: `bun run dev` (port 3000)
  - Test: `bun test`
  - Build: `bun run build`
  - Lint: `bun run lint`

📝 Codebase Summary:

This is a mature task management API built with Bun and TypeScript. The codebase
follows clean architecture principles with clear separation between API, business
logic, and data layers.

Key patterns:
  - Controllers in src/api handle HTTP requests
  - Services in src/services contain business logic
  - Models in src/models define database schemas
  - Kysely for type-safe database queries
  - Background jobs for emails and notifications
  - Comprehensive test coverage (73 test files)

Entry points:
  - src/index.ts - Main server
  - src/api/routes.ts - Route definitions
  - src/workers/index.ts - Background workers

Common workflows:
  - Adding new endpoints: Create controller + service + tests
  - Database changes: Create migration + update models
  - Background jobs: Add job handler in src/workers

Testing approach:
  - Unit tests for services and utils
  - Integration tests for API endpoints
  - Fixtures for consistent test data

Ready to start developing! Use /start to launch dev environment.
```

### Step 4: Start development environment

```bash
/start
```

**Output:**
```
📖 Reading RUN.md for startup instructions...

Found: RUN.md

🚀 Starting development environment...

1. Ensuring Docker services are running:
   $ docker-compose ps

   Services:
   ✓ postgres - Running (port 5432)
   ✓ redis - Running (port 6379)

2. Starting API server:
   $ bun run dev

   [14:23:45] Starting development server...
   [14:23:46] ✓ TypeScript compilation complete
   [14:23:47] ✓ Database connected
   [14:23:47] ✓ Redis connected
   [14:23:47] ✓ Server listening on http://localhost:3000
   [14:23:47] ✓ API docs available at http://localhost:3000/docs

   Running in background (PID: 52847)

3. Starting background workers:
   $ bun run workers

   [14:23:48] ✓ Email worker started
   [14:23:48] ✓ Notification worker started
   [14:23:48] ✓ Export worker started

   Running in background (PID: 52851)

✅ Development environment ready!

Services:
  📡 API Server: http://localhost:3000
  📚 API Docs: http://localhost:3000/docs
  🗄️ PostgreSQL: localhost:5432
  ⚡ Redis: localhost:6379

Logs:
  API: logs/api.log
  Workers: logs/workers.log
  Database: docker logs postgres

Useful commands:
  bun test          # Run tests
  bun run lint      # Check code style
  bun run migrate   # Run pending migrations

Health check:
  $ curl http://localhost:3000/health
  {"status":"healthy","timestamp":"2025-10-30T14:23:49.123Z"}

Ready for development! 🎉
```

### Step 5: Verify everything works

Quick health check:

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-30T14:23:49.123Z",
  "services": {
    "database": "connected",
    "redis": "connected",
    "workers": "running"
  }
}
```

## Complete Setup Timeline

```
Clone repository
    ↓
/install
    ↓ (verify tools, install deps, setup DB)
Configure .env.local
    ↓ (check-env-keys skill validates)
/prime
    ↓ (understand codebase structure)
/start
    ↓ (launch dev environment)
Development ready ✓
```

## Time Comparison

### Manual Setup: ~45 minutes

1. Check if git/gh installed: 2 min
2. Read INSTALL.md and follow steps: 15 min
3. Troubleshoot missing configs: 10 min
4. Figure out .env variables: 8 min
5. Read docs to understand codebase: 10 min
6. Start dev server and debug issues: 10 min

### With Primitives: ~5 minutes

1. `/install`: 2 min (automated)
2. Configure `.env.local`: 2 min (guided by output)
3. `/prime` + `/start`: 1 min (automated)

**Saved: ~40 minutes on initial setup**

## What Each Command Did

### `/install`
- ✓ Verified git and gh CLI
- ✓ Read INSTALL.md and executed steps
- ✓ Ran health checks
- ✓ Identified missing configurations
- ✓ Used check-env-keys skill to compare .env files
- ✓ Provided clear next steps

### `check-env-keys` skill
- ✓ Listed all required environment variables
- ✓ Compared local vs example files
- ✓ Identified missing keys
- ✗ Never exposed actual values (security)

### `/prime`
- ✓ Listed all files in repository
- ✓ Read and summarized README
- ✓ Identified architecture patterns
- ✓ Explained common workflows
- ✓ Highlighted entry points and testing approach

### `/start`
- ✓ Read RUN.md for project-specific instructions
- ✓ Started Docker services
- ✓ Launched API server in background
- ✓ Started background workers
- ✓ Provided service URLs and logs
- ✓ Verified health status

## Project-Specific Files

These files make the commands work effectively:

**INSTALL.md** - Installation instructions
```markdown
# Installation

## Prerequisites
- Docker and Docker Compose
- Bun v1.0+

## Steps

1. Install dependencies:
   $ bun install

2. Start Docker services:
   $ docker-compose up -d

3. Run migrations:
   $ bun run migrate:latest

4. Setup environment:
   Copy .env.example to .env.local and configure

5. Run health checks:
   $ bun run health:check
```

**RUN.md** - Development server instructions
```markdown
# Running the Application

## Development Mode

1. Start Docker services:
   $ docker-compose up -d

2. Start API server:
   $ bun run dev

3. Start workers:
   $ bun run workers

## Services
- API: http://localhost:3000
- Docs: http://localhost:3000/docs
```

**DEBUG.md** - Debugging information (for `/debug` command)
```markdown
# Debugging

## Logs
- API: logs/api.log
- Workers: logs/workers.log
- Database: docker logs postgres

## Database Access
$ docker exec -it postgres psql -U app -d taskmanager

## Common Issues
- Port 3000 in use: Change PORT in .env.local
- Database connection: Check docker-compose ps
```

## Best Practices

1. **Always start with `/install`** on new projects
2. **Use `/prime`** before diving into code
3. **Create project-specific docs** (INSTALL.md, RUN.md, DEBUG.md)
4. **Use `check-env-keys` skill** to validate configs without exposing secrets
5. **Document service URLs** in RUN.md for quick reference
