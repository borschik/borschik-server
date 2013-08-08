describe('path-resolver:', function() {

    var expect = require('chai').expect;
    var path = require('path');

    beforeEach(function() {
        var pathResolverPath = path.resolve(__dirname, '../lib/path-resolver.js');
        // clear path resolver cache
        delete require.cache[pathResolverPath];

        this.pathResolver = require(pathResolverPath);
    });

    afterEach(function() {
        delete this.pathResolver;
    });

    describe('url2File: ', function() {

        it('should return "file.js" for "_file.js"', function() {
            expect(this.pathResolver.url2File('_file.js')).to.be.equal('file.js');
        });

        it('should return "path/file.js" for "path/_file.js"', function() {
            expect(this.pathResolver.url2File('path/_file.js')).to.be.equal('path/file.js');
        });

        it('should return "path/file.min.js" for "path/file.min.js"', function() {
            expect(this.pathResolver.url2File('path/file.min.js')).to.be.equal('path/file.min.js');
        });

    });

    describe('fileExists: ', function() {

        it('should resolve if file exists', function(done) {
            this.pathResolver
                .fileExists(path.resolve(__dirname, 'test.path-resolver.js'))
                .then(function() {
                    done();
                }, function(msg) {
                    done(msg);
                });
        });

        it('should reject with code NOT_EXISTS if file doesn\'t exist', function(done) {
            this.pathResolver
                .fileExists(path.resolve(__dirname, 'test.path-resolver.js1'))
                .then(function(msg) {
                    done(msg);
                }, function(msg) {
                    try {
                        expect(msg.code).to.be.equal('NOT_EXISTS');
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
        });

        it('should reject with code NOT_A_FILE if path is dir', function(done) {
            this.pathResolver
                .fileExists(__dirname)
                .then(function(msg) {
                    done(msg);
                }, function(msg) {
                    try {
                        expect(msg.code).to.be.equal('NOT_A_FILE');
                        done();
                    } catch(e) {
                        done(e);
                    }

                });
        });

    });

    describe('resolve: ', function() {

        it('should resolve with shouldProcess === false if file exists', function(done) {
            this.pathResolver
                .resolve(path.resolve(__dirname, 'test.path-resolver.js'))
                .then(function(msg) {
                    try {
                        expect(msg.shouldProcess).to.be.equal(false);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, function(msg) {
                    done(msg);
                });
        });

        it('should resolve with shouldProcess === true for _file.js', function(done) {
            this.pathResolver
                .resolve(path.resolve(__dirname, '_test.path-resolver.js'))
                .then(function(msg) {
                    try {
                        expect(msg.shouldProcess).to.be.equal(true);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, function(msg) {
                    done(msg);
                });
        });

        it('should reject for _file.js if file.js doens\'t exists', function(done) {
            this.pathResolver
                .resolve(path.resolve(__dirname, '_test.path-resolver.js1'))
                .then(function(msg) {
                    done(msg);

                }, function(msg) {
                    try {
                        expect(msg.code).to.be.equal('NOT_EXISTS');
                        done();
                    } catch(e) {
                        done(e);
                    }
                });
        });

    });

});
