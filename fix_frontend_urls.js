const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/contexts/NFTContext.js');
let content = fs.readFileSync(filePath, 'utf8');

// Add BACKEND_BASE_URL constant
if (!content.includes('BACKEND_BASE_URL')) {
  content = content.replace(
    /const API_BASE_URL = process\.env\.REACT_APP_API_URL \|\| 'http:\/\/localhost:3001\/api';/,
    `const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const BACKEND_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';`
  );
}

// Replace all hardcoded localhost:3001 with BACKEND_BASE_URL
content = content.replace(/http:\/\/localhost:3001(?!\/api)/g, '${BACKEND_BASE_URL}');

// Fix template literals
content = content.replace(/\$\{BACKEND_BASE_URL\}/g, '`${BACKEND_BASE_URL}`');
content = content.replace(/`\$\{BACKEND_BASE_URL\}`/g, '${BACKEND_BASE_URL}');

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Fixed all localhost URLs in NFTContext.js');
console.log('✅ Added BACKEND_BASE_URL constant');
console.log('✅ File updated successfully');
