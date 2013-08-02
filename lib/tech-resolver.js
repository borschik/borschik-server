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
 * @param {Request} requestUrl HTTP request URL.
 * @returns {borschik.Tech|Boolean}
 */
function resolve(requestUrl) {
    var ext = url2Extension(requestUrl);

    var tech = getTech(ext);

    if (!tech) {
        return false;
    }

    // processor is already cached
    if (tech.processor) {
        return tech;
    }

    try {
        tech.processor = require(tech.module);
    } catch(e) {
        return false;
    }

    return tech;
}

module.exports = {
    url2Extension: url2Extension,
    resolve: resolve,
    getTech: getTech
};
