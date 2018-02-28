'use strict';

angular.module('exporta.bikes', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/motos', {
    templateUrl: 'app/bikes/bikes.html',
    controller: 'BikesCtrl',
    controllerAs : 'bikesCtrl'
  })
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/motos/:make', {
    templateUrl: 'app/bikes/bikes.html',
    controller: 'BikesCtrl',
    controllerAs : 'bikesCtrl'
  })
}])

.controller('BikesCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var bikesCtrl = this;
	bikesCtrl.noBikes = false;

	// Meta tags
	$rootScope.robot = mBikesRobot;
	$rootScope.pageTitle = mBikesTitle;
	$rootScope.pageDescription = mBikesPageDescription;
	$rootScope.ogPageDescription = mBikesOgPageDescription;
	$rootScope.ogPageImage = mBikesOgPageImage;
	$rootScope.ogPageTitle = mBikesOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mBikesTwitterDescription;
	$rootScope.twitterImage = mBikesTwitterImage;

	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){

   		// if (!bikesCtrl.dontClearUrl) {
	   	// 	// Clear url query parameters
	   	// 	$location.url($location.path());
	   	// 	bikesCtrl.dontClearUrl = false; 
   		// };

	});

	// Makes
	bikesCtrl.makes = [
		'ducati',
		'harley-davidson'
	];

	// Types
	bikesCtrl.types = [
		'racing',
		'choper'
	];

	// Check if there is a maker in the url
	if ($routeParams.make) {
		bikesCtrl.make = $routeParams.make;
		bikesCtrl.filtered = true;
	};

	// Check if there is a type in the url
	if ($routeParams.ty) {
		bikesCtrl.ty = $routeParams.ty;
		bikesCtrl.filtered = true;
	};

	// Check if there is a condition in the url
	if ($routeParams.con) {
		bikesCtrl.con = $routeParams.con;
		bikesCtrl.filtered = true;
	};

	CurrentData.getBikes(bikesCtrl.make, bikesCtrl.ty, bikesCtrl.con).then(function(response){
		bikesCtrl.bikes = response.data.results;
		bikesCtrl.checkForResults();
	});

	this.changeMakes = function(){
		if (!bikesCtrl.make) {
			$location.url('/motos');
		}else{
			$location.url('/motos/'+bikesCtrl.make);
		};
	};

	this.changeTypes = function(){
		if (!bikesCtrl.ty) {	
			CurrentData.getBikes(bikesCtrl.make, bikesCtrl.ty, bikesCtrl.con).then(function(response){
				bikesCtrl.bikes = response.data.results;
				bikesCtrl.checkForResults();
			});
		}else{
			CurrentData.getBikes(bikesCtrl.make, bikesCtrl.ty, bikesCtrl.con).then(function(response){
				bikesCtrl.bikes = response.data.results;
				bikesCtrl.filtered = true;
				bikesCtrl.checkForResults();
			});
		};
	};

	// bikesCtrl.clearFilters = function(){
	// 	bikesCtrl.filtered = false;
	// 	$location.url('/motos');
	// };

	// console.log($location.search('hola'));
	// 	// console.log($location.url().replace($location.path(), ''));
	this.clearFilters = function(){
		bikesCtrl.filtered = false;
		if ($location.path() == '/motos') {
			$route.reload();
		}else{
			$location.url('/motos');	
		};
	};

	this.checkForResults = function(){
		if (bikesCtrl.bikes.length == 0) {
			bikesCtrl.noBikes = true;
		}else{
			bikesCtrl.noBikes = false;
		};
	};


}]);