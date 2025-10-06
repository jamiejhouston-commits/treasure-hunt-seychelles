# 🚨 EMERGENCY FIX FOR RENDER DATABASE WIPE

## THE PROBLEM
Render free tier restarts your backend every ~24 hours and WIPES the SQLite database.
When this happens, your live website shows **0 of 0 NFTs**.

## THE SOLUTION (10 SECONDS)

**When your live website shows 0 NFTs:**

1. Open this URL in your browser:
   ```
   https://treasure-hunt-seychelles-1.onrender.com/api/reset/reset-database
   ```

2. You'll see:
   ```json
   {"success":true,"message":"✅ Database reset complete! Created 40 NFTs (Chapter 1 & 2 with layers only)","nfts_created":40}
   ```

3. Refresh your gallery page:
   ```
   https://treasure-hunt-seychelles-3.onrender.com/gallery
   ```

4. **All 40 NFTs are back!**

---

## WHY THIS HAPPENS

- Render free tier uses **ephemeral storage**
- Every restart = SQLite database file gets deleted
- Auto-populate on startup sometimes fails
- Manual reset always works

---

## BOOKMARK THIS PAGE

Keep this file handy for when it happens again (and it will).

**This is a 10-second fix instead of hours of debugging.**

---

## PERMANENT FIX (Future)

To prevent this forever:
- Upgrade Render backend to paid tier ($7/month) - persistent storage
- OR switch to PostgreSQL (free but complex setup)

For now, just use the reset URL above when needed.

---

**Last Updated:** October 6, 2025
**Status:** Working solution ✅
