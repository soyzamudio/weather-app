'use strict';

var jz = angular.module('forecast', []);

jz.controller('ForecastController', ['$scope', '$http', function($scope, $http) {

  $scope.zipCode = '';
  $scope.currentWeather = {};
  $scope.days = [];

  $scope.getWeather = function() {
    $http.get('http://api.wunderground.com/api/f072e1fa016ca1ac/conditions/q/' + $scope.zipCode + '.json')
    .success(function(res) {
      $scope.currentWeather = res.current_observation;
      console.log($scope.currentWeather);
    })
    .error(function(err) {
      console.log(err);
    });

    $http.get('http://api.wunderground.com/api/f072e1fa016ca1ac/forecast10day/q/' +
              $scope.zipCode +
              '.json')
    .success(function(res) {
      $scope.days = res.forecast.simpleforecast.forecastday;
    })
    .error(function(err) {
      console.error(err);
    });
  };

  $scope.getLocation = function() {
    var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0};
    navigator.geolocation.getCurrentPosition(success, error, options);
  };

  function success(pos) {
    $http.get('http://api.wunderground.com/api/7223c528ababc07f/geolookup/q/' +
              pos.coords.latitude + ',' +
              pos.coords.longitude +
              '.json')
    .success(function(res) {
      getZip(res.location.zip);
    })
    .error(function(err) {
      console.log(err);
    });
  }

  function error(err) {
    console.log('could not find position', err);
  }

  function getZip(zip) {
    $scope.zipCode = zip;
    $scope.getWeather();
  }

}]);
