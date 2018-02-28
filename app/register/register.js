'use strict';

angular.module('exporta.register', ['ngRoute', 'service.module'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/registro', {
    templateUrl: 'app/register/register.html',
    controller: 'RegisterCtrl',
    controllerAs : 'registerCtrl'
  })
}])


.controller('RegisterCtrl', ['$http', '$rootScope', '$routeParams', '$scope','$location', '$route', 'CurrentData', function($http, $rootScope, $routeParams, $scope, $location, $route, CurrentData) {
	var registerCtrl = this;

	// Meta tags
	$rootScope.robot = mRegisterRobot;
	$rootScope.pageTitle = mRegisterTitle;
	$rootScope.pageDescription = mMainPageDescription;
	$rootScope.ogPageDescription = mMainOgPageDescription;
	$rootScope.ogPageImage = mMainOgPageImage;
	$rootScope.ogPageTitle = mMainOgPageTitle;
	$rootScope.url = $location.absUrl();
	$rootScope.twitterDescription = mMainTwitterDescription;
	$rootScope.twitterImage = mMainTwitterImage;


	registerCtrl.countries = mCountries;


	// On controller loaded
    $scope.$on('$viewContentLoaded', function() {
		
	});

    // On controller destroy
   	$scope.$on("$destroy", function(){


	});

   	// Dismiss modal if there is any
   	$('#login-modal').modal('hide');



	if (mCurrentUser != null) {

		$location.url('/perfil');

	};


	this.singUp = function(){

		// Google analytics tracking
		// _gaq.push(['_trackEvent', 'Buttons', 'SignUp', 'Registro normal']); 

		// Facebook event
		// fbq('track', 'CompleteRegistration');

		// Mixpanel tracking
		// if (mainController.loginSource == 'promo') {
		// 	mixpanel.track('Registro', {
		// 		'method': 'email',
		// 		'source': 'promo'
		// 	});
		// }else if (mainController.loginSource == 'promo2') {
		// 	mixpanel.track('Registro', {
		// 		'method': 'email',
		// 		'source': 'promo2'
		// 	});
		// }else{
		// 	mixpanel.track('Registro', {
		// 		'method': 'email',
		// 		'source': 'general'
		// 	});
		// };

		registerCtrl.signingUp = true;

		var UserName = registerCtrl.singUpForm.email.toLowerCase();
		var UserEmail = registerCtrl.singUpForm.email.toLowerCase();
		var UserPass = registerCtrl.singUpForm.password;
		var UserFirstName = registerCtrl.singUpForm.firstName.toLowerCase();
		var UserLasName = registerCtrl.singUpForm.lastName.toLowerCase();
		var UserCountry = registerCtrl.singUpForm.country.toLowerCase();
		var UserPhone = registerCtrl.singUpForm.phone;


		var user = new Parse.User();
		user.set("username", UserName);
		user.set("password", UserPass);
		user.set("email", UserEmail);
		user.set("firstName", UserFirstName);
		user.set("lastName", UserLasName);
		user.set("country", UserCountry);
		user.set("phone", UserPhone);

		user.signUp(null).then(function(user){

		// 	Parse.Cloud.run('sendWelcomeEmail', 
  // 				{ 
  // 					userName: Capitalize(UserFirstName),
  // 					userEmail: UserEmail
  // 				})

		// }).then(function(data){

			// mCurrentUser = Parse.User.current();
			// angular.element($('#wrapper')).scope().mainCtrl.newRegisterUser();
			// angular.element($('#wrapper')).scope().$apply();

		  	// Hide loading
		  	// $.fancybox.close( true );
		  	window.location.reload();


		},function(error){

			registerCtrl.signingUp = false;
			registerCtrl.singUpForm.email = null;
			registerCtrl.singUpForm.password = null;
			// $.fancybox.close( true );

		    if (error.code == 202) {
		    	alert("Esto es raro!!, ese email ya ha sido utilizado, escoge otro por favor.");
		    	// alert("Que casualidad!!, el nombre de usuario ya ha sido utilizado, escoge otro por favor.");
		    }else if(error.code == 203){
		    	alert("Esto es raro!!, ese email ya ha sido utilizado, escoge otro por favor.");
		    }else{
		    	alert("Error: " + error.code + " " + error.message);
		    };

		});
	};


}]);