node-true-random is a true random "generator" written in ecmascript 6. It caches random numbers from http://qrng.anu.edu.au/ for you to use. 

It's very simple to use:

    var random = require('true-random'); //Import the library
    var gen = new random.true_rand(); //Create a number generator, this function accepts a cache_size, min_cache and a callback parameter
    var integer = gen.integer() //returns a integer between 0 and 1, you can pass diffrent min and max values with integer(min, max)
    var integer_array = gen.integers(0, 1, 10) //returns a array with 10 numbers between 0 and 1, the min, max and number of integers can be passed to this function.
    
Example 1:

    //Display a random number between 1 and 7
    var random = require('true-random');
    var gen = new random.true_rand(10, 5, function(gen) {
        console.log(gen.integer(1,7));
    });
Example 2:

    //Display a random array of 25 numbers between 700 and 15000
    var random = require('true-random');
    var gen = new random.true_rand(100, 50, function(gen) {
        console.log(gen.integers(700, 15000, 25))
    });