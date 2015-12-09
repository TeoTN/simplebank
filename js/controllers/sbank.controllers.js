(function() {
	"use strict";
	angular
		.module('sbank.controllers')
		.controller('NavbarController', NavbarController)
		.controller('LoginFormController', LoginFormController)
		.controller('WelcomePageController', WelcomePageController)
		.controller('AccountsController', AccountsController);
	
		NavbarController.$inject = ['$scope', '$rootScope', 'Auth', 'EVENTS'];
		function NavbarController($scope, $rootScope, Auth, EVENTS) {
			$scope.authenticated = Auth.is_logged_in();
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

		AccountsController.$inject = ['$scope', 'Account'];
		function AccountsController($scope, Account) {
			$scope.account_list = [];
			$scope.errors = [];
			Account
				.list()
				.then(function(result){
					$scope.account_list = result;
				}, function(error){
					$scope.errors.push(error);
				});
		}
})();