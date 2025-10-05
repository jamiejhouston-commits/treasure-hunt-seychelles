#!/usr/bin/env node

console.log('🏴‍☠️ Running batch minting...');

import('./batch_mint_new.mjs').then(module => {
    console.log('🏴‍☠️ Executing minting function...');
    return module.default();
}).catch(error => {
    console.error('💀 Minting Error:', error);
    process.exit(1);
});