var PATH = require('path');
var URL = require('url');

/**
 * Mapping extension-processor info
 * @type {Object}
 * @constant
 */
const ext2tech = {
    '.css': {
        module: '../processors/css',
        contentType: 'text/css; charset=utf-8'
    },
    '.js': {
        module: '../processors/js',
        contentType: 'application/x-javascript; charset=utf-8'
    }
};

function url2Extension(requestUrl) {
    var fullpath = PATH.normalize(URL.parse(requestUrl).pathname);
    return PATH.extname(fullpath);
}

/**
 * Returns tech by extension.
 * @param {String} extension
 * @returns {Object}
 */
function getTech(extension) {
    return ext2tech[extension];
}

/**
 * Resolve url to borschik tech.
 * Returns false if no tech found&
 * @param {String} requestUrl HTTP request URL.
 * @returns {Object|Boolean}
 */
function resolve(requestUrl) {
    // use module.exports to deal with extending
    var ext = module.exports.url2Extension(requestUrl);

    var tech = module.exports.getTech(ext);

    if (!tech) {
        return false;
    }

    var processor;
    try {
        processor = require(tech.module);
    } catch(e) {
        return false;
    }

    return {
        module: tech.module,
        contentType: tech.contentType,
        processor: processor
    };
}

module.exports = {
    url2Extension: url2Extension,
    resolve: resolve,
    getTech: getTech
};
