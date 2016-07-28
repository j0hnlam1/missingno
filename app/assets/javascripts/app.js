var app = angular.module('pokeApp', ['ngRoute']);
app.config(function($routeProvider, $httpProvider) {
    $routeProvider
        .when("/show", {
            templateUrl: "/partials/show.html.erb",
            controller: "pokeController"
        })
        .when("/new", {
            templateUrl: "/partials/new.html.erb",
            controller: "pokeController"
        })
        .when("/:id/edit",{
            templateUrl: "/partials/edit.html.erb",
            controller: "pokeController"
        })
    // we are using jquery to get the value of the token and setting in as a default header
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
});

app.factory("pokeFactory", function($http){
    var factory = {};
    factory.index = function(callback){
        $http.get("/poke").success(function(output){
            callback(output);
    })
 }
    // create function that makes a post request to the '/poke' route
    // notice that we have a callback that passes the information that we get back from the rails pokeController to the angular pokeController
    factory.create = function(pokeInfo, callback){
        $http.post("/poke", pokeInfo).success(function(output){
            callback(output);
        })
    }

    factory.edit = function(id,callback){
        $http.get("/poke/"+id+"/edit").success(function(output){
            callback(output);
        })
    }

    // factory.update = function(id,callback){
    //     $http.patch("/poke/"+id+"/edit").then(function(output){
    //         callback(output);
    //     })
    // }

    factory.delete = function(id, callback){
        $http.delete("/poke/"+id).success(function(output){
            callback(output);
        })
    }
    return factory;
})

app.controller("pokeController", function($scope, pokeFactory, $location){
    pokeFactory.index(function(json){
        $scope.poke = json;
    })
    // calling the create method from our factory when the button is cliked and updating the $scope.poke information with the json data that we get back from the rails pokeController
    $scope.createPoke = function(){
        pokeFactory.create($scope.newPoke, function(json){
            $scope.poke = json;
            $scope.newPoke = {};
        });
    }

    $scope.editPoke = function(pokeId){
        pokeFactory.edit(pokeId,function(json){
            $scope.poke = json;
            $location.url('/edit');   
        })
    }

    $scope.deletePoke = function(pokeId){
        pokeFactory.delete(pokeId, function(json){
            $scope.poke = json;
        })
    }


})