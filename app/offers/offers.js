'use strict';

angular.module('exporta.offers', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/ofertas', {
    templateUrl: 'app/offers/offers.html',
    controller: 'OffersCtrl',
    controllerAs : 'offersCtrl'
  })
}])


.controller('OffersCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var offersCtrl = this;

	// Meta tags
	$rootScope.robot = mOffersRobot;
	$rootScope.pageTitle = mOffersTitle;
	$rootScope.pageDescription = mMainPageDescription;
	$rootScope.ogPageDescription = mMainOgPageDescription;
	$rootScope.ogPageImage = mMainOgPageImage;
	$rootScope.ogPageTitle = mMainOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mMainTwitterDescription;
	$rootScope.twitterImage = mMainTwitterImage;


	// Search categories
	offersCtrl.searchCategories = [
		'Automóviles',
		'Motos',
		'Cauchos'
	];


			CurrentData.getOffers('All').then(function(response){
			offersCtrl.offersResults = response.data.result;
			offersCtrl.noSearch = false;

			if (offersCtrl.offersResults.length == 0) {
				offersCtrl.noSearchResults = true;
			}else{
				offersCtrl.noSearchResults = false;
			};


		});


	// Check search parameters
	if ($routeParams.search) {
		offersCtrl.searchWords = $routeParams.search;

		// Hashtags match
		// var res = str.match(/\B\#\w\w+\b/g);

		// var words = offersCtrl.searchWords.split(/[ ,]+/);
		// words = words.map(function(w) { return w.toLowerCase()});

		CurrentData.getOffers('All').then(function(response){
			offersCtrl.offersResults = response.data.result;
			offersCtrl.noSearch = false;

			if (offersCtrl.searchResults.length == 0) {
				offersCtrl.noSearchResults = true;
			}else{
				offersCtrl.noSearchResults = false;
			};


		});

	}else{
		offersCtrl.noSearch = true;
	};


	this.search = function(){

		$('#search-input-header').blur()	
		offersCtrl.noSearchResults = false;

		$location.url('/busqueda');

		console.log(offersCtrl.searchWords);

		// var words = offersCtrl.searchWords.split(/[ ,]+/);
		// words = words.map(function(w) { return w.toLowerCase()});

		CurrentData.getOffers('All').then(function(response){
			offersCtrl.offersResults = response.data.result;

			if (offersCtrl.offersResults.length == 0) {
				offersCtrl.noSearchResults = true;
			};


		});

	};


	this.changeSearchCategories = function(){
		offersCtrl.noSearchResults = false;

		var category;

		if (offersCtrl.searchCategory == 'Automóviles') {
			category = 'Autos';
		}else if (offersCtrl.searchCategory == 'Motos') {
			category = 'Bikes';
		}else if (offersCtrl.searchCategory == 'Cauchos') {
			category = 'Tires';
		}else{
			category = 'All';
		};

		// var words = offersCtrl.searchWords.split(/[ ,]+/);
		// words = words.map(function(w) { return w.toLowerCase()});

		CurrentData.getOffers(category).then(function(response){
			offersCtrl.offersResults = response.data.result;

			if (offersCtrl.offersResults.length == 0) {
				offersCtrl.noSearchResults = true;
			};

		});

	};



}]);