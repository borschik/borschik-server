var pathResolver = require('../../lib/path-resolver');
var PATH = require('path');

const RE_SUFFIX_MIN = /\.min(\.\w+)$/;

// redefine
// file.js - normal
// file.min.js - processed with borschik
pathResolver.url2File = function(requestUrl) {
    var dirname = PATH.dirname(requestUrl);
    var filename = PATH.basename(requestUrl);

    // remove .min from file
    return PATH.join(dirname, filename.replace(RE_SUFFIX_MIN, '$1'));
};

module.exports = pathResolver;
