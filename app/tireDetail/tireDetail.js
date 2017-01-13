'use strict';

angular.module('mokars.tireDetail', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/caucho/:ref/:name', {
    templateUrl: 'app/tireDetail/tireDetail.html',
    controller: 'TireDetailCtrl',
    controllerAs : 'tireDetailCtrl'
  })
}])

.controller('TireDetailCtrl', ['$http', '$rootScope', '$routeParams', '$location','CurrentData', 'Flash', function($http, $rootScope, $routeParams, $location, CurrentData, Flash) {
	var tireDetailCtrl = this;
	tireDetailCtrl.imageActive = 0;
	tireDetailCtrl.carouselInterval = 8000;
	tireDetailCtrl.tire = {};
	tireDetailCtrl.images = [];
	tireDetailCtrl.isWished = false;
	tireDetailCtrl.uptadingWish = true;
	tireDetailCtrl.addingToCart = true;
	tireDetailCtrl.countrySelected = false;
	tireDetailCtrl.user = {};
	tireDetailCtrl.user.wishes = [];

	// Tire Id
	tireDetailCtrl.ref = $routeParams.ref;
	var ref = tireDetailCtrl.ref;

	// Tire name
	tireDetailCtrl.vehiName = $routeParams.name;
	var tireName = tireDetailCtrl.vehiName;

	// Meta tags
	$rootScope.robot = mTireDetRobot;
	$rootScope.pageTitle = mTireDetTitle +" "+"|"+" "+ Capitalize(tireName.replace(/-/g, ' '));
	$rootScope.pageDescription = mTireDetPageDescription;
	$rootScope.ogPageDescription = mTireDetOgPageDescription;
	$rootScope.ogPageImage = mTireDetOgPageImage;
	$rootScope.ogPageTitle = mTireDetOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mTireDetTwitterDescription;
	$rootScope.twitterImage = mTireDetTwitterImage;



	
	CurrentData.getTireDetail(tireDetailCtrl.ref).then(function(response){

		tireDetailCtrl.tire = response.data;

		if (mCurrentUser != null) {

			CurrentData.getCurrentUser().then(function(response){
				tireDetailCtrl.user = response;

				// Check if the user has wishes
				if (!tireDetailCtrl.user.wishes)  tireDetailCtrl.user.wishes = [];

				// Check if it's wished
				for (var i = tireDetailCtrl.user.wishes.length - 1; i >= 0; i--) {
					if(tireDetailCtrl.user.wishes[i].objectId == tireDetailCtrl.tire.objectId){
						tireDetailCtrl.isWished = true;
					}		
				};
				tireDetailCtrl.uptadingWish = false;
				tireDetailCtrl.addingToCart = false;
			});

		}else{

			tireDetailCtrl.uptadingWish = false;
			tireDetailCtrl.addingToCart = false;
		};

		var mainImage = {}
		mainImage.image = tireDetailCtrl.tire.mainImage;
		tireDetailCtrl.tire.images.unshift(mainImage);

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


			if (tireDetailCtrl.user.cart && tireDetailCtrl.user.cart.length != 0) {
				for (var i = tireDetailCtrl.user.cart.length - 1; i >= 0; i--) {
					if (tireDetailCtrl.user.cart[i].category == 'autos' || tireDetailCtrl.user.cart[i].category == 'bikes') {
						tireDetailCtrl.flashMessage('cartAlert');
						return
					};
				};
			};

			// Pointer
    		var item = {
    			cart: {
    				__op:"AddUnique",
    				objects:[
		    			{
						__type: "Pointer",
						className: "Tires",
						objectId: tireDetailCtrl.tire.objectId
						}
    				]	
    			}
    		};

    		// Adding item to cart array 
			$http({
	    		method : 'PUT', 
				headers: mUpdateUserHeaderJson,
				data: item,
	    		url : apiUrl+'/users/'+tireDetailCtrl.user.objectId
	    		}).success(function(data){

	    			// Clear user data
					CurrentData.clearCurrentUser();

					// Refresh user info
					CurrentData.getCurrentUser().then(function(response){
						tireDetailCtrl.user = response;

						tireDetailCtrl.addingToCart = false;
						angular.element($('#all')).scope().mainCtrl.refreshUser();

						// Flash message
						tireDetailCtrl.flashMessage('cartAdded');

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

			tireDetailCtrl.uptadingWish = true;

			if (tireDetailCtrl.isWished) {

				// Pointer
	    		var wish = {
	    			wishes: {
	    				__op:"Remove",
	    				objects:[
			    			{
							__type: "Pointer",
							className: "Tires",
							objectId: tireDetailCtrl.tire.objectId
							}
	    				]	
	    			}
	    		};

	    		// Removing wish from wishes array 
				$http({
		    		method : 'PUT', 
					headers: mUpdateUserHeaderJson,
					data: wish,
		    		url : apiUrl+'/users/'+tireDetailCtrl.user.objectId
		    		}).success(function(data){

		    			// Clear user data
						CurrentData.clearCurrentUser();

						// Refresh user info
						CurrentData.getCurrentUser().then(function(response){
							tireDetailCtrl.user = response;

							tireDetailCtrl.isWished = false;
							tireDetailCtrl.uptadingWish = false;


							// Flash message
							tireDetailCtrl.flashMessage('wishRemoved');

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
							className: "Tires",
							objectId: tireDetailCtrl.tire.objectId
							}
	    				]	
	    			}
	    		};

	    		// Adding wish to wishes array 
				$http({
		    		method : 'PUT', 
					headers: mUpdateUserHeaderJson,
					data: wish,
		    		url : apiUrl+'/users/'+tireDetailCtrl.user.objectId
		    		}).success(function(data){

		    			// Clear user data
						CurrentData.clearCurrentUser();

						// Refresh user info
						CurrentData.getCurrentUser().then(function(response){
							tireDetailCtrl.user = response;

							tireDetailCtrl.isWished = true;
							tireDetailCtrl.uptadingWish = false;

							// Flash message
							tireDetailCtrl.flashMessage('wishAdded');

						});
			    
	    		});
			};

		}else{

			// Show login modal 
   			$('#login-modal').modal('show');

		};
	};



	this.onCountrySelected = function(){

		tireDetailCtrl.countrySelected = true;
		tireDetailCtrl.totalPrice = tireDetailCtrl.tire.price + tireDetailCtrl.country.fee;

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
	    	var message = '<div class="text-center"><strong>Tienes items de otras categorias en tu carrito, procede a completar la compra de los items en tu carrito o limpialo antes de continuar con la compra de este caucho.</strong></div>';
	        Flash.create('danger', message);
	    };

    };


}]);