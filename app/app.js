
(function(){

	angular.module('exporta', ['ngRoute', 'ui.bootstrap','ngSanitize' ,'angular-loading-bar', 'service.module', 'ngFlash',
	 'algoliasearch', 'algolia.autocomplete', 
			'exporta.autos',
			'exporta.bikes',
			'exporta.tires',    
			'exporta.autoDetail', 
			'exporta.bikeDetail',
			'exporta.tireDetail',  
			'exporta.register',
			'exporta.profile',
			'exporta.cart',
			'exporta.search',
			'exporta.static',
			'exporta.offers'
		])


	// App Routes
	.config(function($routeProvider, $locationProvider) {

		// Use the HTML5 History API
	    // $locationProvider.html5Mode(true);
		$locationProvider.hashPrefix('!');
		
		$routeProvider
			.when('/', {
				templateUrl : 'app/home/home.html',
				controller  : 'MainController',
				controllerAs : 'mainCtrl'
			})

			.otherwise({
		        redirectTo: '/'
		    });
	})

	// Run
	.run(['$rootScope','$location', '$routeParams', function($rootScope, $location, $routeParams) {
	    $rootScope.$on('$routeChangeSuccess', function(e, current, pre) {
	    	// console.log('Current route name: ' + $location.path());

	    	// Tracking Current Location for Google Analytics 
	    	// ga('send', 'pageview', $location.path());

	    });
	}])


	// Main Controller
	.controller('MainController', ['$http','$location', '$routeParams', '$rootScope', '$scope', 'CurrentData', 'algolia', function($http, $location, $routeParams, $rootScope, $scope, CurrentData, algolia) {
		var mainCtrl = this;
		mainCtrl.logingUp = false;
		mainCtrl.searchResults = [];
		mainCtrl.noSearchResults = true;

		// Meta tags
		$rootScope.robot = mMainRobot;
		$rootScope.pageTitle = mMainTitle;
		$rootScope.pageDescription = mMainPageDescription;
		$rootScope.ogPageDescription = mMainOgPageDescription;
		$rootScope.ogPageImage = mMainOgPageImage;
		$rootScope.ogPageTitle = mMainOgPageTitle;
		$rootScope.url = $location.absUrl();
		$rootScope.twitterDescription = mMainTwitterDescription;
		$rootScope.twitterImage = mMainTwitterImage;



	  	var client = algoliasearch("TDLG3QOHE0", "b77ac6640d8a9655cfe915ad802bb296");
	  	// var autos = client.initIndex('autos');
	  	// var bikes = client.initIndex('bikes');
	  	// var tires = client.initIndex('tires');
	  	var main_index = client.initIndex('main_index');

	  	var templateMain = Hogan.compile(
	  		'<div>' +
		  		'<div class="row">'+
			  		'<div class="content-autocomplete">'+
			  			'<img src="{{{ mainImage.url }}}" class="img-responsive">'+
			  			'<div class="content-autocomplete-text">'+
						    '<h4>{{{ _highlightResult.make.value }}} {{{ _highlightResult.model.value }}}</h4>' +
						    '<h5>{{{ year }}}</h5>' +
						    '<h5>{{{ _highlightResult.dimensions.value }}}</h5>' +
						'</div>'+
					'</div>'+
				'</div>'+
		  	'</div>');


	 //  	var suggestions = [];

	 //  	var autosIndex = autocomplete.sources.hits(autos, {hitsPerPage: 5});
	 //  	var bikesIndex = autocomplete.sources.hits(bikes, {hitsPerPage: 5});
	 //  	var tiresIndex = autocomplete.sources.hits(tires, {hitsPerPage: 5});

	 //  	var mainIndex = autocomplete.sources.hits(main_index, {hitsPerPage: 5});


		// autocomplete('#search-input', {hint: true}, [
		//     {
		//     	source: function(query, callback) {
		// 		  mainIndex(query, function(suggestions) {
		// 		    // FIXME: Do stuff with the array of returned suggestions

		// 		    if (suggestions.length != 0) {
		// 			    mainCtrl.searchResults = suggestions;
		// 			    angular.element($('#main')).scope().$apply();
		// 		    };

		// 		    callback(suggestions);
		// 		  });
		// 		},
		//       	displayKey: '',
		//       	templates: {
		//       		// header: '<div class="category">Resultados</div>',
		//       		empty: 'No hay resultados',
		//         	suggestion: function(suggestion) {

		//      			// mainCtrl.searchResults.push(suggestion);
		//           		return templateMain.render(suggestion);
		//         	}
		//       	}
		//     },
		  //   {
		  //   	source: function(query, callback) {
				//   bikesIndex(query, function(suggestions) {
				//     // FIXME: Do stuff with the array of returned suggestions

				//     if (suggestions.length != 0) {
				// 	    mainCtrl.searchResults = suggestions;
				// 	    angular.element($('#main')).scope().$apply();
				//     };

				//     callback(suggestions);
				//   });
				// },
		  //     	displayKey: '',
		  //     	templates: {
			 //      	header: '<div class="category">Motos</div>',
			 //        suggestion: function(suggestion) {
			 //        	// mainCtrl.searchResults.push(suggestion);
			 //        	return templateBike.render(suggestion);
		  //       	}
		  //     	}
		  //   },
		  //   {
		  //   	source: function(query, callback) {
				//   tiresIndex(query, function(suggestions) {
				//     // FIXME: Do stuff with the array of returned suggestions

				//     if (suggestions.length != 0) {
				// 	    mainCtrl.searchResults = suggestions;
				// 	    angular.element($('#main')).scope().$apply();
				//     };

				//     callback(suggestions);
				//   });
				// },
		  //     	displayKey: '',
		  //     	templates: {
			 //      	header: '<div class="category">Cauchos</div>',
			 //        suggestion: function(suggestion) {
			 //        	// mainCtrl.searchResults.push(suggestion);
			 //        	return templateTire.render(suggestion);
		  //       	}
		  //     	}
		  //   }
			// ]).on('autocomplete:selected', function(event, suggestion, dataset) {
			//    	    // console.log(suggestion, dataset);

			//    	    console.log('seleceted')

			// 		if (suggestion.category == 'autos') {
			//     		$location.url('/automovil/'+suggestion.objectId+'/'+suggestion.make+'-'+suggestion.model+'-'+suggestion.year);
			//     	}else if (suggestion.category == 'bikes') {
			//     		$location.url('/moto/'+suggestion.objectId+'/'+suggestion.make+'-'+suggestion.model+'-'+suggestion.year);
			//     	}else if (suggestion.category == 'tires'){
			//     		$location.url('/caucho/'+suggestion.objectId+'/'+suggestion.make+'-'+suggestion.model+'-'+suggestion.width+'-'+suggestion.height+'-R'+suggestion.diameter);
			//     	};
			//     	$('#search-input').blur()	
			//     	angular.element($('#main')).scope().$apply();
			// }).on('autocomplete:empty', function(event){

			// 	console.log('no results');


			// 	// $('#search-input').autocomplete('open');

			// 	// $('#search-input').autocomplete('val', 'Sin resultados');



			// }).on('autocomplete:updated', function(event, suggestion, dataset){
			// 	console.log('updated');
			// 	// suggestions = [];

			// }).on('autocomplete:autocompleted', function(event, suggestion, dataset){
			// 	console.log('completed');
			// 	// suggestions = [];

			// });




		mainCtrl.searchWords = '';

		this.getDatasets = function() {
		    return [
		    {
		    	source: function(q, cb) {
		        	main_index.search(q, { hitsPerPage: 5 }, function(error, content) {
			            if (error) {
			                cb([]);
			                return;
			            }
			            cb(content.hits);
		        	});
		    	},
		      	templates: {
		      // 		empty: '<div>' +
						  // 		'<div class="row text-center">'+
							 //  		'<div class="col-md-12">'+
								// 	    '<div><h4>No hay resultados</h4></div>' +
								// 	'</div>'+
								// '</div>'+
						  // 	'</div>',
		        	suggestion: function(suggestion) {
		          	return templateMain.render(suggestion);
		        	}
		      	}
		    }
		    ];
		};

	  	$scope.$watch('mainCtrl.searchWords', function(v) {
	    	// console.log(v);

	  	});
	  	$scope.$on('autocomplete:selected', function(event, suggestion, dataset) {

	   	    $('#search-input-header').blur()	

			if (suggestion.category == 'autos') {
	    		$location.url('/automovil/'+suggestion.objectId+'/'+suggestion.make+'-'+suggestion.model+'-'+suggestion.year);
	    	}else if (suggestion.category == 'bikes') {
	    		$location.url('/moto/'+suggestion.objectId+'/'+suggestion.make+'-'+suggestion.model+'-'+suggestion.year);
	    	}else if (suggestion.category == 'tires'){
	    		$location.url('/caucho/'+suggestion.objectId+'/'+suggestion.make+'-'+suggestion.model+'-'+suggestion.width+'-'+suggestion.height+'-R'+suggestion.diameter);
	    	};
	    	$('#search-input').blur()	
	    	angular.element($('#main')).scope().$apply();

	  	});





		if (mCurrentUser != null) {

			CurrentData.getCurrentUser().then(function(response){
				mainCtrl.user = response;

			});

		};


		this.isUser = function(){
			if (mCurrentUser != null) {
				return true;
			}else{
				return false;
			};
		};


		this.loging = function(){

			mainCtrl.logingUp = true;

			Parse.User.logIn(mainCtrl.loginForm.username.toLowerCase(), mainCtrl.loginForm.pass, {
			  success: function(user) {

			  	mCurrentUser = Parse.User.current();
			  	mainCtrl.logingUp = false;
			  	window.location.reload();
			  	
			  },
			  error: function(user, error) {
				// Hide loading
			  	$scope.$apply(function () {
            		mainCtrl.logingUp = false;
        		});
			  	
			    // The login failed. Check error to see why.
			    if (error.code == 101) {
			    	alert("Email o clave incorrecta, recuerda que la clave es sensible a las mayúsculas y minúsculas!!");
			    }else{
			    	alert("Error: " + error.code + " " + error.message);
			    };
			   
			  }
			});
		};



		this.logOut = function(){

			Parse.User.logOut();
			mCurrentUser = Parse.User.current();
			window.location.reload();

			// if ($location.path() == '/perfil') {

			// 	window.location.replace('http://sohamfit.com');
			// }else{
			// 	window.location.reload();

			// };
		};


		this.submitLead = function(source){

			mainCtrl.sendingLead = true;

			// Mix panel promo video play
			// mixpanel.track('Promo2 new lead');

			mainCtrl.lead.source = source;


			// Sending lead
			$http({
	    		method : 'POST', 
				headers: mPostPutHeaderJson,
				data: mainCtrl.lead,
	    		url : apiUrl+'/classes/Leads'

	    		}).success(function(response){

	    			mainCtrl.sendingLead = false;
	    			mainCtrl.leadSubmitted = true;
	    			mainCtrl.lead = {};


	    // 			// Send email to lead
					// $http({
			  //   		method : 'POST', 
					// 	headers: mPostPutHeaderJson,
					// 	data: prom2Ctrl.lead,
			  //   		url : apiUrl+'/functions/emailToLead'

			  //   		}).success(function(data){

			  //   			prom2Ctrl.sendingLead = false;
					// 		prom2Ctrl.leadSent = true;

			  //   		});	    			
	    		});
		};

		this.goToCart = function(){

			if (mCurrentUser != null) {
				$location.url('/carrito');	
			}else{
				// Show login modal 
   				$('#login-modal').modal('show');
			};

		};

		this.refreshUser = function(){
			CurrentData.getCurrentUser().then(function(response){
	    		mainCtrl.user = response;
	    	});
		};


		this.search = function(){

			$('#search-input-header').blur()	
			// console.log(mainCtrl.searchResults);
			$location.url('/busqueda?search='+mainCtrl.searchWords);

		};



	}])


})();