# 🏴‍☠️ The Levasseur Treasure of Seychelles NFT Project

A full-stack web3 application built on the XRPL (XRP Ledger) that gamifies the legendary treasure hunt of Olivier Levasseur, the famous pirate whose final treasure remains hidden in the Seychelles islands.

## 📖 Project Overview

This project combines historical intrigue with cutting-edge blockchain technology to create an immersive NFT experience. Users can collect unique NFTs representing historical artifacts and clues, then participate in solving the actual 300-year-old cryptogram left by the notorious pirate Olivier Levasseur.

### 🎯 Key Features

- **Historical NFT Collection**: 100 unique procedurally generated NFTs on XRPL
- **Interactive Cryptogram Puzzle**: Solve the real Levasseur cipher for rewards  
- **XUMM Wallet Integration**: Seamless XRPL wallet connection
- **Marketplace Functionality**: Buy, sell, and trade NFTs with offers
- **Admin Dashboard**: Collection management and analytics
- **Responsive Design**: Mobile-first, pirate-themed UI

## 🏗️ Architecture

### Backend (Node.js + Express)
- RESTful API with JWT authentication
- SQLite database with comprehensive schema
- XRPL integration for NFT operations
- IPFS storage for metadata and images
- Real-time offer management system

### Frontend (React 18)
- Single Page Application with React Router
- XUMM wallet integration via React Context
- Styled Components with custom theme system
- Framer Motion animations
- React Query for data fetching
- Gallery Minted quick-select tabs to filter minted chapters (surfacing Chapter III artifacts immediately)

### Blockchain (XRPL)
- Native NFTs using XRPL's built-in NFT functionality
- Testnet deployment for development
- Production ready for Mainnet
- Gas-efficient transactions

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- XUMM wallet app (for testing)
- NFT.Storage account (for IPFS)

### Installation

```bash
# Clone and install all dependencies
git clone <repository-url>
cd "The Levasseur Treasure of Seychelles"
npm run install:all

# Or install manually
npm install           # Root dependencies
cd backend && npm install
cd ../frontend && npm install
```

### Environment Setup

1. **Backend Configuration** (`backend/.env`):
```env
NODE_ENV=development
PORT=5000
JWT_SECRET=your_super_secure_jwt_secret_here
DATABASE_URL=sqlite:./database.sqlite

# XRPL Configuration
XRPL_NETWORK=wss://s.altnet.rippletest.net:51233
XRPL_WALLET_SEED=your_xrpl_wallet_seed_here
XRPL_WALLET_ADDRESS=your_xrpl_wallet_address_here

# IPFS Configuration  
NFT_STORAGE_TOKEN=your_nft_storage_api_token_here

# Admin Configuration
ADMIN_USERNAME=admin
ADMIN_PASSWORD=secure_admin_password_here
```

2. **Frontend Configuration** (`frontend/.env`):
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_XRPL_NETWORK=wss://s.altnet.rippletest.net:51233
REACT_APP_EXPLORER_URL=https://testnet.xrpl.org
```

### Database Setup

```bash
# Initialize database and run migrations
npm run migrate
npm run seed  # Optional: seed with sample data
```

### Running the Application

```bash
# Start both backend and frontend
npm run dev

# Or run separately
npm run dev:backend   # Backend on http://localhost:5000
npm run dev:frontend  # Frontend on http://localhost:3000
```

## 🔧 Development

### Project Structure

```
The Levasseur Treasure of Seychelles/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── middleware/      # Authentication, CORS, etc.
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Helper functions
│   ├── database/           # SQLite database
│   └── uploads/            # File upload storage
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Wallet, NFT)
│   │   ├── pages/          # Route components
│   │   └── utils/          # Helper functions
│   └── public/             # Static assets
├── scripts/                # NFT generation & deployment
├── generated/              # Generated NFT assets
└── metadata/               # IPFS metadata
```

### Available Scripts

**Root Level:**
- `npm run dev` - Start both backend and frontend
- `npm run install:all` - Install all dependencies
- `npm run generate` - Generate NFT artwork
- `npm run upload` - Upload to IPFS
- `npm run mint` - Mint NFTs to XRPL

**Backend:**
- `npm run dev` - Development server with nodemon
- `npm start` - Production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data

**Frontend:**
- `npm start` - Development server
- `npm run build` - Production build
- `npm test` - Run tests

#### VS Code Tasks

Two ready-to-run VS Code tasks live in `.vscode/tasks.json`:
- **frontend: build minted gallery** – runs `npm --prefix frontend run build` from the workspace root
- **render: chapter6 manifest cards** – executes `node scripts/render_ch6_manifest_cards.mjs`

## 🎨 NFT Generation

The project includes a comprehensive NFT generation system:

```bash
# Generate 100 unique pirate-themed NFTs
npm run generate

# Build metadata for IPFS
npm run metadata

# Upload to IPFS via NFT.Storage
npm run upload

# Mint to XRPL testnet
npm run mint
```

### Art Generation Features
- **Procedural Generation**: Unique combinations of traits
- **Pirate Theme**: Maps, compasses, coins, jewels, weapons
- **Rarity System**: Common to legendary items
- **High Quality**: 1000x1000px PNG with transparency

## 🔐 XRPL Integration

### Wallet Connection
The app uses XUMM for secure wallet operations:

```javascript
// Connect wallet
const { isConnected, account, connectWallet } = useWallet();

// Sign transactions
const txResponse = await signTransaction(transaction);
```

### NFT Operations
- **Minting**: Create new NFTs on XRPL
- **Trading**: Built-in offer system  
- **Transfers**: Secure P2P transfers
- **Metadata**: IPFS-stored with proper schemas

### Testnet vs Mainnet
- Development uses XRPL Testnet (`wss://s.altnet.rippletest.net:51233`)
- Production ready for Mainnet (`wss://xrplcluster.com`)
- Environment variables control network selection

