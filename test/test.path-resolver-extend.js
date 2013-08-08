describe('path-resolver extending:', function() {

    var expect = require('chai').expect;
    var path = require('path');

    beforeEach(function() {
        var pathResolverPath = path.resolve(__dirname, '../lib/path-resolver.js');
        // clear path resolver cache
        delete require.cache[pathResolverPath];

        this.pathResolver = require('./mock/custom-path-resolver');
    });

    afterEach(function() {
        delete this.pathResolver;
    });

    describe('getTech:', function() {

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
                })
                .fail(function(e) {
                    done(e);
                });
        });

        it('should resolve with shouldProcess === true for file.min.js', function(done) {
            this.pathResolver
                .resolve(path.resolve(__dirname, 'test.path-resolver.min.js'))
                .then(function(msg) {
                    try {
                        expect(msg.shouldProcess).to.be.equal(true);
                        done();
                    } catch(e) {
                        done(e);
                    }
                }, function(msg) {
                    done(msg);
                })
                .fail(function(e) {
                    done(e);
                });
        });

        it('should reject for _file.js if file.js doens\'t exists', function(done) {
            this.pathResolver
                .resolve(path.resolve(__dirname, 'test.path-resolver1.min.js'))
                .then(function(msg) {
                    done(msg);
                }, function(msg) {
                    try {
                        expect(msg.code).to.be.equal('NOT_EXISTS');
                        done();
                    } catch(e) {
                        done(e);
                    }
                })
                .fail(function(e) {
                    done(e);
                });
        });

    });

});
