describe('FileReader module', function () {

    var blob;
    var reader;
    var scope;

    beforeEach(module('lrFileReader'));

    beforeEach(inject(function (lrFileReader, $rootScope) {
        reader = lrFileReader;
        scope = $rootScope;
        blob = new Blob(['some file content'], {type: 'text/html'});
    }));

    it('should return the content as a resolved promise', function () {
        var fileReader = reader(blob);
        var fileContent;
        var done = false;

        fileReader.readAsText().then(function (result) {
            fileContent = result;
            done = true;
        });

        waitsFor(function () {
            return done;
        });

        runs(function () {
            expect(fileContent).toEqual('some file content');
        });
    });


    it('should register event handler', function () {
        var fileReader = reader(blob);
        var fileContent;
        var done = false;
        var mock = {
            load: function load() {

            }
        };

        spyOn(mock, 'load').andCallThrough();

        fileReader.on('load', mock.load);

        fileReader.readAsText().then(function (result) {
            fileContent = result;
            done = true;
        });

        waitsFor(function () {
            return done;
        });

        runs(function () {
            expect(fileContent).toEqual('some file content');
            expect(mock.load).toHaveBeenCalled();
        });
    });

    it('should reject on abort', function () {
        var fileReader = reader(blob);
        var output;
        var done = false;

        fileReader.readAsText().then(function () {
            //do nothing
        }, function (result) {
            output = result;
            done = true;
        });

        fileReader.abort();

        waitsFor(function () {
            return done;
        });

        runs(function () {
            expect(output.name).toEqual('AbortError');
        });
    });
});