## 🧩 The Cryptogram Challenge

The centerpiece puzzle is based on the actual cryptogram left by Olivier Levasseur:

```
aprè fenn bolot ozv drn
dulm on lo C l drlvn md
krvme navsa us per usapo
lolt wh strent il per snvc
lt B lftnduhhCh konlq avntn
ln @ x dne ot fla mhe dorh
```

### Solving Features
- **Interactive Interface**: Click coordinates to build solutions
- **Hint System**: Graduated clues for assistance  
- **Solution Tracking**: Database of all attempts
- **Rewards**: Special NFTs for correct solutions

## 🎯 API Documentation

### Authentication Endpoints
```
POST /api/auth/login     # Admin login
POST /api/auth/wallet    # Wallet-based auth
GET  /api/auth/verify    # Verify JWT token
```

### NFT Endpoints  
```
GET    /api/nfts           # List all NFTs (paginated)
GET    /api/nfts/:id       # Get specific NFT
POST   /api/nfts           # Create new NFT (admin)
PUT    /api/nfts/:id       # Update NFT (admin)
DELETE /api/nfts/:id       # Delete NFT (admin)
```

### Offers & Trading
```
GET  /api/offers           # List offers
POST /api/offers           # Create offer
PUT  /api/offers/:id       # Update offer
GET  /api/offers/nft/:id   # Get offers for NFT
```

### Puzzle & Solutions
```
GET  /api/puzzle           # Get cryptogram data
POST /api/puzzle/solution  # Submit solution
GET  /api/puzzle/hints     # Get available hints
GET  /api/solutions        # List all solutions (admin)
```

## 🚀 Deployment

### Backend Deployment (Heroku)

```bash
# Create Heroku app
heroku create levasseur-treasure-api

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
heroku config:set XRPL_NETWORK=wss://xrplcluster.com
# ... set all required env vars

# Deploy
git subtree push --prefix backend heroku main
```

### Frontend Deployment (Netlify)

```bash
# Build for production
cd frontend && npm run build

# Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Environment Variables for Production

**Backend (Heroku):**
- `NODE_ENV=production`
- `DATABASE_URL` (if using PostgreSQL)
- `XRPL_NETWORK=wss://xrplcluster.com` (mainnet)
- All other vars from development

**Frontend (Netlify):**
- `REACT_APP_API_URL=https://your-backend.herokuapp.com/api`
- `REACT_APP_XRPL_NETWORK=wss://xrplcluster.com`

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test                    # Run all tests
npm run test:unit          # Unit tests only  
npm run test:integration   # Integration tests
npm run test:xrpl         # XRPL integration tests
```

### Frontend Testing
```bash
cd frontend  
npm test                   # Jest + React Testing Library
npm run test:e2e          # Cypress end-to-end tests
```

### Manual Testing Checklist

**Wallet Integration:**
- [ ] XUMM app connection works
- [ ] Account balance displays correctly  
- [ ] Transaction signing works
- [ ] Error handling for failed connections

**NFT Operations:**
- [ ] Gallery loads and displays NFTs
- [ ] Filtering and search work
- [ ] Individual NFT pages load
- [ ] Offer creation and management
- [ ] Purchase flows complete successfully

**Puzzle Interface:**
- [ ] Cryptogram displays correctly
- [ ] Coordinate input system works
- [ ] Hint system functions
- [ ] Solution submission processes
- [ ] Historical attempts display

## 🎨 UI/UX Features

### Design System
- **Color Palette**: Rich browns, golds, and ocean blues
- **Typography**: Pirate-themed fonts with excellent readability
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Mobile-first design approach

### Accessibility
- **ARIA Labels**: Comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard accessibility  
- **Color Contrast**: WCAG 2.1 AA compliance
- **Focus Management**: Logical tab order

### Performance  
- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Service worker for offline functionality
- **Bundle Size**: Optimized builds under 500KB

## 🔧 Troubleshooting

### Common Issues

**XUMM Connection Problems:**
```javascript
// Check XUMM app is installed and updated
// Verify network configuration matches
// Clear browser cache and localStorage
```

**Database Connection Issues:**
```bash
# Reset database
rm backend/database.sqlite
npm run migrate
npm run seed
```

**XRPL Network Issues:**
```javascript
// Switch between testnet and mainnet
// Check network status at xrpl.org
// Verify wallet has sufficient XRP for transactions
```

### Error Codes
- `AUTH_001`: Invalid JWT token
- `WALLET_001`: XUMM connection failed  
- `NFT_001`: NFT not found
- `OFFER_001`: Invalid offer parameters
- `PUZZLE_001`: Invalid solution format

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style
- **Backend**: ESLint with Airbnb config
- **Frontend**: Prettier + ESLint React config
- **Commits**: Conventional Commits format
- **Documentation**: JSDoc for functions

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Olivier Levasseur**: The legendary pirate whose mystery inspired this project
- **XRPL Community**: For the incredible blockchain technology
- **XUMM Team**: For the outstanding wallet integration tools  
- **NFT.Storage**: For reliable IPFS hosting
- **React Community**: For the amazing development ecosystem

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **XRPL Explorer**: https://testnet.xrpl.org
- **XUMM Wallet**: https://xumm.app
- **Project Documentation**: [Wiki Link]
- **Bug Reports**: [Issues Link]

---

*"At 4 degrees South latitude and 55 degrees East longitude, lies the treasure of Olivier Levasseur... but first, you must solve the cipher."*

🏴‍☠️ **Happy Treasure Hunting!** 🏴‍☠️