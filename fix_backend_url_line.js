const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'frontend/src/contexts/NFTContext.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix the incorrect line 7
content = content.replace(
  "const BACKEND_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || '${BACKEND_BASE_URL}';",
  "const BACKEND_BASE_URL = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:3001';"
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Fixed BACKEND_BASE_URL line');
