// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 
// 
// 
// 
// API KEY HERE AIzaSyBBR78swh1aZsPvzZ_cg3JgLywR3lsKJrg
 // BROWSER: AIzaSyBNoV_klGWt-Vxi118c_2EIvFXxOMQacB8
// var apiKey = 'AIzaSyBNoV_klGWt-Vxi118c_2EIvFXxOMQacB8';
var locationApp = angular.module('locationApp', ['ionic', 'ngRoute', 'ngSanitize'])

.run(function($ionicPlatform, $rootScope, $location) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

});

locationApp.config(['$routeProvider', function($routeProvider){
  $routeProvider
  .when('/', {
    controller: 'defaultController',
    templateUrl: 'partials/list.html'
  })
  .when('/details', {
    controller: 'detailsController',
    templateUrl: 'partials/details.html'
  })
  .otherwise({redirectTo: '/'});
}]);

locationApp.controller('defaultController', ['$scope', '$http', '$ionicLoading', '$rootScope', function($scope, $http, $ionicLoading, $rootScope) {
  $scope.apikey = '?apikey=d82ca383e5f086a9f6e57c14cb3804b3';
  $scope.offset=0;
  $scope.secondCall = function(stories, event) {
    console.log('called '+stories);
    $http.get(stories)
    .success(function (response){
      console.log('the success was '+response.data.results);
      $scope.stories = response.data.results;
      console.log('i am about to broadcast '+$scope.stories);
      $rootScope.$broadcast('secondCallData', $scope.stories);

    })
    .finally();
  }
  $scope.doRefresh = function() {
    $ionicLoading.show();
    $http.get('http://gateway.marvel.com/v1/public/characters?limit=10&offset=10&apikey=d82ca383e5f086a9f6e57c14cb3804b3')
    // $http.get('http://star-api.herokuapp.com/api/v1/stars/?count=2')
    .success(function (response) {
      $scope.characters = [];
      console.log(response.data.results);
      $scope.characters = response.data.results;
      $ionicLoading.hide();
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
  $scope.doRefresh();

  $scope.loadMore = function() {
    $http.get('http://gateway.marvel.com/v1/public/characters?limit=10&offset='+$scope.offset+'&apikey=d82ca383e5f086a9f6e57c14cb3804b3')
    .success(function (response){
      $scope.offset+=10;
      console.log($scope.offset);
      for (var i=0; i<response.data.results.length; i++){
        $scope.characters.push(response.data.results[i]);
  }

      $scope.$broadcast('scroll.infiniteScrollComplete');
    });
  };

  $scope.$on('$stateChangeSuccess', function() {
    $scope.loadMore();
  });
  console.log('hello');

}]);

locationApp.controller('detailsController', ['$scope', '$http', '$ionicLoading', '$rootScope', function($scope, $http, $ionicLoading, $rootScope) {
  $scope.apikey = '?apikey=d82ca383e5f086a9f6e57c14cb3804b3';
  console.log('i am in the details controller');
  

  $scope.$on('secondCallData', function(scope, stories){
    console.log('i am in secondCallData'+stories[0].characters);
    $scope.stories = stories;
    console.log('test is '+stories);
    console.log($scope.stories);
  });


  console.log('hello');

}]);


