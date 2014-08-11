(function (ng) {
    'use strict';
    ng.module('lrFileReader', [])
        .factory('lrFileReader', ['$rootScope', '$q', function lrFileReader($rootScope, $q) {

            var eventsList = ['abort', 'loadend', 'loadstart', 'progress', 'error', 'load'];

            function LrFileReader(file, rejectOnError) {
                this.file = file;
                this.rejectOnError = rejectOnError !== false;
                this.fr = new FileReader();
            }

            function readAs(name) {
                return function () {
                    var deferred = $q.defer();

                    this.on('load', function load(event) {
                        deferred.resolve(this.fr.result);
                    }.bind(this));

                    if (this.rejectOnError === true) {
                        this.on('error', function error(event) {
                            deferred.reject(this.fr.error);
                        }.bind(this));
                    }

                    this.on('abort', function abort(event) {
                        deferred.reject({message: 'aborted'});
                    });

                    this.promise = deferred.promise;


                    this.fr[name](this.file);
                    return this.promise;
                }
            }

            LrFileReader.prototype.readAsArrayBuffer = readAs('readAsArrayBuffer');
            LrFileReader.prototype.readAsBinaryString = readAs('readAsBinaryString');
            LrFileReader.prototype.readAsDataURL = readAs('readAsDataURL');
            LrFileReader.prototype.readAsText = readAs('readAsText');
            LrFileReader.prototype.abort = function () {
                this.fr.abort();
            };
            LrFileReader.prototype.on = function registerEventHandler(eventName, cb) {

                if (eventsList.indexOf(eventName) !== -1) {
                    this.fr.addEventListener(eventName, function (event) {
                        $rootScope.$apply(function () {
                            cb(event);
                        });
                    });
                } else {
                    console.log(eventName + ' is not supported by the FileReader specifications');
                }

                return this;
            };

            return function getFileReader(file) {
                return new LrFileReader(file);
            };
        }]);
})(angular);
