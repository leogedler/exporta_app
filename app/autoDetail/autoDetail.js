'use strict';

angular.module('mokars.autoDetail', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/automovil/:ref/:name', {
    templateUrl: 'app/autoDetail/autoDetail.html',
    controller: 'AutoDetailCtrl',
    controllerAs : 'autoDetailCtrl'
  })
}])

.controller('AutoDetailCtrl', ['$http', '$rootScope', '$routeParams', '$location','CurrentData', 'Flash', function($http, $rootScope, $routeParams, $location, CurrentData, Flash) {
	var autoDetailCtrl = this;
	autoDetailCtrl.imageActive = 0;
	autoDetailCtrl.carouselInterval = 8000;
	autoDetailCtrl.auto = {};
	autoDetailCtrl.images = [];
	autoDetailCtrl.isWished = false;
	autoDetailCtrl.uptadingWish = true;
	autoDetailCtrl.addingToCart = true;	
	autoDetailCtrl.countrySelected = false;
	autoDetailCtrl.user = {};
	autoDetailCtrl.user.wishes = [];


	// Vehicle Id
	autoDetailCtrl.ref = $routeParams.ref;
	var ref = autoDetailCtrl.ref;

	// Vehicle name
	autoDetailCtrl.vehiName = $routeParams.name;
	var autoName = autoDetailCtrl.vehiName;

	// Meta tags
	$rootScope.robot = mAutoDetRobot;
	$rootScope.pageTitle = mAutoDetTitle +" "+"|"+" "+ Capitalize(autoName.replace(/-/g, ' '));
	$rootScope.pageDescription = mAutoDetPageDescription;
	$rootScope.ogPageDescription = mAutoDetOgPageDescription;
	$rootScope.ogPageImage = mAutoDetOgPageImage;
	$rootScope.ogPageTitle = mAutoDetOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mAutoDetTwitterDescription;
	$rootScope.twitterImage = mAutoDetTwitterImage;

	
	CurrentData.getAutoDetail(autoDetailCtrl.ref).then(function(response){

		autoDetailCtrl.auto = response.data;

		if (mCurrentUser != null) {

			CurrentData.getCurrentUser().then(function(response){
				autoDetailCtrl.user = response;

				// Check if the user has wishes
				if (!autoDetailCtrl.user.wishes)  autoDetailCtrl.user.wishes = [];

				// Check if it's wished
				for (var i = autoDetailCtrl.user.wishes.length - 1; i >= 0; i--) {
					if(autoDetailCtrl.user.wishes[i].objectId == autoDetailCtrl.auto.objectId){
						autoDetailCtrl.isWished = true;
					}		
				};
				autoDetailCtrl.uptadingWish = false;
				autoDetailCtrl.addingToCart = false;
			});

		}else{

			autoDetailCtrl.uptadingWish = false;
			autoDetailCtrl.addingToCart = false;

		};


		var mainImage = {}
		mainImage.image = autoDetailCtrl.auto.mainImage;
		autoDetailCtrl.auto.images.unshift(mainImage);

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

			if (autoDetailCtrl.user.cart && autoDetailCtrl.user.cart.length != 0) {
				autoDetailCtrl.flashMessage('cartAlert');
				return
			};

			// Pointer
    		var item = {
    			cart: {
    				__op:"AddUnique",
    				objects:[
		    			{
						__type: "Pointer",
						className: "Autos",
						objectId: autoDetailCtrl.auto.objectId
						}
    				]	
    			}
    		};

    		// Adding item to cart array 
			$http({
	    		method : 'PUT', 
				headers: mUpdateUserHeaderJson,
				data: item,
	    		url : apiUrl+'/users/'+autoDetailCtrl.user.objectId
	    		}).success(function(data){

	    			// Clear user data
					CurrentData.clearCurrentUser();

					// Refresh user info
					CurrentData.getCurrentUser().then(function(response){
						autoDetailCtrl.user = response;

						autoDetailCtrl.addingToCart = false;
						angular.element($('#all')).scope().mainCtrl.refreshUser();

						// Flash message
						autoDetailCtrl.flashMessage('cartAdded');

						// Cart
						$location.url('/carrito');

					});
		    
    		});



		}else{

			// Show login modal 
   			$('#login-modal').modal('show');

		};
	};


	this.addOrRemodeToWishes = function(){

		if (mCurrentUser != null) {

			autoDetailCtrl.uptadingWish = true;

			if (autoDetailCtrl.isWished) {

				// Pointer
	    		var wish = {
	    			wishes: {
	    				__op:"Remove",
	    				objects:[
			    			{
							__type: "Pointer",
							className: "Autos",
							objectId: autoDetailCtrl.auto.objectId
							}
	    				]	
	    			}
	    		};

	    		// Removing wish from wishes array 
				$http({
		    		method : 'PUT', 
					headers: mUpdateUserHeaderJson,
					data: wish,
		    		url : apiUrl+'/users/'+autoDetailCtrl.user.objectId
		    		}).success(function(data){

		    			// Clear user data
						CurrentData.clearCurrentUser();

						// Refresh user info
						CurrentData.getCurrentUser().then(function(response){
							autoDetailCtrl.user = response;

							autoDetailCtrl.isWished = false;
							autoDetailCtrl.uptadingWish = false;

							// Flash message
							autoDetailCtrl.flashMessage('wishRemoved');


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
							className: "Autos",
							objectId: autoDetailCtrl.auto.objectId
							}
	    				]	
	    			}
	    		};

	    		// Adding wish to wishes array 
				$http({
		    		method : 'PUT', 
					headers: mUpdateUserHeaderJson,
					data: wish,
		    		url : apiUrl+'/users/'+autoDetailCtrl.user.objectId
		    		}).success(function(data){

		    			// Clear user data
						CurrentData.clearCurrentUser();

						// Refresh user info
						CurrentData.getCurrentUser().then(function(response){
							autoDetailCtrl.user = response;

							autoDetailCtrl.isWished = true;
							autoDetailCtrl.uptadingWish = false;

							// Flasd message
							autoDetailCtrl.flashMessage('wishAdded');

						});
			    
	    		});
			};

		}else{

			// Show login modal 
   			$('#login-modal').modal('show');

		};
	}


	this.onCountrySelected = function(){

		autoDetailCtrl.countrySelected = true;
		autoDetailCtrl.totalPrice = autoDetailCtrl.auto.price + autoDetailCtrl.country.fee;

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
	    	var message = '<div class="text-center"><strong>Tienes items en tu carrito, procede a completar la compra de los items en tu carrito o limpialo antes de continuar con la reserva de este automovil.</strong></div>';
	        Flash.create('danger', message);
	    };

    };


}]);