# Puzzle Overlay Update Summary

## Problem Identified
The puzzle overlay images were showing OLD cached content in the browser because:

1. **Wrong Directory**: New overlay images were created in `public/images/` and `backend/public/images/` directories
2. **Server Path Mismatch**: The server actually serves files from `content/treasure_hunt_chapter1/layers/` directory
3. **Old Metadata**: The metadata JSON files and database had old hint text that didn't match the new images
4. **Browser Caching**: The server uses `maxAge: '1d'` caching headers, causing browsers to cache the old images

## Files Updated

### Database Updates (✅ COMPLETED)
- NFT #5: Updated hint to "CFM PNCSF" (was "HUZL THQVY AYHNSI")
- NFT #17: Updated hint to "SHIFT BACK ONE LETTER" (was "SHIFT BY SEVEN")
- NFT #20: Updated hint to "4.6097° S, 55.4263° E" (was "4.6167° S, 55.4167° E")

### Metadata Files Updated (✅ COMPLETED)
- `/content/treasure_hunt_chapter1/metadata/nft_5.json`
- `/content/treasure_hunt_chapter1/metadata/nft_17.json`
- `/content/treasure_hunt_chapter1/metadata/nft_20.json`

### Layer Images Updated (✅ COMPLETED)
All new overlay images copied to correct location:
- `/content/treasure_hunt_chapter1/layers/nft_5_layer_1.png` (24KB, Oct 3 2025)
- `/content/treasure_hunt_chapter1/layers/nft_12_layer_2.png` (29KB, Oct 3 2025)
- `/content/treasure_hunt_chapter1/layers/nft_17_layer_3.png` (28KB, Oct 3 2025)
- `/content/treasure_hunt_chapter1/layers/nft_20_layer_1.png` (29KB, Oct 3 2025)

## Expected Content

The browser should now display:

### NFT #5 (Cipher Text)
- **Overlay shows**: "CFM PNCSF" cipher text
- **Database hint**: "CFM PNCSF"
- **Layer type**: cipher_text
- **URL**: http://localhost:3001/treasure_hunt/chapter1/layers/nft_5_layer_1.png

### NFT #12 (Map Fragment)
- **Overlay shows**: Mahé island map with "Bel Ombre" marked
- **Database hint**: "trail_map"
- **Layer type**: map_fragment
- **URL**: http://localhost:3001/treasure_hunt/chapter1/layers/nft_12_layer_2.png

### NFT #17 (Decoding Key)
- **Overlay shows**: "SHIFT BACK ONE LETTER" instruction text
- **Database hint**: "SHIFT BACK ONE LETTER"
- **Layer type**: decoding_key
- **URL**: http://localhost:3001/treasure_hunt/chapter1/layers/nft_17_layer_3.png

### NFT #20 (Coordinates)
- **Overlay shows**: "4.6097° S, 55.4263° E" GPS coordinates
- **Database hint**: "4.6097° S, 55.4263° E"
- **Layer type**: coordinates
- **URL**: http://localhost:3001/treasure_hunt/chapter1/layers/nft_20_layer_1.png

## How to Clear Browser Cache

### Method 1: Hard Refresh (Recommended)
1. Open the gallery page in your browser
2. Press **Ctrl + Shift + R** (Windows/Linux) or **Cmd + Shift + R** (Mac)
3. This forces the browser to bypass cache and fetch fresh images

### Method 2: Clear Browser Cache
1. Open DevTools (F12)
2. Right-click the refresh button → Select "Empty Cache and Hard Reload"

### Method 3: Disable Cache in DevTools
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable cache" checkbox
4. Refresh the page

### Method 4: Restart Backend Server
The server has ETags enabled, so restarting might help:
```bash
# Stop the current backend process (PID 29116)
# Then restart it
cd backend
npm start
```

## Verification

Run this command to verify all updates are in place:
```bash
cd backend
node verify_updates.js
```

Expected output:
```
NFT #5: CFM PNCSF (file exists, 24KB)
NFT #12: trail_map (file exists, 29KB)
NFT #17: SHIFT BACK ONE LETTER (file exists, 28KB)
NFT #20: 4.6097° S, 55.4263° E (file exists, 29KB)
```

## Server Configuration

The server serves layers from:
```javascript
// backend/server.js (line 391-405)
const treasureHuntCh1Base = path.resolve(__dirname, '../content/treasure_hunt_chapter1');
app.use('/treasure_hunt/chapter1/layers', imagesCors, express.static(
  path.join(treasureHuntCh1Base, 'layers'),
  {
    maxAge: '1d',      // 1 day cache
    etag: true,        // ETags enabled for cache validation
    setHeaders: (res) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
  }
));
```

## Root Cause

The original issue was a **file location mismatch**:
- New images were generated in `public/images/`
- Server was configured to serve from `content/treasure_hunt_chapter1/layers/`
- Database and metadata had old hint text

All three issues have been fixed:
1. ✅ Images copied to correct location
2. ✅ Database updated with correct hints
3. ✅ Metadata files updated with correct hints

The browser cache is the only remaining issue, which can be resolved with a hard refresh.
