// We need traceur to compile the ecmascript 6 code to ecmascript 5 so node can interpret it
const traceur = require('traceur');

const true_random = traceur.require('./es6/index.js');

module.exports = true_random;
