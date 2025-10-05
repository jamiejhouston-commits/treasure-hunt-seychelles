#!/usr/bin/env node

console.log('🏴‍☠️ Debug: Script is running');
console.log('import.meta.url:', import.meta.url);
console.log('process.argv[1]:', process.argv[1]);
console.log('file://' + process.argv[1]);
console.log('Match:', import.meta.url === `file://${process.argv[1]}`);

import('./prepare_mint_batch.mjs').then(module => {
    console.log('🏴‍☠️ Running the main function...');
    return module.default();
}).catch(error => {
    console.error('💀 Error:', error);
    process.exit(1);
});