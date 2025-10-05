// Inserts cinematic preview images into the nfts table as a new chapter without overwriting existing tokens.
// Usage: node add_cinematic_preview.js --count=10 --chapter=cinematic_preview --startId=9001

const path = require('path');
const fs = require('fs');
const db = require('./database/connection');

async function main(){
  const args = process.argv.slice(2);
  const getArg = (name, def) => {
    const a = args.find(x=>x.startsWith(`--${name}=`));
    return a ? a.split('=')[1] : def;
  };
  const count = parseInt(getArg('count', '10'),10);
  const chapter = getArg('chapter','cinematic_preview');
  const startId = parseInt(getArg('startId','9001'),10);

  const imgDir = path.resolve(__dirname,'../content/cinematic_preview/images');
  const metaDir = path.resolve(__dirname,'../content/cinematic_preview/metadata');
  if(!fs.existsSync(imgDir)){
    console.error('Images directory not found:', imgDir); process.exit(1);
  }
  if(!fs.existsSync(metaDir)){
    console.error('Metadata directory not found:', metaDir); process.exit(1);
  }
  const files = fs.readdirSync(imgDir).filter(f=>f.endsWith('.png')).sort();
  if(files.length < count){
    console.error(`Requested count ${count} but only ${files.length} images available.`); process.exit(1);
  }

  console.log(`Inserting ${count} cinematic preview NFTs starting at token_id ${startId} (chapter=${chapter})`);
  for(let i=0;i<count;i++){
    const file = files[i];
    const tokenId = startId + i;
    const name = `Cinematic Preview #${i+1}`;
    const relImg = `/${chapter}/images/${file}`;
    const metaName = file.replace('.png','.json');
    const relMeta = `/${chapter}/metadata/${metaName}`;
    const exists = await db('nfts').where({ token_id: tokenId }).first();
    if(exists){
      console.log(`Skipping token_id ${tokenId} (already exists)`);
      continue;
    }
    const rarityPool = ['common','uncommon','rare','epic','legendary'];
    const rarity = rarityPool[Math.min(rarityPool.length-1, Math.floor(i/3))];
    const record = {
      token_id: tokenId,
      name,
      description: 'Cinematic Seychelles pirate adventure preview scene.',
      image_uri: relImg,
      metadata_uri: relMeta,
      chapter,
      island: 'preview',
      rarity,
      attributes: JSON.stringify([]),
      current_owner: null,
      price_xrp: null,
      for_sale: 0,
      created_at: new Date().toISOString()
    };
    await db('nfts').insert(record);
    console.log(`  ✔ Inserted token_id ${tokenId} -> ${file}`);
  }
  console.log('Done. Query: /api/nfts?chapter=' + chapter);
  process.exit(0);
}

main().catch(e=>{ console.error(e); process.exit(1); });
