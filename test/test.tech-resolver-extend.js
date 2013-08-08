describe('tech-resolver extending:', function() {

    var expect = require('chai').expect;

    beforeEach(function() {
        this.techResolver = require('./mock/custom-tech-resolver');
    });

    afterEach(function() {
        delete this.techResolver;
    });

    describe('getTech:', function() {

        it('should return ".css" tech decl', function() {
            expect(this.techResolver.getTech('.css')).to.eql({
                module: '../processors/css',
                contentType: 'text/css; charset=utf-8'
            });
        });

        it('should return ".js" tech decl', function() {
            expect(this.techResolver.getTech('.js')).to.eql({
                module: '../processors/js',
                contentType: 'application/x-javascript; charset=utf-8'
            });
        });

        it('should return ".styl" tech decl', function() {
            expect(this.techResolver.getTech('.styl')).to.eql({
                module: require('path').resolve(__dirname, 'mock/fake-styl-tech'),
                contentType: 'text/css'
            });
        });

        it('should return undefined for unknown tech', function() {
            expect(this.techResolver.getTech('.unknown')).to.be.undefined;
        });

    });

});
