# Database Seeding

This document describes how to seed the database with test data for development or demonstration purposes.

## Available Seed Scripts

There are two main seed scripts available:

1. **Create Admin User**: Creates an admin user with credentials from environment variables.
2. **Seed Test Data**: Populates the database with test data for users, teams, categories, and kudos.

## Environment Variables

For the admin seed script, you need to set these environment variables:

```
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
ADMIN_NAME=Admin User
```

## Running the Seeds

### Create Admin User

To create an admin user (required for administration purposes):

```
npm run create:admin
```

This will create an admin user using the environment variables. If an admin already exists, no action will be taken.

### Seed Test Data

To populate the database with test data:

```
npm run seed:data
```

This will:
- Delete existing kudos, categories, and teams (but preserves users)
- Create 10 team members and 5 tech leads
- Create 7 teams: Engineering, Design, Product, Marketing, Customer Support, Sales, and Operations
- Create 7 categories for kudos
- Create 100 random kudos with various messages and recipients

All records are created with explicitly generated UUIDs using Node.js crypto module's `randomUUID()` function instead of relying on database defaults.

**Note**: Running this script will delete existing data in these tables, so use with caution in production environments.

## Custom Seeding

You can modify the seed scripts in the `prisma/seed/` directory if you need to customize the test data.

## Database Reset

If you need to completely reset the database and reapply migrations:

```
# Drop and recreate the database
npx prisma migrate reset --force

# Reapply migrations
npm run prisma:migrate:prod

# Create admin user
npm run create:admin

# Seed test data if needed
npm run seed:data
``` 