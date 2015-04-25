var request = require('request');
var querystring = require('querystring');
/*var gen = require('random-seed');*/

var clients = 0;

class queue {
	constructor() {
		this.reqqueue = {};
		this.queue_handler();
	}
	add(req, callback) {
		var id = Math.max.apply(Math, Object.keys(this.reqqueue))+1 | 0;
		this.reqqueue[id] = [req, callback];
		return id;
	}
	remove(id) {
		delete this.reqqueue[id];
	}
	queue_handler() {
		if (Object.keys(this.reqqueue).length <= 0) {
			setTimeout(function (t){t.queue_handler()}, 100, this);
			return;
		}
		var id = Math.min.apply(Math, Object.keys(this.reqqueue));
		var url = this.reqqueue[id][0];
		var that = this;
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				setTimeout(function(t) {
					that.remove(id);
					that.queue_handler();
				}, 10);
				that.reqqueue[id][1](body);
			} else if (error) {
				throw (error);
			}
		});
	}
}

class true_random {
	constructor(cache_size = 100, min_cache = 50, callback = function() {}, debug = false) {
		this.cache_size = cache_size;
		this.client = clients++;
		this.queue = new queue();
		this.cache = [];
		this._cache(callback);
		this.debug = debug;
		this.min_cache = min_cache;
	}
	_debug(s) {
		if (this.debug == true) {
			console.debug(s);
		}
	}
	parser(callback) {
		return function(data) {
			callback(JSON.parse(data).data.map(function(a) {
				return parseInt(a, 16);
			}));
		};
	}
	integer(min = 0, max = 1) {
		if (this.cache.length-1<this.min_cache) {
			this._cache();
		} if (this.cache.length < 1) {
			return 'Nen';
		}
		var n = (this.cache[0]/281474976710655)*(max-min)+min;
		this.cache.shift();
		return n;
	}
	integers(min = 0, max = 1, num = 1) {
		if (this.cache.length-num-1<=this.min_cache) {
			this._cache();
		} if (this.cache.length < num) {
			return 'NeN';
		}
		var n = this.cache.slice(0, num).map(function(f) {
			return (f/281474976710655)*(max-min)+min
		});
		this.cache = this.cache.slice(num, this.cache.length);
		return n;
	}
	_cache(callback = function() {}) {
		var that = this;
		this._integers(function(ints) {
			that.cache = that.cache.concat(ints.map(function(n) {return parseInt(n)}));
			that._debug('Done cacheing');
			callback(that);
		}, this.cache_size)
	}
	_integer(callback) {
		this._integers(callback, 1);
	}
	_integers(callback, num = 1) {
		if (num > 1024 || num < 1) {
			this._debug('Error num='+num);
			throw (new RangeError('Num argument is not in range {1, 1024}'));
		}
		var url = "http://qrng.anu.edu.au/API/jsonI.php?"+querystring.stringify({length: num, type: 'hex16', size: 6});
		this.queue.add(url, this.parser(callback));
	}
}

/*var random = function(callback) {
	var r = new true_random(5, false, function() {
		callback(new gen(r.integer));
	});
}*/

module.exports = {rand: true_random};
