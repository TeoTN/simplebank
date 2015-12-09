(function() {
	"use strict";
	angular
		.module('sbank.controllers')
		.directive('navbar', navbar)
		.directive('loginForm', loginForm);
	
		function navbar() {
			return {
				restrict: 'E',
				templateUrl: '/views/navbar.html',
				controller: 'NavbarController',
				controllerAs: 'vm'
			};
		}

		function loginForm() {
			return {
				restrict: 'E',
				templateUrl: '/views/login_form.html',
				controller: 'LoginFormController',
				controllerAs: 'vm'
			};
		}
})();