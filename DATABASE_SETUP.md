# Database Setup - SQLite with Drizzle ORM

## Overview

The pipelines project now uses a local SQLite database to persist opportunities data.

## Database Location

`pipelines.db` - Created automatically in the project root when you first run the app

## Schema

### Opportunities Table

```sql
CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  value REAL NOT NULL,
  stage TEXT NOT NULL,
  probability INTEGER NOT NULL DEFAULT 50,
  contact_name TEXT,
  contact_title TEXT,
  contact_id TEXT,
  expected_close_date TEXT,
  description TEXT,
  last_activity TEXT,
  days_in_stage INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)
```

## Files Created

- `src/lib/db/schema.ts` - Drizzle schema definition
- `src/lib/db/index.ts` - Database connection and initialization
- `src/routes/api/opportunities/+server.ts` - REST API endpoints

## API Endpoints

### GET /api/opportunities
Fetch all opportunities

### POST /api/opportunities
Create a new opportunity
```json
{
  "title": "Deal Title",
  "company": "Company Name",
  "value": 250000,
  "stage": "Discovery",
  "probability": 50,
  "expectedCloseDate": "2025-12-31",
  "description": "Deal description..."
}
```

### PUT /api/opportunities
Update an existing opportunity
```json
{
  "id": "opportunity-id",
  "title": "Updated Title",
  ...
}
```

### DELETE /api/opportunities
Delete an opportunity
```json
{
  "id": "opportunity-id"
}
```

## Features

✅ Auto-creates database on first run
✅ Full CRUD operations
✅ Automatic timestamps (createdAt, updatedAt)
✅ Unique ID generation with nanoid
✅ Type-safe with TypeScript + Drizzle ORM
✅ Frontend automatically syncs with database

## How It Works

1. When the app loads, it calls `/api/opportunities` to fetch all data
2. When you create/edit/delete an opportunity, it makes the appropriate API call
3. After each operation, the frontend refetches all opportunities
4. The database file persists between sessions

## Next Steps (Optional)

- Add data validation
- Implement contacts API
- Add search/filter functionality
- Export data to CSV/Excel
- Backup/restore functionality
