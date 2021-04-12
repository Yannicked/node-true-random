node-true-random is a true random "generator" written in ecmascript 6.
It caches random numbers from http://qrng.anu.edu.au/ for you to use.

Why ecmascript 6 you might ask? Because classes are awesome!

It's very simple to use:

```node
const { Random } = require('true-random'); //Import the library
const gen = new Random(); //Create a number generator, this function accepts a cache_size, min_cache and a debugging

//returns primise that resolves to an  integer between 0 and 1, you can pass different min and max values with integer(min, max)
gen.integer()
    .then((i) => console.log(i));

//returns a promise that resolves to an array with 10 numbers between 0 and 1, the min, max and number of integers can be passed to this function.
gen.integers(0, 1, 10)
    .then((int_array) => console.log(int_array));
```


### Example 1:

```node

//Display a random number between 1 and 7
const { Random } = require('true-random');
const gen = new Random(10, 5);

gen.integer(1, 7)
    .then((i) => console.log(i));
```

### Example 2:
```node

//Display a random array of 25 numbers between 700 and 15000
const { Random } = require('true-random');
const gen = new random.true_rand(100, 50);

gen.integers(700, 15000, 25)
    .then((int_array) => console.log(int_array));
```

TODO:
* Cleanup code
