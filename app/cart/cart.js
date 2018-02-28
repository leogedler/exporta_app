'use strict';

angular.module('exporta.cart', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/carrito', {
    templateUrl: 'app/cart/cart.html',
    controller: 'CartCtrl',
    controllerAs : 'cartCtrl'
  })
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/carrito/:route', {
    templateUrl: 'app/cart/cart.html',
    controller: 'CartCtrl',
    controllerAs : 'cartCtrl'
  })
}])



.controller('CartCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', 'Flash', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData, Flash) {
	var cartCtrl = this;
	cartCtrl.cart = false;
	cartCtrl.checkout = false;
	cartCtrl.checkout2 = false;
	cartCtrl.removingFromCart = false;
	cartCtrl.noItems = false;
	cartCtrl.countrySelected = false;
	cartCtrl.order = {};
	cartCtrl.countries = [];
	cartCtrl.destCountry = {};

	cartCtrl.autoColor = [
		'Blanco',
		'Negro',
		'Gris',
		'Rojo',
		'Otro'
	];

	cartCtrl.bikeColor = [
		'Blanco',
		'Negro',
		'Rojo',
		'Otro'
	];



	// Check the route
	if ($routeParams.route) {
		cartCtrl.route = $routeParams.route;
		if(cartCtrl.route == 'checkout'){
			cartCtrl.checkout = true;
			cartCtrl.checkout2 = true;
		}else{
			$location.url('/carrito');	
		};
	}else{	
		cartCtrl.cart = true;
		cartCtrl.route = 'productos';
	};

	// Meta tags
	$rootScope.robot = mCartRobot;
	$rootScope.pageTitle = mCartTitle +' | '+ Capitalize(cartCtrl.route);
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
			cartCtrl.user = response;

			// Add items quantities
			cartCtrl.cartItemsSetting(cartCtrl.user.cart);

			// Checking if there are videos
	    	if (cartCtrl.user.cart.length == 0) {
	    		// No items
	    		cartCtrl.noItems = true;

	    		// Go back to cart if there aren't products in the cart
	    		if (cartCtrl.route == 'checkout') {
	    			$location.url('/carrito');
	    		};

	    	}else{

	    		// Checking categories
	    		if (cartCtrl.user.cart[0].category == 'tires') {
	    			cartCtrl.tireItem = true;
	    			cartCtrl.vehicleItem = false;
	    			cartCtrl.countries = cartCtrl.user.cart[0].countries;
	    			cartCtrl.order.category = 'tires';
	    		}else{
	    			cartCtrl.vehicleItem = true;
	    			cartCtrl.tireItem = false;
	    			cartCtrl.countries = cartCtrl.user.cart[0].countries;
	    			cartCtrl.order.category = 'vehicle';
	    		};
	    	};

		});

	}else{
		$location.url('/');
	};


	this.removeFromCart = function(id, cat){

		cartCtrl.removingFromCart = true;

		// Pointer
		var item = {
			cart: {
				__op:"Remove",
				objects:[
	    			{
					__type: "Pointer",
					className: Capitalize(cat),
					objectId: id
					}
				]	
			}
		};

		// Removing item from cart array 
		$http({
    		method : 'PUT', 
			headers: mUpdateUserHeaderJson,
			data: item,
    		url : apiUrl+'/users/'+cartCtrl.user.objectId
    		}).success(function(data){

    			// Clear user data
				CurrentData.clearCurrentUser();

				// Refresh main controller user
				angular.element($('#all')).scope().mainCtrl.refreshUser();

				// Refresh user info
				CurrentData.getCurrentUser().then(function(response){
					cartCtrl.user = response;

					cartCtrl.removingFromCart = false;

					// Add items quantities
					cartCtrl.cartItemsSetting(cartCtrl.user.cart);

					// Flash message
					cartCtrl.flashMessage('cartRemoved');

					// Checking if there are products
			    	if (cartCtrl.user.cart.length == 0) {
			    		// No items
			    		cartCtrl.noItems = true;
			    	};

				});
			});
	}

	this.getTotal = function(cart){

		cartCtrl.totalOrder = 0;

		for (var i = cart.length - 1; i >= 0; i--) {
			var product = cart[i];

			if (cartCtrl.vehicleItem) {
				cartCtrl.totalOrder += (product.price + cartCtrl.destCountry.fee);
			}else{
				cartCtrl.totalOrder += (product.quantity*product.price) + (product.quantity*cartCtrl.destCountry.fee);
			};
		};
	}

	this.cartItemsSetting = function(items){

		for (var i = items.length - 1; i >= 0; i--) {
			var product = items[i];
			if (!product.quantity) product.quantity = 1;
			if (!product.discount) product.discount = 0;
			if (product.category != 'tires') {
				console.log('no tires');
				if (!product.wishColor) product.wishColor = 'Otro';
			}else{
				product.wishColor = 'no aplica';
			};
		};

		// Add item total price
		cartCtrl.getTotal(items);
	}

	this.goToCheckOut = function(){

		// Save itemes
		CurrentData.saveCartItems(cartCtrl.user.cart);

		$location.url('carrito/checkout');
	}


	this.placeAnOrder = function(){

		cartCtrl.lead = {};
		cartCtrl.lead.address = {};
		cartCtrl.lead.custom_fields = {};


		// User pointer
		cartCtrl.order.user = {
			__type: "Pointer",
			className: "_User",
			objectId: cartCtrl.user.objectId
		};

		// User data
		cartCtrl.order.userId = cartCtrl.user.objectId;
		cartCtrl.order.userFirstName = cartCtrl.user.firstName.toLowerCase();
		cartCtrl.order.userLastName = cartCtrl.user.lastName.toLowerCase();
		cartCtrl.order.userEmail = cartCtrl.user.email.toLowerCase();
		cartCtrl.order.userPhone = cartCtrl.user.phone.toLowerCase();
		cartCtrl.order.userCountry = cartCtrl.user.country.toLowerCase();
		cartCtrl.order.userAddress = cartCtrl.user.address;

		// Lead info
		cartCtrl.lead.first_name = cartCtrl.user.firstName.toLowerCase();
		cartCtrl.lead.last_name = cartCtrl.user.lastName.toLowerCase();
		cartCtrl.lead.phone = cartCtrl.user.phone.toLowerCase();
		cartCtrl.lead.email = cartCtrl.user.email.toLowerCase();
		cartCtrl.lead.organization_name = "Web page";
		cartCtrl.lead.status = "New";
  		cartCtrl.lead.title = "Cliente web";
  		cartCtrl.lead.description = "Lead de la página web";
  		cartCtrl.lead.address.country = cartCtrl.user.country.toLowerCase();
		cartCtrl.lead.custom_fields.userId = cartCtrl.user.objectId;
		cartCtrl.lead.custom_fields.webCategory = cartCtrl.user.cart[0].category;


		// Order data
		cartCtrl.order.totalOrder = cartCtrl.totalOrder;
		
	    // Checking categories
		if (cartCtrl.vehicleItem) {
			cartCtrl.order.category = 'vehicle';
			cartCtrl.order.status = "por contactar"; 
			cartCtrl.order.paid = false;
			cartCtrl.order.remainingToPay = cartCtrl.totalOrder;
			cartCtrl.order.totalPaid = 0;

			// Send email to client who rgistered an auto or bike order
			cartCtrl.sendOrderRegisteredEmail();
	
		}else{
			cartCtrl.order.category = 'tires';
			cartCtrl.order.status = "pagado"; 
			cartCtrl.order.paid = true;
			cartCtrl.order.remainingToPay = 0;
			cartCtrl.order.totalPaid = cartCtrl.totalOrder;
		};


		cartCtrl.order.items = [];
		cartCtrl.order.orderData = [];

		for (var i = cartCtrl.user.cart.length - 1; i >= 0; i--) {
			var item = cartCtrl.user.cart[i];
			var pointer = {
				__type: "Pointer",
				className: Capitalize(item.category),
				objectId: item.objectId
			};

			var paid, reservationPrice, remainingToPay, price, destFee  = 0;
			if (cartCtrl.vehicleItem) {
				// paid = item.reservationPrice * item.quantity;
				paid = 0;
				reservationPrice = item.reservationPrice;
				price = item.price;
				destFee = cartCtrl.order.destFee;
				// remainingToPay = item.price - item.reservationPrice;
				remainingToPay = price + destFee;
			}else{
				// paid = item.price * item.quantity;
				paid = 0;
				reservationPrice = 0;
				price = item.price;
				destFee = cartCtrl.order.destFee;
				remainingToPay = price + destFee;

			};

			var orderData = {
				objectId: item.objectId,
				className: Capitalize(item.category),
				quantity: item.quantity,
				wishColor: item.wishColor,
				price : price,
				destFee : destFee,
				reservationPrice: reservationPrice,
				paid: paid,
				remainingToPay: remainingToPay,
				discount : item.discount
			};

			cartCtrl.order.items.push(pointer);	
			cartCtrl.order.orderData.push(orderData);
		};


		// Placing order
		$http({
    		method : 'POST', 
			headers: mPostPutHeaderJson,
			data: cartCtrl.order,
    		url : apiUrl+'/classes/Orders'

    		}).then(function(response){

    			// Order id for lead info
    			cartCtrl.lead.custom_fields.orderLink = 'http://52.39.0.23/admin/ordenes?id='+response.data.objectId;

    			// Registering lead in getBase
    			return $http(
					{
					method: 'POST',
					headers: mPostPutHeaderJson,
					data: cartCtrl.lead,
					url: apiUrl+'/functions/createLead'
					});
    		
    		}).then(function(response){

    			// Cleaning cart array 
				return $http({
		    		method : 'PUT', 
					headers: mUpdateUserHeaderJson,
					data: {
						'cart':[]
					},
		    		url : apiUrl+'/users/'+cartCtrl.user.objectId
		    		});	

			}).then(function(data){

				// Clear user data
				CurrentData.clearCurrentUser();

				// Refresh main controller user
				angular.element($('#all')).scope().mainCtrl.refreshUser();

				// Go to orders
				$location.url('perfil/ordenes');

			});




		// // Placing order
		// $http({
  //   		method : 'POST', 
		// 	headers: mPostPutHeaderJson,
		// 	data: cartCtrl.order,
  //   		url : apiUrl+'/classes/Orders'

  //   		}).success(function(response){

  //   			// Order id for lead info
  //   			cartCtrl.lead.custom_fields.orderLink = 'http://52.39.0.23/admin/ordenes?id='+response.objectId;

  //   			// Registering lead in getBase
		// 		$http(
		// 			{
		// 			method: 'POST',
		// 			headers: mPostPutHeaderJson,
		// 			data: cartCtrl.lead,
		// 			url: apiUrl+'/functions/createLead'
		// 			}).success(function(response){});

  //   			// Cleaning cart array 
		// 		$http({
		//     		method : 'PUT', 
		// 			headers: mUpdateUserHeaderJson,
		// 			data: {
		// 				'cart':[]
		// 			},
		//     		url : apiUrl+'/users/'+cartCtrl.user.objectId
		//     		}).success(function(data){
		    			
		//     			// Clear user data
		// 				CurrentData.clearCurrentUser();

		// 				// Refresh main controller user
		// 				angular.element($('#all')).scope().mainCtrl.refreshUser();

		// 				// Go to orders
		// 				$location.url('perfil/ordenes');

		//     		});

  //   		});



	};

	this.selectCountry = function(){
		cartCtrl.order.destCountry = cartCtrl.destCountry.country;
		cartCtrl.order.destFee = cartCtrl.destCountry.fee;
		cartCtrl.getTotal(cartCtrl.user.cart);
		cartCtrl.countrySelected = true;
	};




	this.goToCheckOut3 = function(){
		cartCtrl.checkout2 = false; 
		cartCtrl.checkout3 = true

		if (cartCtrl.tireItem) {

			paypal.Button.render({
		    
		        env: 'sandbox', // Optional: specify 'sandbox' environment
		    
		        client: {
					sandbox: 'AXbubGBcL4KilJA1Gc1nTULxoufziCqc-PgKReJb8tslzt0eXwi6K1cm5C54qrPPhWe1UnMb-9ZUnb9Z',
		            // sandbox:    'AUD09lTvCZiZjs45gTk5ZCkB2d3GiKBXaEzL9583JuBBkE6G0jD2Dn9RgQBlO1MHq8NRtcbmX6_H0a_C',
		            production: 'AQqiKrNO8ezRiFKSiy71XJEz6VEJNPsMs7edfBzsZOjQlbrYum3lsREbWswfMdbEsNk4WaoL3DyaoOWa'
		        },

		        payment: function() {
		        
		            var env    = this.props.env;
		            var client = this.props.client;
		        
		            return paypal.rest.payment.create(env, client, {
		                transactions: [
		                    {
		                        amount: { total: cartCtrl.totalOrder, currency: 'USD' }
		                    }
		                ]
		            });
		        },

		        commit: true, // Optional: show a 'Pay Now' button in the checkout flow

		        onAuthorize: function(data, actions) {
		        		        
		            return actions.payment.execute().then(function() {
		                
						console.log('Paypal data', data);

		                // Place the order
		                cartCtrl.placeAnOrder();

						// Send email to client
						cartCtrl.sendTiresBuyedEmail(data.paymentID);

		            });
		        },

		        onCancel: function(data){

		        	console.log('cancel payment');
		        }

		    }, '#paypal-button');
		};
	};

	this.sendOrderRegisteredEmail = function(){

		// Client data
		var clientData = {}
		clientData.clientEmail = cartCtrl.user.email;
		clientData.clientName = Capitalize(cartCtrl.user.firstName + cartCtrl.user.lastName);

		// Send invitation email to friend
		$http({
			method : 'POST', 
			headers: mPostPutHeaderJson,
			data: clientData,
			url : apiUrl+'/functions/sendOrderRegisteredEmail'

			}).success(function(data){

				console.log(data);

			});
	};

	this.sendTiresBuyedEmail = function(paymentID){

		// Client data
		var clientData = {}
		clientData.clientEmail = cartCtrl.user.email;
		clientData.clientName = Capitalize(cartCtrl.user.firstName + cartCtrl.user.lastName);
		clientData.totalPrice = cartCtrl.totalOrder;
		clientData.confirmationCode = paymentID;

		// Send invitation email to friend
		$http({
			method : 'POST', 
			headers: mPostPutHeaderJson,
			data: clientData,
			url : apiUrl+'/functions/sendTiresBuyedEmail'

			}).success(function(data){

				console.log(data);

			});
	};


	this.flashMessage = function (m) {
		if (m == 'cartRemoved') {
	    	var message = '<div class="text-center"><strong>Removido de tu carrito de compras!</strong></div>';
	        Flash.create('danger', message);
	    };

    };




}]);