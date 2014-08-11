# lrFileReader

An Angular wrapper around the [FileReader API](http://devdocs.io/dom/filereader)

## getting started

1. bower: `bower install lrFileReader`
2. add the script lrFileReader.js to your application
3. register the module to your app ```angular.module('myApp,['lrFileReader'])```

## usage and use case

At [tropicaldev](http://tropicaldev.com/) we use it to generate a preview of the image the user intends to upload
thanks to the method readAsDataURL

you create a file reader passing a Blob or a file then any of the method of the FileReader API is exposed and will return a promise
which will resolve with the result or be rejected with the error (or in case you call abort() ).
You will also be able to register to any of the event of the API.

```javascript
function controller($scope,lrFileReader){

    //assuming $scope.file is a blob or file

    lrFileReader($scope.file)
        .on('progress',function(event){
            $scope.progress=event.loaded/event.total;
        })
        .on('load',function(event){
            console.log('finished')
        })
        .readAsDataURL()
        .then(function(result){
             $scope.previewSrc=result;
        });

}
```

see the [example](http://lorenzofox3.github.io/lrFileReade/example/index.html)




