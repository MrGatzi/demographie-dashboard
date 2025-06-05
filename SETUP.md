# Parliament Data Sync Setup

## Overview

This project includes a Vercel Function that automatically fetches data from the Austrian Parliament API and stores it in Supabase using Prisma ORM. The function runs daily at 6:00 AM UTC.

## Required Environment Variables

### **For Vercel + Supabase Integration:**

When you integrate Supabase with Vercel, the environment variables are automatically provided. **No additional setup needed!**

The Prisma schema uses: `POSTGRES_PRISMA_URL` (automatically provided by Vercel)

### **For Local Development:**

Create `.env.local` with:

```bash
# Copy the value from your Vercel dashboard
POSTGRES_PRISMA_URL="postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true"
```

## Installation & Setup

1. **Install dependencies:**

   ```bash
   npm install prisma @prisma/client
   ```

2. **Generate Prisma client:**

   ```bash
   npx prisma generate
   ```

3. **Push the schema to your database:**
   ```bash
   npx prisma db push
   ```

## Database Schema

The Prisma schema automatically creates the following table structure:

```sql
-- This is handled automatically by Prisma
CREATE TABLE parliament_data_raw (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE NOT NULL,
  record_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_parliament_data_raw_fetched_at ON parliament_data_raw(fetched_at);
```

## Environment Variables Explained

| Variable                   | Purpose                             | Needed? |
| -------------------------- | ----------------------------------- | ------- |
| `POSTGRES_PRISMA_URL`      | 🟢 **Prisma connection (USE THIS)** | ✅ YES  |
| `POSTGRES_URL`             | Basic PostgreSQL connection         | ❌ NO   |
| `SUPABASE_URL`             | Supabase JS client API              | ❌ NO   |
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side Supabase                | ❌ NO   |

## Prisma Commands

- **Generate client:** `npx prisma generate`
- **Push schema:** `npx prisma db push`
- **View database:** `npx prisma studio`
- **Reset database:** `npx prisma db push --force-reset`

## Manual Testing

You can manually trigger the sync by making a POST request to:

```
POST /api/sync-parliament-data
```

Or test the endpoint and see latest sync status with:

```
GET /api/sync-parliament-data
```

## Cron Schedule

The function is scheduled to run daily at 6:00 AM UTC via the `vercel.json` configuration.

## Data Source

The function fetches data from:

- URL: `https://www.parlament.gv.at/Filter/api/json/post`
- Parameters: `jsMode=EVAL&FBEZ=WFW_005&listeId=undefined&showAll=true&export=true`
- POST body filters for Austrian parliament members

## Error Handling

The function includes comprehensive error handling and logging. Check your Vercel function logs for any issues.

## Type Safety

With Prisma, you get full type safety for all database operations. The `ParliamentDataRaw` model provides TypeScript types automatically generated from your schema.
