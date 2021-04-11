const request = require('request');
const querystring = require('querystring');

function sync(gen) {
    let iterable;

    const resume = function (err, response, body) {
        iterable.next({
            err, response, body,
        }); // resume!
    };

    iterable = gen(resume);
    iterable.next();
}

class true_random {
    constructor(cache_size = 100, min_cache = 50, callback, debug = false) {
        this.cache_size = cache_size;
        this.cache = [];
        this._cache(callback);
        this.debug = debug;
        this.min_cache = min_cache;
    }

    _debug(s) {
        if (this.debug === true) {
            console.debug(s);
        }
    }

    parse(body) {
        const data = JSON.parse(body).data.map((s) => parseInt(s, 16));
        this.cache = this.cache.concat(data);
    }

    integer(min = 0, max = 1) {
        if (this.cache.length - 1 < this.min_cache) {
            this._cache();
        } if (this.cache.length < 1) {
            return 'NeN';
        }
        const n = (this.cache[0] / 281474976710655) * (max - min) + min;
        this.cache.shift();
        return n;
    }

    integers(min = 0, max = 1, num = 1) {
        if (this.cache.length - num - 1 <= this.min_cache) {
            this._cache();
        } if (this.cache.length < num) {
            return 'NeN';
        }
        const n = this.cache.slice(0, num).map((f) => (f / 281474976710655) * (max - min) + min);
        this.cache = this.cache.slice(num, this.cache.length);
        return n;
    }

    _cache(callback) {
        //  that = this;
        this._integers(this.cache_size, callback);
    }

    _integer(callback) {
        this._integers(1, callback);
    }

    _integers(num = 1, callback = function () {}) {
        if (num > 1024 || num < 1) {
            this._debug(`Error num=${num}`);
            throw (new RangeError('Num argument is not in range {1, 1024}'));
        }
        const url = `http://qrng.anu.edu.au/API/jsonI.php?${querystring.stringify({
            length: num, type: 'hex16', size: 6,
        })}`;
        sync(function* (resume) {
            const { error, response, body } = yield request(url, resume);
            if (!error && response.statusCode === 200) {
                this.parse(body);
                callback(this);
            } else {
                throw (error);
            }
        }.bind(this));
    }
}

module.exports = {
    rand: true_random,
};
