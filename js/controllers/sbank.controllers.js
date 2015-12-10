(function() {
	"use strict";
	angular
		.module('sbank.controllers')
		.controller('NavbarController', NavbarController)
		.controller('LoginFormController', LoginFormController)
		.controller('WelcomePageController', WelcomePageController)
		.controller('AccountsController', AccountsController)
		.controller('TransfersController', TransfersController)
		.controller('NewTransferController', NewTransferController);

	NavbarController.$inject = ['$scope', '$rootScope', 'Auth', 'EVENTS'];
	function NavbarController($scope, $rootScope, Auth, EVENTS) {
		$scope.authenticated = Auth.is_logged_in();
		$rootScope.$on(EVENTS.SIGNIN, function(event, data) {
			$scope.authenticated = true;
		});
		$rootScope.$on(EVENTS.LOGOUT, function(event, data) {
			$scope.authenticated = false;
		});
		var main = $("main");
		var main_height = main.height();
		var screen_height = $(window).height();
		if (main_height < screen_height) {
			main.height(screen_height-50);
		}
		$("footer").offset({top: main.position().top+main.height()});
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
		var vm = this;
		$scope.account_list = [];
		$scope.errors = [];
		Account
			.cached_list_by_user()
			.then(function(result){
				$scope.account_list = result;
			}, function(error){
				$scope.errors.push(error);
			});
	}

	NewTransferController.$inject = ['$scope', '$routeParams', '$location', 'Account', 'Transfer'];
	function NewTransferController($scope, $routeParams, $location, Account, Transfer) {
		var vm = this;
		$scope.account_list = [];
		$scope.errors = [];
		$scope.transfer = {
			recipent: {
				name: '',
				account: '',
			},
			title: '',
			amount: 0.00,
			from: parseInt($routeParams.account_id)
		}
		
		Account
			.cached_list_by_user()
			.then(function(result){
				$scope.account_list = result;
			}, function(error){
				$scope.errors.push(error);
			});
		
		vm.make_transfer = function(transfer) {
			transfer.from = $scope.account_list.filter(function(e) { return e.id == transfer.from})[0];
			Transfer.make_transfer(transfer);
			$location.path("/transfers/");
		}
	}

	TransfersController.$inject = ['$scope', 'Transfer'];
	function TransfersController($scope, Transfer) {
		$scope.transfers = Transfer.list();
	}
})();