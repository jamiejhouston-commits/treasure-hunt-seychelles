import { cards } from './generate_chapter3_s3.js';

const rows = cards.map((card) => ({
  Index: card.index,
  Title: `${card.code} — ${card.title}`,
  Place: card.place,
  TimeOfDay: card.timeOfDay,
  Rarity: card.rarity,
  Symbol: card.symbol,
  Clue: card.clue
}));

console.log(JSON.stringify(rows, null, 2));
