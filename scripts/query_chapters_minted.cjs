#!/usr/bin/env node
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname,'..','backend','database.sqlite'));

const ch3 = db.prepare("select token_id, nftoken_id from nfts where chapter='III' and nftoken_id is not null order by token_id").all();
const ch5 = db.prepare("select token_id, nftoken_id from nfts where chapter='V' and nftoken_id is not null order by token_id").all();
console.log(JSON.stringify({ ch3Count: ch3.length, ch3, ch5Count: ch5.length, ch5Sample: ch5.slice(0,30) }, null, 2));
