const png = require('pngjs').PNG;
const fs = require('fs');

const { rand: Random } = require('../index.js');

const r = new Random(1024, 100, generateRandom);
let randomArray = [];

console.log('Getting random numbers...');

function generateRandom(callback) {
    randomArray = randomArray.concat(r.cache);
    r.cache.length = 0;
    console.log(`Got ${randomArray.length} random numbers`);
    if (randomArray.length === 65536) { // 256x256 pixels
        genBitmap();
        return;
    }
    r._cache(generateRandom);
}

function genBitmap() {
    console.log('Generating bitmap...');
    const randomBitArray = randomArray.map((i) => i % 2);
    const p = new png({
        filterType: -1,
        width: 256,
        height: 256,
    });
    p.data = [];
    for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
            const currpix = 256 * y + x;
            const idx = currpix << 2;
            p.data[idx] = 255 * randomBitArray[currpix];
            p.data[idx + 1] = 255 * randomBitArray[currpix];
            p.data[idx + 2] = 255 * randomBitArray[currpix];
            p.data[idx + 3] = 0xff;
        }
    }
    const f = fs.createWriteStream('random.png');
    p.pack().pipe(f);
    f.on('finish', () => {
        console.log('Saved random bitmap as ./random.png');
        process.exit();
    });
}
