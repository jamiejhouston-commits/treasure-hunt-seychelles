# FIX DATABASE - PERMANENT SOLUTION

## Problem:
Render free tier WIPES SQLite files on every restart. Your galleries break every ~24 hours when backend restarts.

## Solution:
Switch to PostgreSQL (FREE on Render, NEVER wipes)

---

## STEP 1: Go to Render Dashboard

1. Open: https://dashboard.render.com
2. Click "New +" button → Select "PostgreSQL"
3. Fill in:
   - **Name**: `treasure-seychelles-db`
   - **Database**: `treasure_db`
   - **User**: `treasure_user`
   - **Region**: Same as your backend (Oregon or wherever your backend is)
   - **Plan**: FREE
4. Click "Create Database"
5. Wait 30-60 seconds for it to provision

---

## STEP 2: Get Database URL

1. Click on your new database
2. Find "Internal Database URL" (looks like `postgresql://treasure_user:...@...`)
3. **COPY** that entire URL

---

## STEP 3: Add to Backend Service

1. Go back to dashboard
2. Click on your backend service (`treasure-hunt-seychelles-1`)
3. Go to "Environment" tab on the left
4. Click "Add Environment Variable"
5. Add this:
   - **Key**: `DATABASE_URL`
   - **Value**: (paste the Internal Database URL you copied)
6. Click "Save Changes"

**Backend will auto-redeploy (takes 2-3 minutes)**

---

## STEP 4: Update Code (DO THIS BEFORE RENDER REDEPLOYS)

### A. Add PostgreSQL package

Edit `backend/package.json`:

Find this line (around line 28):
```json
"morgan": "^1.10.0",
"sqlite3": "^5.1.6",
```

Change to:
```json
"morgan": "^1.10.0",
"pg": "^8.11.3",
"sqlite3": "^5.1.6",
```

### B. Update database connection

Edit `backend/database/connection.js`:

Find this section (lines 22-35):
```javascript
production: {
  client: process.env.DATABASE_CLIENT || 'sqlite3',
  connection: process.env.DATABASE_URL || {
    filename: sqliteFile
  },
```

Replace with:
```javascript
production: {
  client: process.env.DATABASE_URL ? 'pg' : 'sqlite3',
  connection: process.env.DATABASE_URL ? {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false }
  } : {
    filename: sqliteFile
  },
```

---

## STEP 5: Commit and Push

```bash
git add .
git commit -m "Switch to PostgreSQL for persistent database"
git push origin main
```

Render will auto-deploy. Wait 2-3 minutes.

---

## STEP 6: Verify It Works

1. Open: https://treasure-hunt-seychelles-3.onrender.com
2. Galleries should load
3. **Data will NEVER disappear again**

---

## DONE

Your database is now permanent. It will NEVER wipe on restarts.

This will fix the problem forever.
