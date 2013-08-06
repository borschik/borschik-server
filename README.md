# borschik-server
HTTP server to processes JS and CSS files with [borschik](https://github.com/bem/borschik) on demand.

This server is **for development use only**.

## Default behavour
1. If file exists, response as is
2. Process files with `_` prefix only (can be redefined in `path-resolver`)
3. Minimize is disabled
4. Freeze is disabled

Some examples:
 1. You request is `http://example.com/js/file.js`. `file.js` exists, `borschik-server` reads this file
and writes to output as is.
 2. You request is `http://example.com/js/_file.js`. `file.js` doesn't exist, `borschik-server` removes `_` prefix,
reads file `file.js` and processes it with `borschik`.

## How to extend with new technologies
You can create you own server with this code
```js
require('borschik-server').server({
    port: 8055,
    techResolver: require('../lib/tech-resolver')
});
```

This code references to you own tech-resolver
```js
const ext2tech = {
    '.styl': {
        module: require('path').resolve(__dirname, '../processors/my-styl-processor'),
        contentType: 'text/css; charset=utf-8'
    }
};

var borschikServerTechResolver = require('borschik-server').techResolver;

// save techResolver interface
exports = borschikServerTechResolver;

// redefine getTech method
exports.getTech = function(extension) {
    var tech = ext2tech[extension];

    // go to borschik-server techs
    if (!tech) {
        return borschikServerTechResolver.getTech(extension);
    }

    return tech
};
```

You can redefine pathResolver as well.

## Configuration
You should setup your webserver (apache, lighttpd, nginx) to proxy http requests for static files to borschik-server.

Example nginx configuration:
```
location ~* "\.(css|js)$" {
    # proxy all requests for css/js to borschik-server
    # use $uri (not $request_uri) to deal with rewrite
    proxy_pass http://127.0.0.1:8055$document_root$uri;
}
```
