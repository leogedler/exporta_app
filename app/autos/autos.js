'use strict';

angular.module('exporta.autos', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/automoviles', {
    templateUrl: 'app/autos/autos.html',
    controller: 'AutosCtrl',
    controllerAs : 'autosCtrl'
  })
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/automoviles/:make', {
    templateUrl: 'app/autos/autos.html',
    controller: 'AutosCtrl',
    controllerAs : 'autosCtrl'
  })
}])

.controller('AutosCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var autosCtrl = this;
	autosCtrl.noAutos = false;

	// Meta tags
	$rootScope.robot = mAutosRobot;
	$rootScope.pageTitle = mAutosTitle;
	$rootScope.pageDescription = mAutosPageDescription;
	$rootScope.ogPageDescription = mAutosOgPageDescription;
	$rootScope.ogPageImage = mAutosOgPageImage;
	$rootScope.ogPageTitle = mAutosOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mAutosTwitterDescription;
	$rootScope.twitterImage = mAutosTwitterImage;

	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){

   		// if (!autosCtrl.dontClearUrl) {
	   	// 	// Clear url query parameters
	   	// 	$location.url($location.path());
	   	// 	autosCtrl.dontClearUrl = false; 
   		// };

	});

	// Makes
	autosCtrl.makes = [
		'audi',
		'ford',
		'toyota'
	];

	// Types
	autosCtrl.types = [
		'sedan',
		'coupe'
	];

	// Check if there is a maker in the url
	if ($routeParams.make) {
		autosCtrl.make = $routeParams.make;
		autosCtrl.filtered = true;
	};

	// Check if there is a type in the url
	if ($routeParams.ty) {
		autosCtrl.ty = $routeParams.ty;
		autosCtrl.filtered = true;
	};

	// Check if there is a condition in the url
	if ($routeParams.con) {
		autosCtrl.con = $routeParams.con;
		autosCtrl.filtered = true;
	};

	CurrentData.getAutos(autosCtrl.make, autosCtrl.ty, autosCtrl.con).then(function(response){
		autosCtrl.autos = response.data.results;
		autosCtrl.checkForResults();

	});

	this.changeMakes = function(){
		if (!autosCtrl.make) {
			$location.url('/automoviles');
		}else{
			$location.url('/automoviles/'+autosCtrl.make);
		};
	};

	this.changeTypes = function(){
		if (!autosCtrl.ty) {	
			CurrentData.getAutos(autosCtrl.make, autosCtrl.ty, autosCtrl.con).then(function(response){
				autosCtrl.autos = response.data.results;
				autosCtrl.checkForResults();
			});
		}else{
			CurrentData.getAutos(autosCtrl.make, autosCtrl.ty, autosCtrl.con).then(function(response){
				autosCtrl.autos = response.data.results;
				autosCtrl.filtered = true;
				autosCtrl.checkForResults();
			});
		};
	};

	// autosCtrl.clearFilters = function(){
	// 	autosCtrl.filtered = false;
	// 	$location.url('/automoviles');
	// };

	// console.log($location.search('hola'));
	// 	// console.log($location.url().replace($location.path(), ''));
	this.clearFilters = function(){
		autosCtrl.filtered = false;
		if ($location.path() == '/automoviles') {
			$route.reload();
		}else{
			$location.url('/automoviles');	
		};
	};

	this.checkForResults = function(){
		if (autosCtrl.autos.length == 0) {
			autosCtrl.noAutos = true;
		}else{
			autosCtrl.noAutos = false;
		};
	};



}]);