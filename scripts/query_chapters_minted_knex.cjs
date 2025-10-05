#!/usr/bin/env node
const path = require('path');
process.env.NODE_ENV='development';
const db = require('../backend/database/connection');
(async () => {
  try {
    const ch3 = await db('nfts').select('token_id','nftoken_id').where({chapter:'III'}).whereNotNull('nftoken_id').orderBy('token_id');
    const ch5 = await db('nfts').select('token_id','nftoken_id').where({chapter:'V'}).whereNotNull('nftoken_id').orderBy('token_id');
    console.log(JSON.stringify({ ch3Count: ch3.length, ch3, ch5Count: ch5.length, ch5Sample: ch5.slice(0,50) }, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await db.destroy();
  }
})();
