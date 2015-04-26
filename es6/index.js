var request = require('request');
var querystring = require('querystring');
/*var gen = require('random-seed');*/

//var clients = 0;

function sync(gen) {
	var iterable, resume;
 
	resume = function(err, response, body) {
		iterable.next({err, response, body}); // resume!  
	};
 
	iterable = gen(resume);
	iterable.next();
}
/*
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
		//var that = this;
		sync(function* (resume) {
			var error, response, body = yield request(error, url, resume);
			if (!error && response.statusCode == 200) {
				setTimeout(() => {
					this.remove(id);
					this.queue_handler();
				}, 10);
				this.reqqueue[id][1](body);
			}
		});
		request(url, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				setTimeout(() => {
					this.remove(id);
					this.queue_handler();
				}, 10);
				this.reqqueue[id][1](body);
			} else if (error) {
				throw (error);
			}
		});
	}
}
*/
class true_random {
	constructor(cache_size = 100, min_cache = 50, callback, debug = false) {
		this.cache_size = cache_size;
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
	parse(body) {
		var data = JSON.parse(body).data.map(s => parseInt(s, 16));
		this.cache = this.cache.concat(data);
	}
	integer(min = 0, max = 1) {
		if (this.cache.length-1<this.min_cache) {
			this._cache();
		} if (this.cache.length < 1) {
			return 'NeN';
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
	_cache(callback) {
		//var that = this;
		this._integers(this.cache_size, callback);
	}
	_integer(callback) {
		this._integers(1, callback);
	}
	_integers(num = 1, callback = function() {}) {
		if (num > 1024 || num < 1) {
			this._debug('Error num='+num);
			throw (new RangeError('Num argument is not in range {1, 1024}'));
		}
		var url = "http://qrng.anu.edu.au/API/jsonI.php?"+querystring.stringify({length: num, type: 'hex16', size: 6});
		sync(function* (resume) {
			let {error, response, body} = yield request(url, resume);
			if (!error && response.statusCode == 200) {
				this.parse(body);
				callback(this);
			} else {
				throw (error)
			}
		}.bind(this));
	}
}

/*var random = function(callback) {
	var r = new true_random(5, false, function() {
		callback(new gen(r.integer));
	});
}*/

module.exports = {rand: true_random};
