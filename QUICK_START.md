# 🚀 TREASURE HUNT QUICK START GUIDE

## ✅ System Status
- ✅ 20 NFTs generated with puzzle layers and art rarity
- ✅ Database updated with treasure hunt fields
- ✅ 20 NFTs synced to database
- ✅ Backend API ready
- ✅ Frontend components built
- ✅ All routes configured

## 🎯 START TESTING NOW

### 1. Start Backend Server
```bash
cd "C:\Users\andre\The Levasseur Treasure of Seychelles\backend"
node server.js
```
**Should see:** 
- Server running on port 3001
- Database connected
- API routes loaded

### 2. Start Frontend  (New Terminal)
```bash
cd "C:\Users\andre\The Levasseur Treasure of Seychelles\frontend"
npm start
```
**Should see:**
- Webpack compiling
- Opens http://localhost:3000

### 3. Test Gallery Minted
1. Navigate to **Gallery Minted** section
2. You should see 20 NFTs displayed
3. Each NFT shows:
   - ⭐ Rarity badge (colored, top-right corner)
   - 🔍 Puzzle badge (if NFT has puzzle clue)
   - Thumbnail image

### 4. Test Layer Viewer
1. **Click any NFT** in the gallery
2. Layer Viewer modal should open
3. Try these actions:
   - **Toggle Base Layer** (Layer 0) - always visible
   - **Click puzzle NFTs** (#5, #12, #17, #20) - toggle puzzle layer on/off
   - **Zoom In/Out** - use + / - buttons or keyboard
   - **Pan** - drag image when zoomed
   - **Reset View** - click Reset button
   - **Close** - ESC key or X button

#### Puzzle NFTs to Test:
- **NFT #5:** Cipher text overlay (Layer 1)
- **NFT #12:** Map fragment overlay (Layer 2)
- **NFT #17:** Decoding key overlay (Layer 3)
- **NFT #20:** Coordinates overlay (Layer 1)

### 5. Test Puzzle Submission
1. Navigate to **/solve-puzzle**
2. You should see:
   - Prize display ($750)
   - Instructions
   - Puzzle NFT list
   - Answer input field
3. Enter: **ANSE MAJOR TRAIL**
4. Click Submit
5. Should see: **🎉 CONGRATULATIONS! You solved the puzzle!**

Try wrong answer:
- Enter anything else
- Should see error message
- Hint displayed
- "Try Again" button

### 6. Test Rarity Display
Check rarity badges throughout:
- **Gallery thumbnails** - color-coded corner badges
- **Layer Viewer** - rarity shown in sidebar
- **Colors:**
  - Epic: Purple (#9d4edd) - NFTs #1, #19
  - Rare: Blue (#3a86ff) - NFTs #5, #8, #12, #17
  - Uncommon: Green (#06d6a0) - NFTs #2, #7, #11, #14, #16, #20
  - Common: Gray (#8d99ae) - NFTs #3, #4, #6, #9, #10, #13, #15, #18

---

## 🔍 TESTING CHECKLIST

### Gallery Display
- [ ] 20 NFTs visible
- [ ] Rarity badges show correct colors
- [ ] Puzzle badges appear on #5, #12, #17, #20
- [ ] Images load correctly
- [ ] Click opens Layer Viewer

### Layer Viewer
- [ ] Modal opens on NFT click
- [ ] Base artwork displays
- [ ] Layer toggles work (for puzzle NFTs)
- [ ] Overlays fade in/out smoothly
- [ ] Zoom controls work
- [ ] Pan/drag works when zoomed
- [ ] Reset button works
- [ ] Close button works
- [ ] ESC key closes viewer
- [ ] Rarity displayed correctly

### Puzzle Submission
- [ ] Page loads at /solve-puzzle
- [ ] Prize display shows $750
- [ ] Instructions visible
- [ ] Answer input works
- [ ] Correct answer shows success
- [ ] Wrong answer shows error + hint
- [ ] Can try again after wrong answer
- [ ] No auth required (testnet mode)

### Rarity System
- [ ] All NFTs have rarity badges
- [ ] Colors match tier (Epic=Purple, Rare=Blue, etc.)
- [ ] Badges visible in gallery
- [ ] Badges visible in Layer Viewer
- [ ] Distribution correct (2 Epic, 4 Rare, 6 Uncommon, 8 Common)

---

## 📁 KEY FILES

### Generated Assets
```
content/treasure_hunt_chapter1/
├── images/             # 20 base artworks
├── layers/             # 4 puzzle overlays
├── metadata/           # 20 metadata JSONs
├── puzzle_solution.txt
└── art_rarity_assignments.txt
```

### Backend
```
backend/
├── server.js                    # Asset serving
├── routes/treasure_hunt.js      # Puzzle API
├── sync_treasure_hunt_nfts.js   # Database sync
└── database.sqlite              # NFTs stored here
```

### Frontend
```
frontend/src/
├── components/LayerViewer.js    # Modal viewer
├── pages/Gallery.js             # Enhanced gallery
├── pages/SolvePuzzle.js         # Submission page
└── App.js                       # Routes
```

---

## 🐛 TROUBLESHOOTING

### NFTs Not Showing
- Check backend is running on port 3001
- Check `http://localhost:3001/treasure_hunt/chapter1/images/nft_1.png`
- Verify database has Chapter 1 NFTs: Run query `SELECT * FROM nfts WHERE chapter = 'Chapter 1'`

### Layer Viewer Not Opening
- Check browser console for errors
- Verify NFT has `layers` field in database
- Check NFT click handler in Gallery.js

### Puzzle Layers Not Toggling
- Check layer images exist: `content/treasure_hunt_chapter1/layers/`
- Verify NFT #5, #12, #17, #20 have `puzzle_enabled = 1`
- Check browser console for 404 errors

### Puzzle Submission Fails
- Check backend route: `http://localhost:3001/api/treasure-hunt/info/chapter1`
- Verify treasure_hunt.js route is loaded
- Check answer is exactly: "ANSE MAJOR TRAIL" (case-insensitive)

### Images Not Loading
- Check asset paths in server.js
- Verify static middleware configured
- Try direct URL: `http://localhost:3001/treasure_hunt/chapter1/images/nft_5.png`

---

## 🎨 OPTIONAL ENHANCEMENTS

### Rarity Collection Tracker
Add to Gallery or create new page:
```javascript
// Show user's collection progress
function RarityTracker({ userNFTs }) {
  const progress = {
    Epic: { owned: 1, total: 2 },
    Rare: { owned: 2, total: 4 },
    Uncommon: { owned: 3, total: 6 },
    Common: { owned: 5, total: 8 }
  };
  
  return (
    <div>
      {Object.entries(progress).map(([tier, {owned, total}]) => (
        <div key={tier}>
          {tier}: {owned}/{total}
          {owned === total && <span>✓ Complete! Bonus: $XXX</span>}
        </div>
      ))}
    </div>
  );
}
```

### Leaderboard
Add to /solve-puzzle:
```javascript
// Fetch and display first solvers
const [leaderboard, setLeaderboard] = useState([]);

useEffect(() => {
  axios.get(`${API_URL}/api/treasure-hunt/leaderboard/chapter1`)
    .then(res => setLeaderboard(res.data.leaderboard));
}, []);

// Display:
{leaderboard.map((solver, i) => (
  <div key={i}>
    {i + 1}. {solver.wallet_address} - {new Date(solver.submitted_at).toLocaleString()}
  </div>
))}
```

---

## ✨ SUCCESS!

Your treasure hunt system is fully functional and ready for testing!

**Next Steps:**
1. Test all features locally
2. Upload images to IPFS (optional for testnet)
3. Mint to XRPL testnet (optional)
4. Gather feedback
5. Iterate on UI/UX
6. Add optional features (tracker, leaderboard)
7. Prepare for mainnet (add authentication, rate limiting)

**Enjoy testing! 🏴‍☠️**
