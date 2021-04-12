const fetch = require('node-fetch');
const querystring = require('querystring');

class true_random {
    constructor(cache_size = 100, min_cache = 50, debug = false) {
        this.cache_size = cache_size;
        this.cache = [];

        this.debug = debug;
        this.min_cache = min_cache;
    }

    _debug(s) {
        if (this.debug === true) console.debug(s);
    }

    integer(min = 0, max = 1) {
        return this._cache(1)
            .then(() => (this.cache.shift() / 281474976710655) * (max - min) + min)
            .catch((e) => {
                this._debug(e);
                return NaN;
            });
    }

    integers(min = 0, max = 1, num = 1) {
        return this._cache(num)
            .then(() => this.cache.splice(0, num))
            .then((nums) => nums.map((f) => (f / 281474976710655) * (max - min) + min))
            .catch((e) => {
                this._debug(e);
                return NaN;
            });
    }

    // returns a primise
    _cache(numToGet) {
        const num = this.cache_size;
        const url = `http://qrng.anu.edu.au/API/jsonI.php?${querystring.stringify({
            length: num, type: 'hex16', size: 6,
        })}`;

        const _this = this;

        const cacheSize = this.cache.length;
        const minCache = this.min_cache;

        return new Promise((resolve, reject) => {
            if (num > 1024 || num < 1) {
                _this._debug(`Error num=${num}`);
                return reject(new RangeError('Num argument is not in range (1, 1024)'));
            }

            return resolve(cacheSize - numToGet <= minCache || cacheSize < numToGet);
        })
            .then((needsToFetch) => {
                if (!needsToFetch) return this.cache;

                return fetch(url)
                    .then((res) => res.json())
                    .then((json) => json.data.map((s) => parseInt(s, 16)))
                    .then((nums) => {
                        this.cache = this.cache.concat(nums);
                        return this.cache;
                    });
            });
    }
}

module.exports = {
    rand: true_random,
};
