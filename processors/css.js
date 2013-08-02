exports.process = function(path) {
    var Tech = require('borschik/lib/techs/css').Tech;

    return new Tech({
        comments: true
    })
        .createFile(path, 'include')
        .process(path);
};
