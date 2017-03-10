'use strict';

angular.module('exporta.bikeDetail', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/moto/:ref/:name', {
    templateUrl: 'app/bikeDetail/bikeDetail.html',
    controller: 'BikeDetailCtrl',
    controllerAs : 'bikeDetailCtrl'
  })
}])

.controller('BikeDetailCtrl', ['$http', '$rootScope', '$routeParams', '$location','CurrentData', 'Flash', function($http, $rootScope, $routeParams, $location, CurrentData, Flash) {
	var bikeDetailCtrl = this;
	bikeDetailCtrl.imageActive = 0;
	bikeDetailCtrl.carouselInterval = 8000;
	bikeDetailCtrl.bike = {};
	bikeDetailCtrl.images = [];
	bikeDetailCtrl.isWished = false;
	bikeDetailCtrl.uptadingWish = true;
	bikeDetailCtrl.addingToCart = true;
	bikeDetailCtrl.countrySelected = false;
	bikeDetailCtrl.user = {};
	bikeDetailCtrl.user.wishes = [];


	// Bike Id
	bikeDetailCtrl.ref = $routeParams.ref;
	var ref = bikeDetailCtrl.ref;

	// Bike name
	bikeDetailCtrl.vehiName = $routeParams.name;
	var bikeName = bikeDetailCtrl.vehiName;

	// Meta tags
	$rootScope.robot = mBikeDetRobot;
	$rootScope.pageTitle = mBikeDetTitle +" "+"|"+" "+ Capitalize(bikeName.replace(/-/g, ' '));
	$rootScope.pageDescription = mBikeDetPageDescription;
	$rootScope.ogPageDescription = mBikeDetOgPageDescription;
	$rootScope.ogPageImage = mBikeDetOgPageImage;
	$rootScope.ogPageTitle = mBikeDetOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mBikeDetTwitterDescription;
	$rootScope.twitterImage = mBikeDetTwitterImage;



	
	CurrentData.getBikeDetail(bikeDetailCtrl.ref).then(function(response){

		bikeDetailCtrl.bike = response.data;

		if (mCurrentUser != null) {

			CurrentData.getCurrentUser().then(function(response){
				bikeDetailCtrl.user = response;

				// Check if the user has wishes
				if (!bikeDetailCtrl.user.wishes)  bikeDetailCtrl.user.wishes = [];

				// Check if it's wished
				for (var i = bikeDetailCtrl.user.wishes.length - 1; i >= 0; i--) {
					if(bikeDetailCtrl.user.wishes[i].objectId == bikeDetailCtrl.bike.objectId){
						bikeDetailCtrl.isWished = true;
					}		
				};
				bikeDetailCtrl.uptadingWish = false;
				bikeDetailCtrl.addingToCart = false;
			});

		}else{
			bikeDetailCtrl.uptadingWish = false;
			bikeDetailCtrl.addingToCart = false;
		};

		var mainImage = {}
		mainImage.image = bikeDetailCtrl.bike.mainImage;
		bikeDetailCtrl.bike.images.unshift(mainImage);

		// setTimeout(productDetailGallery, 1000, 6000);

		/* animated scrolling */
	    $('.scroll-to, .scroll-to-top').click(function(event) {
			var full_url = this.href;
			var parts = full_url.split("#");
			if (parts.length > 1) {

			    scrollTo(full_url);
			    event.preventDefault();
			}
	    });
	    function scrollTo(full_url) {
			var parts = full_url.split("#");
			var trgt = parts[1];
			var target_offset = $("#" + trgt).offset();
			var target_top = target_offset.top - 100;
			if (target_top < 0) {
			    target_top = 0;
			}

			$('html, body').animate({
			    scrollTop: target_top
			}, 1000);
	    }

	});


	this.addToCart = function(){

		if (mCurrentUser != null) {

			if (bikeDetailCtrl.user.cart && bikeDetailCtrl.user.cart.length != 0) {
				bikeDetailCtrl.flashMessage('cartAlert');
				return
			};

			// Pointer
    		var item = {
    			cart: {
    				__op:"AddUnique",
    				objects:[
		    			{
						__type: "Pointer",
						className: "Bikes",
						objectId: bikeDetailCtrl.bike.objectId
						}
    				]	
    			}
    		};

    		// Adding item to cart array 
			$http({
	    		method : 'PUT', 
				headers: mUpdateUserHeaderJson,
				data: item,
	    		url : apiUrl+'/users/'+bikeDetailCtrl.user.objectId
	    		}).success(function(data){

	    			// Clear user data
					CurrentData.clearCurrentUser();

					// Refresh user info
					CurrentData.getCurrentUser().then(function(response){
						bikeDetailCtrl.user = response;

						bikeDetailCtrl.addingToCart = false;
						angular.element($('#all')).scope().mainCtrl.refreshUser();

						// Flash message
						bikeDetailCtrl.flashMessage('cartAdded');

						// Cart
						$location.url('/carrito');


					});
		    
    		});



		}else{

			// Show login modal 
   			$('#login-modal').modal('show');

		};
	}


	this.addOrRemodeToWishes = function(){

		if (mCurrentUser != null) {

			bikeDetailCtrl.uptadingWish = true;

			if (bikeDetailCtrl.isWished) {

				// Pointer
	    		var wish = {
	    			wishes: {
	    				__op:"Remove",
	    				objects:[
			    			{
							__type: "Pointer",
							className: "Bikes",
							objectId: bikeDetailCtrl.bike.objectId
							}
	    				]	
	    			}
	    		};

	    		// Removing wish from wishes array 
				$http({
		    		method : 'PUT', 
					headers: mUpdateUserHeaderJson,
					data: wish,
		    		url : apiUrl+'/users/'+bikeDetailCtrl.user.objectId
		    		}).success(function(data){

		    			// Clear user data
						CurrentData.clearCurrentUser();

						// Refresh user info
						CurrentData.getCurrentUser().then(function(response){
							bikeDetailCtrl.user = response;

							bikeDetailCtrl.isWished = false;
							bikeDetailCtrl.uptadingWish = false;

							// Flash message
							bikeDetailCtrl.flashMessage('wishRemoved');


						});
			    
	    			});
		

				
			}else{

				// Pointer
	    		var wish = {
	    			wishes: {
	    				__op:"Add",
	    				objects:[
			    			{
							__type: "Pointer",
							className: "Bikes",
							objectId: bikeDetailCtrl.bike.objectId
							}
	    				]	
	    			}
	    		};

	    		// Adding wish to wishes array 
				$http({
		    		method : 'PUT', 
					headers: mUpdateUserHeaderJson,
					data: wish,
		    		url : apiUrl+'/users/'+bikeDetailCtrl.user.objectId
		    		}).success(function(data){

		    			// Clear user data
						CurrentData.clearCurrentUser();

						// Refresh user info
						CurrentData.getCurrentUser().then(function(response){
							bikeDetailCtrl.user = response;

							bikeDetailCtrl.isWished = true;
							bikeDetailCtrl.uptadingWish = false;

							// Flash message
							bikeDetailCtrl.flashMessage('wishAdded');

						});
			    
	    		});
			};

		}else{

			// Show login modal 
   			$('#login-modal').modal('show');

		};
	};


	this.onCountrySelected = function(){

		bikeDetailCtrl.countrySelected = true;
		bikeDetailCtrl.totalPrice = bikeDetailCtrl.bike.price + bikeDetailCtrl.country.fee;

	};


	this.flashMessage = function (m) {

		if( m == 'wishAdded'){
	        var message = '<div class="text-center"><strong>Agregado a tu lista de deseos!</strong></div>';
	        Flash.create('success', message);
	    }else if ( m == 'cartAdded') {
	    	var message = '<div class="text-center"><strong>Agregado a tu carrito de compras!</strong></div>';
	        Flash.create('success', message);
	    }else if (m == 'wishRemoved') {
	    	var message = '<div class="text-center"><strong>Removido de tu lista de deseos!</strong></div>';
	        Flash.create('danger', message);
	   	}else if (m == 'cartAlert'){
	    	var message = '<div class="text-center"><strong>Tienes items en tu carrito, procede a completar la compra de los items en tu carrito o limpialo antes de continuar con la reserva de esta moto.</strong></div>';
	        Flash.create('danger', message);
	    };

    };


}]);