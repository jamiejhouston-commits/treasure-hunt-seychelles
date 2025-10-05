#!/usr/bin/env node
process.env.NODE_ENV='development';
const db=require('../backend/database/connection');
(async()=>{
  try {
  const ch5=await db('nfts').select('token_id','nftoken_id','chapter').where('chapter','like','%Chapter 5%').whereNotNull('nftoken_id').orderBy('token_id');
  const ch6=await db('nfts').count('* as c').where('chapter','like','%VI%').whereNotNull('nftoken_id').first();
    const ch3=await db('nfts').select('token_id','nftoken_id','chapter').where('chapter','like','%Chapter 3%').orderBy('token_id');
    console.log(JSON.stringify({chapter5MintedCount:ch5.length,chapter5Sample:ch5.slice(0,10),chapter6MintedCount:ch6?ch6.c:0,chapter3Count:ch3.length,chapter3First:ch3.slice(0,5)},null,2));
  } catch(e){console.error(e);} finally { await db.destroy(); }
})();
