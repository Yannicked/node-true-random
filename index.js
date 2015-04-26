// We need traceur to compile the ecmascript 6 code to ecmascript 5 so node can interpret it
traceur = require('traceur');
true_random = traceur.require(__dirname+'/es6/index.js');
module.exports = true_random;