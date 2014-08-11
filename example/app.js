(function (ng) {
    'use strict';
    ng.module('app', ['lrFileReader'])
        .controller('mainCtrl', ['$scope', 'lrFileReader', function mainCtrl($scope, lrFileReader) {
            $scope.$watch('file', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    lrFileReader(newValue[0])
                        .on('progress', function (event) {
                            $scope.progress = (event.loaded / event.total) * 100;
                            console.log($scope.progress);
                        })
                        .on('error', function (event) {
                            console.error(event);
                        })
                        .readAsDataURL()
                        .then(function (result) {
                            $scope.image = result;
                        });
                }
            });
        }])
        .directive('inputFile', function () {
            return{
                restrict: 'A',
                require: 'ngModel',
                link: function linkFunction(scope, element, attrs, ctrl) {


                    //view->model
                    element.bind('change', function (evt) {
                        evt = evt.originalEvent || evt;
                        scope.$apply(function () {
                            ctrl.$setViewValue(evt.target.files);
                        });
                    });

                    //model->view
                    ctrl.$render = function () {
                        //does not support two way binding
                    };
                }
            };
        });
})(angular);
