# borschik-server
HTTP server to processes JS and CSS files with borschik on demand.

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
You should proxy http request for static files to borschik-server

Example nginx configuration:
```
location ~* "\.(css|js)$" {
    # proxy all requests for css/js to borschik-server
    proxy_pass http://127.0.0.1:8055$document_root$request_uri;
}
```
