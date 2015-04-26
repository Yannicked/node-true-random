var rand = require(__dirname+'/../index.js');
var png = require('pngjs').PNG;
var fs = require('fs');

var r = new rand.rand(1024, 100, generateRandom);
var randomArray = [];

console.log('Getting random numbers...');

function generateRandom(callback) {
	randomArray = randomArray.concat(r.cache);
	r.cache.length = 0;
	console.log('Got '+randomArray.length+' random numbers');
	if (randomArray.length == 65536) { //256x256 pixels
		genBitmap();
		return;
	}
	r._cache(generateRandom);
}

function genBitmap() {
	console.log('Generating bitmap...')
	var randomBitArray = randomArray.map(function(i) {return i%2});
	var p = new png({
		filterType: -1, 
		width: 256,
		height: 256
	});
	p.data = [];
	for (var y = 0; y < 256; y++) {
		for (var x = 0; x < 256; x++) {
			var currpix = 256*y+x;
			var idx = currpix << 2;
			p.data[idx] = 255*randomBitArray[currpix];
			p.data[idx+1] = 255*randomBitArray[currpix];
			p.data[idx+2] = 255*randomBitArray[currpix];
			p.data[idx+3] = 0xff;
		}
	}
	var f = fs.createWriteStream('random.png')
	p.pack().pipe(f);
	f.on('finish', function() {
		console.log('Saved random bitmap as ./random.png');
		process.exit();
	})
	return;
}