'use strict';

angular.module('exporta.profile', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/perfil', {
    templateUrl: 'app/profile/profile.html',
    controller: 'ProfileCtrl',
    controllerAs : 'profileCtrl'
  })
}])


.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/perfil/:route', {
    templateUrl: 'app/profile/profile.html',
    controller: 'ProfileCtrl',
    controllerAs : 'profileCtrl'
  })
}])


.controller('ProfileCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', 'Flash', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData, Flash) {
	var profileCtrl = this;
	profileCtrl.editUser = {};
	profileCtrl.account = false;
	profileCtrl.orders = false;
	profileCtrl.wish = false;
	profileCtrl.orderDetail = false;
	profileCtrl.countries = mCountries;


	// Check the route
	if ($routeParams.route) {
		profileCtrl.route = $routeParams.route;
		if(profileCtrl.route == 'deseos'){
			profileCtrl.wish = true;
		}else if(profileCtrl.route == 'ordenes'){
			profileCtrl.orders = true;
		}else{
			$location.url('/perfil');	
		};
	}else{	

		profileCtrl.route = 'datos';
		profileCtrl.account = true;
	};



	// Meta tags
	$rootScope.robot = mProfileRobot;
	$rootScope.pageTitle = mProfileTitle +' | '+ Capitalize(profileCtrl.route);
	$rootScope.pageDescription = mMainPageDescription;
	$rootScope.ogPageDescription = mMainOgPageDescription;
	$rootScope.ogPageImage = mMainOgPageImage;
	$rootScope.ogPageTitle = mMainOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mMainTwitterDescription;
	$rootScope.twitterImage = mMainTwitterImage;


	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){

	});


	if (mCurrentUser != null) {

		CurrentData.getCurrentUser().then(function(response){
			profileCtrl.user = response;

			profileCtrl.editUser.firstName = profileCtrl.user.firstName;
			profileCtrl.editUser.lastName = profileCtrl.user.lastName;
			profileCtrl.editUser.email = profileCtrl.user.email;
			profileCtrl.editUser.country = profileCtrl.user.country;
			profileCtrl.editUser.phone = profileCtrl.user.phone;
			profileCtrl.editUser.address = profileCtrl.user.address;


			// Retrieve orders
			if (profileCtrl.orders) {
				CurrentData.getOrders(profileCtrl.user.objectId).then(function(response){
					profileCtrl.user.orders = response.data.results;

				});
			};	



		});

	}else{
		$location.url('/');
	};



	this.updateUserInfo = function(){

		profileCtrl.updatinInfo = true;

		// Checking the fields
    	profileCtrl.editUser.firstName = profileCtrl.editUser.firstName.toLowerCase();
		profileCtrl.editUser.lastName = profileCtrl.editUser.lastName.toLowerCase();
		profileCtrl.editUser.email = profileCtrl.editUser.email.toLowerCase();
		profileCtrl.editUser.username = profileCtrl.editUser.email.toLowerCase();
		profileCtrl.editUser.country = profileCtrl.editUser.country.toLowerCase();
		profileCtrl.editUser.address = profileCtrl.editUser.address;


    	//Uptading the user info
    	$http({
    		method : 'PUT', 
			headers: mUpdateUserHeaderJson,
			data: profileCtrl.editUser,
    		url : apiUrl+'/users/'+profileCtrl.user.objectId

    		}).success(function(response){

				CurrentData.clearCurrentUser();

				// Refresh current user info
				CurrentData.getCurrentUser().then(function(response){
					profileCtrl.updatinInfo = false;

					// Updating user info
					profileCtrl.user = response;

					profileCtrl.editUser.firstName = profileCtrl.user.firstName;
					profileCtrl.editUser.lastName = profileCtrl.user.lastName;
					profileCtrl.editUser.email = profileCtrl.user.email;
					profileCtrl.editUser.country = profileCtrl.user.country;
					profileCtrl.editUser.phone = profileCtrl.user.phone;

				});


    		}).error(function(data){
    			console.log('error', data);

    			profileCtrl.updatinInfo = false;

				if(data.code == 203){
			    	alert("Esto es raro!!, ese email ya ha sido utilizado, utiliza otro por favor.");
			    }else{
			    	alert("Error: " + data.code + " " + data.message);
			    };


    		});
	};

	this.viewOrderDetail = function(index){

		if (profileCtrl.user.orders[index].items[0].category == 'tires'){
			profileCtrl.tireItem = true;
			profileCtrl.vehicleItem = false;
		}else{
			profileCtrl.vehicleItem = true;
			profileCtrl.tireItem = false;
		}	

		for (var i = profileCtrl.user.orders[index].items.length - 1; i >= 0; i--) {
			profileCtrl.user.orders[index].items[i].price = profileCtrl.user.orders[index].orderData[i].price;
			profileCtrl.user.orders[index].items[i].paid = profileCtrl.user.orders[index].orderData[i].paid;
			profileCtrl.user.orders[index].items[i].destFee = profileCtrl.user.orders[index].orderData[i].destFee;
			profileCtrl.user.orders[index].items[i].reservationPrice = profileCtrl.user.orders[index].orderData[i].reservationPrice;
			profileCtrl.user.orders[index].items[i].remainingToPay = profileCtrl.user.orders[index].orderData[i].remainingToPay;
			profileCtrl.user.orders[index].items[i].quantity = profileCtrl.user.orders[index].orderData[i].quantity;
			profileCtrl.user.orders[index].items[i].discount = profileCtrl.user.orders[index].orderData[i].discount;
			profileCtrl.user.orders[index].items[i].wishColor = profileCtrl.user.orders[index].orderData[i].wishColor;
		};

		profileCtrl.orderIndex = index;
		profileCtrl.orderDetail = true;
	};



	this.addToCart = function(wish){
		var category;



		if (wish.category == 'autos') {
			
			if (profileCtrl.user.cart && profileCtrl.user.cart.length != 0) {
				profileCtrl.flashMessage('cartAutoAlert');
				return
			};

			category = 'Autos'

		};
		if (wish.category == 'bikes') {

			if (profileCtrl.user.cart && profileCtrl.user.cart.length != 0) {
				profileCtrl.flashMessage('cartBikeAlert');
				return
			};

			category = 'Bikes'
		};
		if (wish.category == 'tires') {

			if (profileCtrl.user.cart && profileCtrl.user.cart.length != 0) {
				for (var i = profileCtrl.user.cart.length - 1; i >= 0; i--) {
					if (profileCtrl.user.cart[i].category == 'autos' || profileCtrl.user.cart[i].category == 'bikes') {
						profileCtrl.flashMessage('cartTireAlert');
						return
					};
				};
			};


			category = 'Tires'

		};


		// Pointer
		var item = {
			cart: {
				__op:"AddUnique",
				objects:[
	    			{
					__type: "Pointer",
					className: category,
					objectId: wish.objectId
					}
				]	
			}
		};

		// Adding item to cart array 
		$http({
			method : 'PUT', 
			headers: mUpdateUserHeaderJson,
			data: item,
			url : apiUrl+'/users/'+profileCtrl.user.objectId
			}).success(function(data){

				// Clear user data
				CurrentData.clearCurrentUser();

				// Refresh user info
				CurrentData.getCurrentUser().then(function(response){
					profileCtrl.user = response;

					profileCtrl.addingToCart = false;
					angular.element($('#all')).scope().mainCtrl.refreshUser();

					// Flash message
					profileCtrl.flashMessage('cartAdded');

					// Cart
					$location.url('/carrito');

				});
	    
		});

	};


	this.orderStatus = function(status){

		if (status == 'pagado') return 'label-success'
		else if (status == 'procesandose') return 'label-primary'
		else if (status == 'por contactar') return 'label-info'
		else if (status == 'por pagar') return 'label-warning'
		else return 'label-default'

	}


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
	    }else if (m == 'cartAutoAlert'){
	    	var message = '<div class="text-center"><strong>Tienes items en tu carrito, procede a completar la compra de los items en tu carrito o limpialo antes de continuar con la reserva de este automovil.</strong></div>';
	        Flash.create('danger', message);
	   	}else if (m == 'cartBikeAlert'){
	    	var message = '<div class="text-center"><strong>Tienes items en tu carrito, procede a completar la compra de los items en tu carrito o limpialo antes de continuar con la reserva de esta moto.</strong></div>';
	        Flash.create('danger', message);
	   	}else if (m == 'cartTireAlert'){
	    	var message = '<div class="text-center"><strong>Tienes items de otras categorias en tu carrito, procede a completar la compra de los items en tu carrito o limpialo antes de continuar con la compra de este caucho.</strong></div>';
	        Flash.create('danger', message);
	    };   

    };




}]);