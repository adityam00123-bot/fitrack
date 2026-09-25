const fs = require('fs');

function parseCSV(text) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let current = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i+1];
    
    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current);
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && next === '\n') i++;
      row.push(current);
      if (row.some(x => x.trim())) lines.push(row);
      row = [];
      current = '';
    } else {
      current += char;
    }
  }
  if (row.length > 0) {
    row.push(current);
    if (row.some(x => x.trim())) lines.push(row);
  }
  return lines;
}

const content = fs.readFileSync('src/data/exercises_gifs.csv', 'utf8');
const rows = parseCSV(content);
const headers = rows[0];
console.log('Headers:', headers);
console.log('Total exercises:', rows.length - 1);

const bodyParts = new Set();
const targets = new Set();
const equipments = new Set();

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  bodyParts.add(r[0]);
  equipments.add(r[1]);
  targets.add(r[4]);
}

console.log('\nBody parts:', [...bodyParts]);
console.log('\nTargets:', [...targets]);
console.log('\nEquipments:', [...equipments]);

// Sample 3 rows
console.log('\nSample row 1:', rows[1].slice(0, 6));
console.log('\nSample row 25 (bench press?):', rows.find(r => r[3] && r[3].includes('bench press'))?.slice(0, 6));
console.log('\nSample row deadlift:', rows.find(r => r[3] && r[3].includes('deadlift'))?.slice(0, 6));
