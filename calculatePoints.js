const fs = require('fs');
const content = fs.readFileSync('Formula1_2025Season_RaceResults.csv', 'utf8');
const lines = content.split('\n').filter(l => l.trim().length > 0);
const headers = lines[0].split(',');
// Track,Position,No,Driver,Team... Points is index 8 (0-based)
// Position is index 1

const drivers = {};

for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    if (cols.length < 9) continue;

    const no = cols[2].trim();
    const name = cols[3].trim();
    const pos = cols[1].trim();
    const pointsStr = cols[8].trim();
    const points = parseFloat(pointsStr) || 0;

    // Some lines might be Sprints? The CSV format looks uniform.

    if (!drivers[no]) {
        drivers[no] = {
            name: name,
            points: 0,
            podiums: 0
        };
    }

    drivers[no].points += points;

    if (['1', '2', '3'].includes(pos)) {
        drivers[no].podiums += 1;
    }
}

console.log(JSON.stringify(drivers, null, 2));
