'use strict';

angular.module('mokars.static', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/nosotros', {
    templateUrl: 'app/static/static.html',
    controller: 'StaticCtrl',
    controllerAs : 'staticCtrl'
  })
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pasos-para-la-compra', {
    templateUrl: 'app/static/static.html',
    controller: 'StaticCtrl',
    controllerAs : 'staticCtrl'
  })
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/vehiculos-como-parte-de-pago', {
    templateUrl: 'app/static/static.html',
    controller: 'StaticCtrl',
    controllerAs : 'staticCtrl'
  })
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/referidos', {
    templateUrl: 'app/static/static.html',
    controller: 'StaticCtrl',
    controllerAs : 'staticCtrl'
  })
}])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/contacto', {
    templateUrl: 'app/static/static.html',
    controller: 'StaticCtrl',
    controllerAs : 'staticCtrl'
  })
}])


.controller('StaticCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var staticCtrl = this;
	staticCtrl.aboutUs = false;
	staticCtrl.steps = false;
	staticCtrl.autoPayment = false;
	staticCtrl.referral = false;
	staticCtrl.contact = false;
	staticCtrl.faq = false;
	staticCtrl.conditions = false;

	staticCtrl.contactForm = {};
	staticCtrl.countries = mCountries;
	staticCtrl.formSent = false;
	staticCtrl.sendingForm = false;	


	// Check the route
	if($location.path() == '/nosotros'){
		staticCtrl.aboutUs = true;
		staticCtrl.title = "Sobre Nosotros";
	}else if($location.path() == '/pasos-para-la-compra'){
		staticCtrl.steps = true;
		staticCtrl.title = "Pasos para la compra";
	}else if ($location.path() == '/vehiculos-como-parte-de-pago'){
		staticCtrl.autoPayment = true;
		staticCtrl.title = "Vehículos como parte de pago";
	}else if ($location.path() == '/referidos'){
		staticCtrl.referral = true;
		staticCtrl.title = "Sistema de referidos";
	}else if ($location.path() == '/contacto'){
		staticCtrl.contact = true;
		staticCtrl.title = "Contacto";

		if (mCurrentUser != null) {

			CurrentData.getCurrentUser().then(function(response){
				staticCtrl.user = response;
				staticCtrl.contactForm.firstName = staticCtrl.user.firstName;
				staticCtrl.contactForm.lastName = staticCtrl.user.lastName;
				staticCtrl.contactForm.email = staticCtrl.user.email;
				staticCtrl.contactForm.country = staticCtrl.user.country;
				staticCtrl.contactForm.phone = staticCtrl.user.phone;

			});
		};

	}else if ($location.path() == '/preguntas'){
		staticCtrl.faq = true;
	}else if ($location.path() == '/condiciones'){
		staticCtrl.conditions = true;
	}


	// Meta tags
	$rootScope.robot = mStaticRobot;
	$rootScope.pageTitle = staticCtrl.title ;
	$rootScope.pageDescription = mMainPageDescription;
	$rootScope.ogPageDescription = mMainOgPageDescription;
	$rootScope.ogPageImage = mMainOgPageImage;
	$rootScope.ogPageTitle = mMainOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mMainTwitterDescription;
	$rootScope.twitterImage = mMainTwitterImage;


	this.sendContactForm = function(){

		staticCtrl.sendingForm = true;	

		staticCtrl.contactForm.firstName = staticCtrl.contactForm.firstName.toLowerCase();
		staticCtrl.contactForm.lastName = staticCtrl.contactForm.lastName.toLowerCase();
		staticCtrl.contactForm.email = staticCtrl.contactForm.email.toLowerCase();
		staticCtrl.contactForm.phone = staticCtrl.contactForm.phone.toLowerCase();
		staticCtrl.contactForm.country = staticCtrl.contactForm.country.toLowerCase();


		if (mCurrentUser != null) {
			staticCtrl.contactForm.user = {
						__type: "Pointer",
						className: "_User",
						objectId: staticCtrl.user.objectId
			}
		};

		// Sending contact
		$http({
    		method : 'POST', 
			headers: mPostPutHeaderJson,
			data: staticCtrl.contactForm,
    		url : apiUrl+'/classes/Contacts'

    		}).success(function(response){

    			staticCtrl.sendingForm = false;
    			staticCtrl.formSent = true;
    			staticCtrl.contactForm = {};


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


}]);
