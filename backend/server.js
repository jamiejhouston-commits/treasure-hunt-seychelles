const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const imagesCors = cors({ origin: true, credentials: false });
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Import routes and middleware
const nftRoutes = require('./routes/nfts');
const offersRoutes = require('./routes/offers');
const puzzleRoutes = require('./routes/puzzle');
const treasureHuntRoutes = require('./routes/treasure_hunt');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const previewRoutes = require('./routes/preview');
const tradingRoutes = require('./routes/trading');
const progressRoutes = require('./routes/progress');
const { errorHandler, notFound } = require('./middleware/errorHandleware');
const { logger } = require('./utils/logger');
const db = require('./database/connection');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:", "http:", "ipfs://"],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", "wss://", "https://"]
        }
    }
}));

// CORS configuration
// In development your frontend has been observed running on port 3003 (and other tools may use 5173/Vite),
// so widen the allowed origins to prevent the gallery from receiving CORS rejections (which manifests as 0 NFTs shown).
const devOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001', // sometimes used for API explorer embedding
    'http://localhost:3002',
    'http://localhost:3003', // observed frontend dev server
    'http://127.0.0.1:3003',
    'http://localhost:5173', // Vite default
    'http://127.0.0.1:5173'
];

app.use(cors({
        origin: isProduction
                ? ['https://treasureofseychelles.com', 'https://www.treasureofseychelles.com']
                : function(origin, callback) {
                        // Allow requests with no origin like curl or mobile apps
                        if (!origin) return callback(null, true);
                        if (devOrigins.includes(origin)) return callback(null, true);
                        // Allow any other localhost:* for flexibility during development
                        if (/^http:\/\/localhost:\d+$/.test(origin) || /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) {
                            return callback(null, true);
                        }
                        return callback(new Error('CORS: Origin not allowed in development: ' + origin));
                },
        credentials: true,
        allowedHeaders: ['Content-Type', 'X-API-Key', 'Authorization']
}));

// Debug log for CORS in development
if (!isProduction) {
    console.log('[DEV] CORS enabled for origins:', devOrigins.join(', '));
}

app.use(compression());

// Enable trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = isProduction
    ? rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // production: limit each IP to 100 requests per windowMs
            message: {
                error: 'Too many requests from this IP, please try again later.'
            },
            standardHeaders: true,
            legacyHeaders: false
        })
    : (req, res, next) => next();
app.use(limiter);

// Stricter rate limiting for puzzle submissions
const puzzleLimiter = isProduction
    ? rateLimit({
            windowMs: 60 * 60 * 1000, // 1 hour
            max: 10, // limit each IP to 10 puzzle submissions per hour
            message: {
                error: 'Too many puzzle attempts from this IP, please wait an hour.'
            },
            standardHeaders: true,
            legacyHeaders: false
        })
    : (req, res, next) => next();

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined', { 
    stream: { write: message => logger.info(message.trim()) }
}));

// Serve REAL MINTED IMAGES from our generation
const realImagesPath = path.resolve(__dirname, '../scripts/dist/images');
app.use('/real/images', imagesCors, express.static(realImagesPath, {
  maxAge: '1d',
  etag: true
}));

