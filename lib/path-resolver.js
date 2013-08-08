var PATH = require('path');
var URL = require('url');

var vow = require('vow');
var vowFS = require('vow-fs');

/**
 * @constant
 * @type {RegExp}
 */
const RE_PREFIX_UNDESCORE = /^_/;

/**
 * Resolve requestUrl to real file.
 * @description
 * Check if file exists, if not try to resolve it with url2File and check again.
 * @param {String} requestUrl HTTP request URL.
 * @returns {vow.Promise}
 */
function resolve(requestUrl) {
    var fullpath = PATH.normalize(URL.parse(requestUrl).pathname);

    var promise = vow.promise();

    module.exports.fileExists(fullpath).then(
        // path exists
        function(msg) {
            msg.shouldProcess = false;
            // path is file and we return it as is
            promise.fulfill(msg);

        },

        // path doesn't exist
        function(msg) {
            if (msg.code !== 'NOT_EXISTS') {
                promise.reject(msg);
            }

            module.exports.fileExists(module.exports.url2File(fullpath)).then(
                // new path exists
                function(msg) {
                    // new path is file and we set shouldProcess flag to true
                    msg.shouldProcess = true;
                    promise.fulfill(msg);
                },

                // new path doesn't exists
                function(msg) {
                    promise.reject(msg);
                }
            );
        }
    );

    return promise;
}

/**
 * Check if file exists.
 * @param {String} fullpath Absolute path to file.
 * @returns {vow.Promise}
 */
function fileExists(fullpath) {
    var promise = vow.promise();

    var msg = {
        path: fullpath
    };

    vowFS.stat(fullpath)
        .then(
            function(stat) {
                // path exists
                if (stat.isFile()) {
                    // path is file
                    msg.stat = stat;
                    promise.fulfill(msg);

                } else {
                    // path is not file (may be directory) and this is error
                    msg.code = 'NOT_A_FILE';
                    promise.reject(msg);
                }

            },
            function() {
                // path doesn't exist
                msg.code = 'NOT_EXISTS';
                promise.reject(msg);
            }
        )
        .fail(function(e) {
            msg.code = 'FS_STAT_ERROR';
            msg.error = e;

            promise.reject(msg);
        });

    return promise;
}

/**
 * Returns real path to file.
 * @description
 * For example, you want response http://host.com/file.js as it,
 * but fake url http://host.com/_file.js should be processed by borschik.
 * In this function you should remove prefix "_" and return /var/www/host.com/file.js
 * @param {String} requestUrl HTTP request URL.
 * @returns {String}
 */
function url2File(requestUrl) {
    // try to remove prefix "_" to get real file
    // /var/www/host.com/_file.js -> /var/www/host.com/file.js
    var dirname = PATH.dirname(requestUrl);
    var filename = PATH.basename(requestUrl);

    return PATH.join(dirname, filename.replace(RE_PREFIX_UNDESCORE, ''));
}

module.exports = {
    url2File: url2File,
    resolve: resolve,
    fileExists: fileExists
};
