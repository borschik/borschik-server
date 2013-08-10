/**
 * Creates HTTP server.
 * "localhost" is hardcoded because this server is not for produciton use
 * and should be placed behind the real web-server (apache, lighttpd, nginx, etc).
 * @param {Object} options Options.
 * @param {Number} options.port Port to listen.
 * @param {Function} [options.techResolver] Tech resolver.
 * @param {Function} [options.pathResolver] Path resolver.
 */
module.exports = function(options) {
    options = options || {};

    if (typeof options.port !== 'number') {
        throw 'options.port is not a number';
    }

    var techResolver = typeof options.techResolver === 'function' ? options.techResolver : require('..').techResolver;
    var pathResolver = typeof options.pathResolver === 'function' ? options.pathResolver : require('..').pathResolver;

    require('http').createServer(function (request, response) {
        response.setHeader('X-Powered-By', 'borschik-server');

        var tech = techResolver.resolve(request.url);

        if (tech === false) {
            response.setHeader('Content-Type', 'text/plain');
            response.statusCode = 501;
            response.end('Not implemented.');
            return;
        }

        pathResolver.resolve(request.url).then(
            function(msg) {
                response.statusCode = 200;

                if (msg.shouldProcess) {
                    // returns file with borschik

                    // clear .borschik config cache before each request
                    require('borschik/lib/freeze').clearConfigCache();

                    var result;
                    try {
                        result = tech.processor.process(msg.path);
                        response.setHeader('Content-type', tech.contentType);
                        response.statusCode = 200;
                        response.write(result);

                    } catch(e) {
                        response.setHeader('Content-Type', 'text/plain');
                        response.statusCode = 500;
                        response.write(e.toString());
                    }

                    response.end();

                } else {
                    // returns file as is
                    response.setHeader('Content-type', tech.contentType);
                    var stream = require('fs').createReadStream(msg.path);
                    stream
                        .on('end', function() {
                            response.end();
                        })
                        .pipe(response);
                }
            },
            function(e) {
                response.setHeader('Content-Type', 'text/plain');

                var responseText = [
                    'Request path: ' + e.path,
                    'Code: ' + e.code
                ];

                // internal error
                if (e.error) {
                    response.statusCode = 500;
                    responseText.push('Error: ' + e.error.toString());

                } else {
                    response.statusCode = 404;
                }

                response.end(responseText.join('\n') + '\n');
            }
        );

    }).listen(options.port, 'localhost');
};