// Serve Chapter 3 preview images for approval (S3 placeholders)
const chapter3PreviewPath = path.resolve(__dirname, '../scripts/dist/images/s3');
app.use('/preview/chapter3', imagesCors, express.static(chapter3PreviewPath, {
    maxAge: '5m',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Serve S3 series images (alias of chapter3 preview for minted S3 set)
const s3ImagesPath = path.resolve(__dirname, '../scripts/dist/images/s3');
app.use('/series/s3/images', imagesCors, express.static(s3ImagesPath, {
    maxAge: '1d',
    etag: true
}));

// Serve preview contact sheets
const previewSheetsPath = path.resolve(__dirname, '../scripts/dist/previews');
app.use('/preview/sheets', imagesCors, express.static(previewSheetsPath, {
    maxAge: '5m',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Serve SE2 images subdirectory specifically
app.use('/real/images/se2', imagesCors, express.static(path.join(realImagesPath, 'se2'), {
  maxAge: '1d',
  etag: true
}));

// Serve Chapter IV images and metadata
const chapter4ImagesPath = path.resolve(__dirname, '../content/ch4/images');
app.use('/ch4/images', imagesCors, express.static(chapter4ImagesPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

const chapter4MetadataPath = path.resolve(__dirname, '../content/ch4/metadata');
app.use('/ch4/metadata', imagesCors, express.static(chapter4MetadataPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Serve Chapter V comic preview assets
const chapter5ImagesPath = path.resolve(__dirname, '../content/ch5/images');
app.use('/ch5/images', imagesCors, express.static(chapter5ImagesPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

const chapter5MetadataPath = path.resolve(__dirname, '../content/ch5/metadata');
app.use('/ch5/metadata', imagesCors, express.static(chapter5MetadataPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Serve Chapter VI minted outputs (etched cards promoted to gallery)
const chapter6ImagesPath = path.resolve(__dirname, '../content/ch6/output');
app.use('/ch6/images', imagesCors, express.static(chapter6ImagesPath, {
    maxAge: '1d',
    etag: true,
    setHeaders: (res, filePath) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        if (path.extname(filePath).toLowerCase() === '.json') {
            res.setHeader('Content-Type', 'application/json');
        }
    }
}));

// Serve Mahé Manuscripts images and metadata (DB uses /mahe_manuscripts path while folder is mah__manuscripts)
const maheManuscriptsFsBase = path.resolve(__dirname, '../content/mah__manuscripts');
app.use('/mahe_manuscripts/images', imagesCors, express.static(path.join(maheManuscriptsFsBase, 'images'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
app.use('/mahe_manuscripts/metadata', imagesCors, express.static(path.join(maheManuscriptsFsBase, 'metadata'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Serve Praslin's Prophecy (DB path /praslin_prophecy, folder praslin_s_prophecy)
const praslinProphecyFsBase = path.resolve(__dirname, '../content/praslin_s_prophecy');
app.use('/praslin_prophecy/images', imagesCors, express.static(path.join(praslinProphecyFsBase, 'images'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
app.use('/praslin_prophecy/metadata', imagesCors, express.static(path.join(praslinProphecyFsBase, 'metadata'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Serve Chapter VII: Siren's Map of Praslin (Sophisticated Painterly)
const chapter7SirensMapBase = path.resolve(__dirname, '../content/ch7_sirens_map');
app.use('/content/ch7_sirens_map/output', imagesCors, express.static(path.join(chapter7SirensMapBase, 'output'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
app.use('/content/ch7_sirens_map/metadata', imagesCors, express.static(path.join(chapter7SirensMapBase, 'metadata'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Serve La Digue's Secrets (DB path /la_digue_secrets, folder la_digue_s_secrets)
const laDigueSecretsFsBase = path.resolve(__dirname, '../content/la_digue_s_secrets');
app.use('/la_digue_secrets/images', imagesCors, express.static(path.join(laDigueSecretsFsBase, 'images'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
app.use('/la_digue_secrets/metadata', imagesCors, express.static(path.join(laDigueSecretsFsBase, 'metadata'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Serve Outer Islands Revelation (DB path /outer_islands, folder outer_islands_revelation)
const outerIslandsFsBase = path.resolve(__dirname, '../content/outer_islands_revelation');
app.use('/outer_islands/images', imagesCors, express.static(path.join(outerIslandsFsBase, 'images'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
app.use('/outer_islands/metadata', imagesCors, express.static(path.join(outerIslandsFsBase, 'metadata'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Serve Chapter VI Pre-Mint etched card outputs (images + metadata JSON alongside each png)
// Directory structure: content/ch6/output/*.png + *.json
const chapter6PremintBase = path.resolve(__dirname, '../content/ch6/output');
app.use('/ch6_premint', imagesCors, express.static(chapter6PremintBase, {
    maxAge: '5m',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Cinematic preview (new generator output)
const cinematicPreviewBase = path.resolve(__dirname, '../content/cinematic_preview');
app.use('/cinematic_preview/images', imagesCors, express.static(path.join(cinematicPreviewBase, 'images'), {
    maxAge: '5m',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));
app.use('/cinematic_preview/metadata', imagesCors, express.static(path.join(cinematicPreviewBase, 'metadata'), {
    maxAge: '5m',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Story example route
const storyExampleBase = path.resolve(__dirname, '../content/story_example');
app.use('/story_example', imagesCors, express.static(storyExampleBase, {
    maxAge: '5m',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Pure vector story example route (no external silhouettes)
const vectorStoryBase = path.resolve(__dirname, '../content/story_vector_example');
app.use('/story_vector_example', imagesCors, express.static(vectorStoryBase, {
    maxAge: '5m',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Advanced painterly procedural scene route
const advancedPainterlyBase = path.resolve(__dirname, '../content/advanced_painterly_example');
app.use('/advanced_painterly_example', imagesCors, express.static(advancedPainterlyBase, {
    maxAge: '5m',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Serve local mock images (for development previews) - DISABLED FOR REAL NFTs
const mockImagesPath = path.resolve(__dirname, '../assets/images');
app.use('/mock/images', imagesCors, express.static(mockImagesPath, {
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'public, max-age=300');
    }
}));

// Serve minted/manifest outputs from scripts pipeline
const mintedPath = path.resolve(__dirname, '../scripts/dist');
app.use('/minted', express.static(mintedPath, {
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        res.setHeader('Cache-Control', 'no-cache');
    }
}));

// Serve Treasure Hunt Chapter 1 assets
const treasureHuntCh1Base = path.resolve(__dirname, '../content/treasure_hunt_chapter1');
app.use('/treasure_hunt/chapter1/images', imagesCors, express.static(path.join(treasureHuntCh1Base, 'images'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
app.use('/treasure_hunt/chapter1/layers', imagesCors, express.static(path.join(treasureHuntCh1Base, 'layers'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));
app.use('/treasure_hunt/chapter1/metadata', imagesCors, express.static(path.join(treasureHuntCh1Base, 'metadata'), {
    maxAge: '1d',
    etag: true,
    setHeaders: (res) => {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Serve public static files (HTML preview pages)
const publicPath = path.resolve(__dirname, './public');
app.use(express.static(publicPath, {
    setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

// Swagger API documentation
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Treasure of Seychelles API',
            version: '1.0.0',
            description: 'NFT marketplace and treasure hunt puzzle API powered by XRPL',
            contact: {
                name: 'Treasure Team',
                email: 'api@treasureofseychelles.com'
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' 
                    ? 'https://api.treasureofseychelles.com' 
                    : 'http://localhost:3001',
                description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'X-API-Key'
                }
            }
        }
    },
    apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Treasure of Seychelles API'
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        xrplNetwork: process.env.XRPL_NETWORK
    });
});

// API routes
app.use('/api/nfts', nftRoutes);
app.use('/api/offers', offersRoutes);
app.use('/api/puzzle', puzzleLimiter, puzzleRoutes);
app.use('/api/treasure-hunt', puzzleLimiter, treasureHuntRoutes);
app.use('/api/trading', puzzleLimiter, tradingRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/preview', previewRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: '🏴‍☠️ Welcome to the Treasure of Seychelles API',
        documentation: '/api-docs',
        health: '/health',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    server.close(() => {
        logger.info('Process terminated');
        process.exit(0);
    });
});

// Start server
const server = app.listen(PORT, () => {
    logger.info(`🏴‍☠️ Treasure of Seychelles API server running on port ${PORT}`);
    logger.info(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    logger.info(`💾 Database: ${process.env.DATABASE_URL || 'SQLite'}`);
    logger.info(`🌐 XRPL Network: ${process.env.XRPL_NETWORK}`);
    logger.info(`🔒 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;app.use('/api/populate', require('./routes/populate'));
