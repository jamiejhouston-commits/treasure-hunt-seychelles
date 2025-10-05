# Deployment Guide - Seychelles Treasure Hunt

## Step 1: Deploy Backend to Railway

1. Go to https://railway.app/
2. Click **"Start a New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **"treasure-hunt-seychelles"** repository
5. Railway will auto-detect the Node.js backend
6. Configure environment variables:
   - Click on your service → Variables
   - Add these (use placeholder values for now):
     ```
     PORT=3001
     NODE_ENV=production
     XRPL_NETWORK=testnet
     FRONTEND_URL=https://treasurehunt-seychelles.com
     ```
7. Deploy! Railway will give you a URL like: `https://treasure-hunt-seychelles-production.up.railway.app`
8. **SAVE THIS URL** - you'll need it for the frontend

## Step 2: Deploy Frontend to Vercel

1. Go to https://vercel.com/
2. Click **"Add New Project"**
3. Import **"treasure-hunt-seychelles"** from GitHub
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
5. Add Environment Variable:
   - `REACT_APP_API_URL` = Your Railway backend URL from Step 1
   - Example: `https://treasure-hunt-seychelles-production.up.railway.app`
6. Click **"Deploy"**
7. Vercel will give you a URL like: `https://treasure-hunt-seychelles.vercel.app`

## Step 3: Connect Custom Domain

1. In Vercel, go to your project → Settings → Domains
2. Add domain: **treasurehunt-seychelles.com**
3. Vercel will show you DNS records to add
4. Go to GoDaddy → Your domain → DNS Management
5. Add the DNS records Vercel provides (usually A record and CNAME)
6. Wait 10-60 minutes for DNS to propagate
7. Your site will be live at https://treasurehunt-seychelles.com

## Step 4: Update Backend URL

1. After domain is connected, update Railway environment variable:
   - Change `FRONTEND_URL` to `https://treasurehunt-seychelles.com`
2. Redeploy backend on Railway

## Step 5: Test Everything

- Visit https://treasurehunt-seychelles.com
- Check that NFTs load from gallery
- Test wallet connection
- Verify images display correctly

---

## What I'll Do For You

Since you want me to handle this, I'll guide you through the Railway and Vercel signups, then help you configure everything. The process will take about 15-20 minutes total.

Ready to start?
