var techResolver = require('../../lib/tech-resolver');

const ext2tech = {
    ".styl": {
        module: require('path').resolve(__dirname, 'fake-styl-tech'),
        contentType: 'text/css'
    }
};

// save original resolver
techResolver._getTech = techResolver.getTech;

// redefine
techResolver.getTech = function(extension) {
    var tech = ext2tech[extension];

    if (!tech) {
        // call original borschik-server tech-resolver
        return module.exports._getTech(extension);
    }

    return tech;
};

module.exports = techResolver;
