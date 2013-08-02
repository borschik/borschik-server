exports.process = function(path) {
    var Tech = require('borschik/lib/techs/js').Tech;

    return new Tech({
        comments: true
    })
        .createFile(path, 'include')
        .process(path);
};
