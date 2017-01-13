'use strict';

angular.module('mokars.search', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/busqueda', {
    templateUrl: 'app/search/search.html',
    controller: 'SearchCtrl',
    controllerAs : 'searchCtrl'
  })
}])


.controller('SearchCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var searchCtrl = this;

	// Meta tags
	$rootScope.robot = mSearchRobot;
	$rootScope.pageTitle = mSearchTitle;
	$rootScope.pageDescription = mMainPageDescription;
	$rootScope.ogPageDescription = mMainOgPageDescription;
	$rootScope.ogPageImage = mMainOgPageImage;
	$rootScope.ogPageTitle = mMainOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mMainTwitterDescription;
	$rootScope.twitterImage = mMainTwitterImage;


	// Search categories
	searchCtrl.searchCategories = [
		'Automóviles',
		'Motos',
		'Cauchos'
	];


	// Check search parameters
	if ($routeParams.search) {
		searchCtrl.searchWords = $routeParams.search;

		// Hashtags match
		// var res = str.match(/\B\#\w\w+\b/g);

		var words = searchCtrl.searchWords.split(/[ ,]+/);
		words = words.map(function(w) { return w.toLowerCase()});

		CurrentData.getSearch(words, 'All').then(function(response){
			searchCtrl.searchResults = response.data.result;
			searchCtrl.noSearch = false;

			if (searchCtrl.searchResults.length == 0) {
				searchCtrl.noSearchResults = true;
			}else{
				searchCtrl.noSearchResults = false;
			};


		});

	}else{
		searchCtrl.noSearch = true;
	};



	this.search = function(){

		$('#search-input-header').blur()	
		searchCtrl.noSearchResults = false;

		$location.url('/busqueda');

		console.log(searchCtrl.searchWords);

		var words = searchCtrl.searchWords.split(/[ ,]+/);
		words = words.map(function(w) { return w.toLowerCase()});

		CurrentData.getSearch(words, 'All').then(function(response){
			searchCtrl.searchResults = response.data.result;

			if (searchCtrl.searchResults.length == 0) {
				searchCtrl.noSearchResults = true;
			};


		});

	};


	this.changeSearchCategories = function(){
		searchCtrl.noSearchResults = false;

		var category;

		if (searchCtrl.searchCategory == 'Automóviles') {
			category = 'Autos';
		}else if (searchCtrl.searchCategory == 'Motos') {
			category = 'Bikes';
		}else if (searchCtrl.searchCategory == 'Cauchos') {
			category = 'Tires';
		}else{
			category = 'All';
		};

		var words = searchCtrl.searchWords.split(/[ ,]+/);
		words = words.map(function(w) { return w.toLowerCase()});

		CurrentData.getSearch(words, category).then(function(response){
			searchCtrl.searchResults = response.data.result;

			if (searchCtrl.searchResults.length == 0) {
				searchCtrl.noSearchResults = true;
			};

		});

	};



}]);