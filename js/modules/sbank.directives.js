(function() {
	"use strict";
	angular
		.module('sbank.controllers')
		.directive('navbar', navbar);
	
		function navbar() {
			return {
				restrict: 'E',
				templateUrl: '/views/navbar.html',
				controller: 'NavbarController',
				controllerAs: 'vm'
			};
		}
})();