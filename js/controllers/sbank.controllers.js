(function() {
	"use strict";
	angular
		.module('sbank.controllers')
		.controller('NavbarController', NavbarController)
		.controller('LoginFormController', LoginFormController)
		.controller('WelcomePageController', WelcomePageController)
		.controller('AccountsController', AccountsController);
	
		NavbarController.$inject = ['$scope', '$rootScope', 'EVENTS'];
		function NavbarController($scope, $rootScope, EVENTS) {
			$scope.authenticated = false;
			$rootScope.$on(EVENTS.SIGNIN, function(event, data) {
				$scope.authenticated = true;
			});
			$rootScope.$on(EVENTS.LOGOUT, function(event, data) {
				$scope.authenticated = false;
			});
		}

		LoginFormController.$inject = ['$scope', '$location', 'Auth']
		function LoginFormController($scope, $location, Auth) {
			var vm = this;
			$scope.user = {
				id: "",
				password: ""
			}
			$scope.errors = [];

			vm.login = function() {
				$scope.errors = [];
				Auth
					.login($scope.user.id, $scope.user.password)
					.then(function(id) {
						$location.path("/accounts/");
					},
					function(error) {
						$scope.errors.push(error);
					});

			};
		}

		function WelcomePageController() {}

		AccountsController.$inject = ['$scope'];
		function AccountsController($scope) {

		}
})();