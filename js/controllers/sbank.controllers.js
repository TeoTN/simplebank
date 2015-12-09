(function() {
	"use strict";
	angular
		.module('sbank.controllers')
		.controller('NavbarController', NavbarController)
		.controller('WelcomePageController', WelcomePageController)
		.controller('AccountsController', AccountsController);
	
		function NavbarController() {}

		function WelcomePageController() {}

		AccountsController.$inject = ['$scope'];
		function AccountsController($scope) {
			
		}
})();