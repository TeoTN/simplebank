(function() {
	"use strict";
	angular
		.module('sbank.controllers')
		.controller('NavbarController', NavbarController)
		.controller('LoginFormController', LoginFormController)
		.controller('WelcomePageController', WelcomePageController)
		.controller('AccountsController', AccountsController);
	
		function NavbarController() {}

		LoginFormController.$inject = ['$scope', 'Auth']
		function LoginFormController($scope, Auth) {
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
						console.log("Zalogowany");
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