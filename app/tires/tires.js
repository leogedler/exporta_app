'use strict';

angular.module('mokars.tires', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cauchos', {
    templateUrl: 'app/tires/tires.html',
    controller: 'TiresCtrl',
    controllerAs : 'tiresCtrl'
  })
}])

.controller('TiresCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var tiresCtrl = this;
	tiresCtrl.noTires = false;

	// Meta tags
	$rootScope.robot = mTiresRobot;
	$rootScope.pageTitle = mTiresTitle;
	$rootScope.pageDescription = mTiresPageDescription;
	$rootScope.ogPageDescription = mTiresOgPageDescription;
	$rootScope.ogPageImage = mTiresOgPageImage;
	$rootScope.ogPageTitle = mTiresOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mTiresTwitterDescription;
	$rootScope.twitterImage = mTiresTwitterImage;

	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){

   		// if (!tiresCtrl.dontClearUrl) {
	   	// 	// Clear url query parameters
	   	// 	$location.url($location.path());
	   	// 	tiresCtrl.dontClearUrl = false; 
   		// };

	});

	// Makes
	tiresCtrl.makes = [
		'austone',
		'kumho'
	];

	// Diameter
	tiresCtrl.diameters = [
		13,14,15,16,17
	];

	// Width
	tiresCtrl.widths = [
		165,175,185,195,205,215,225,235
	];

	// Heights
	tiresCtrl.heights = [
		40,45,50,55,60,65,70,75
	];

	// Check if there is a maker in the url
	if ($routeParams.make) {
		tiresCtrl.make = $routeParams.make;
		tiresCtrl.filtered = true;
	};

	// Check if there is a diameter in the url
	if ($routeParams.dia) {
		tiresCtrl.dia = $routeParams.dia;
		tiresCtrl.filtered = true;
	};

	// Check if there is a width in the url
	if ($routeParams.width) {
		tiresCtrl.width = $routeParams.width;
		tiresCtrl.filtered = true;
	};

	// Check if there is a height in the url
	if ($routeParams.height) {
		tiresCtrl.height = $routeParams.height;
		tiresCtrl.filtered = true;
	};

	CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
		tiresCtrl.tires = response.data.results;
		tiresCtrl.checkForResults();

	});

	this.changeMakes = function(){
		if (!tiresCtrl.make) {	
			CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
				tiresCtrl.tires = response.data.results;
				tiresCtrl.checkForResults();

				if (!tiresCtrl.dia && !tiresCtrl.width && !tiresCtrl.height) {
					tiresCtrl.filtered = false;
				};

			});
		}else{
			CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
				tiresCtrl.tires = response.data.results;
				tiresCtrl.filtered = true;
				tiresCtrl.checkForResults();
			});
		};
	};

	this.changeDiameter = function(){
		if (!tiresCtrl.dia) {	
			CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
				tiresCtrl.tires = response.data.results;
				tiresCtrl.checkForResults();

				if (!tiresCtrl.make && !tiresCtrl.width && !tiresCtrl.height) {
					tiresCtrl.filtered = false;
				};

			});
		}else{
			CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
				tiresCtrl.tires = response.data.results;
				tiresCtrl.filtered = true;
				tiresCtrl.checkForResults();

			});
		};
	};

	this.changeWidth = function(){
		if (!tiresCtrl.width) {	
			CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
				tiresCtrl.tires = response.data.results;
				tiresCtrl.checkForResults();

				if (!tiresCtrl.make && !tiresCtrl.dia && !tiresCtrl.height) {
					tiresCtrl.filtered = false;
				};

			});
		}else{
			CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
				tiresCtrl.tires = response.data.results;
				tiresCtrl.filtered = true;
				tiresCtrl.checkForResults();
			});
		};
	};

	this.changeHeight = function(){
		if (!tiresCtrl.height) {	
			CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
				tiresCtrl.tires = response.data.results;
				tiresCtrl.checkForResults();
				if (!tiresCtrl.make && !tiresCtrl.width && !tiresCtrl.dia) {
					tiresCtrl.filtered = false;
				};

			});
		}else{
			CurrentData.getTires(tiresCtrl.make, tiresCtrl.dia, tiresCtrl.width, tiresCtrl.height).then(function(response){
				tiresCtrl.tires = response.data.results;
				tiresCtrl.filtered = true;
				tiresCtrl.checkForResults();
			});
		};
	};

	// tiresCtrl.clearFilters = function(){
	// 	tiresCtrl.filtered = false;
	// 	$location.url('/cauchos');
	// };

	// console.log($location.search('hola'));
	// 	// console.log($location.url().replace($location.path(), ''));
	this.clearFilters = function(){
		tiresCtrl.filtered = false;
		if ($location.path() == '/cauchos') {
			$route.reload();
		}else{
			$location.url('/cauchos');	
		};
	};

	this.checkForResults = function(){
		if (tiresCtrl.tires.length == 0) {
			tiresCtrl.noTires = true;
		}else{
			tiresCtrl.noTires = false;
		};
	};


}]);