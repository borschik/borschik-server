describe('path-resolver:', function() {

    var expect = require('chai').expect;
    var path = require('path');

    beforeEach(function() {
        this.pathResolver = require('../lib/path-resolver');
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

    });

});
