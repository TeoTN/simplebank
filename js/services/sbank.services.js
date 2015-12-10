(function() {
	"use strict";
	angular
		.module('sbank.services')
		.factory('User', User)
		.factory('Auth', Auth)
		.factory('Account', Account);
	
	Auth.$inject = ['$q', '$cookies', '$location', '$rootScope', 'User', 'EVENTS']
	function Auth($q, $cookies, $location, $rootScope, User, EVENTS) {
		return {
			login: login,
			logout: logout,
			is_logged_in: is_logged_in
		};

		function is_logged_in() {
			return !!$cookies.get("user");
		}

		function login(id, password) {
			var loginDeferred = $q.defer();
			var retrieveUserPromise = User.retrieve(id);
			retrieveUserPromise.then(function(user) {
				if (sha1(password) == user.password) {
					$cookies.putObject('user', user);
					$rootScope.$broadcast(EVENTS.SIGNIN, {
						user: user
					});
					loginDeferred.resolve(id);
				}
				else {
					$cookies.remove('user');
					loginDeferred.reject("Nieprawidłowe hasło");
				}
			},
			function(error) {
				loginDeferred.reject(error);
			});

			return loginDeferred.promise;
		}

		function logout() {
			$cookies.remove('user');
			$cookies.remove('accounts');
			$rootScope.$broadcast(EVENTS.LOGOUT, {});
			$location.path("/");
		}
	}

	User.$inject = ['$http', '$q'];
	function User($http, $q) {
		var userlist = [];

		return {
			list: list,
			retrieve: retrieve
		}

		function list() {
			var deferred = $q.defer();

			if (userlist.length > 0) {
				deferred.resolve(userlist);
			}
			else {
				$http
					.get("/data/users.json")
					.then(function(response) {
						deferred.resolve(response.data);
					}, function(error) {
						deferred.reject(error);
					});
			}
			return deferred.promise;
		}

		function retrieve(id) {
			var deferred = $q.defer();
			list().then(function(response) {
				var user = response.filter(function(e) {
					return e.id == id;
				});

				if (user.length == 1) {
					deferred.resolve(user[0]);
				}
				else if (user.length == 0) {
					deferred.reject("Użytkownik nie istnieje.");
				}
				else {
					deferred.reject("Istnieje kilku użytkowników o tym id.");
				}
			});

			return deferred.promise;
		}
	}

	Account.$inject = ['$http', '$cookies', '$q']
	function Account($http, $cookies, $q){
		var account_list = [];
		return {
			list: list,
			make_transfer: make_transfer,
			cached_list_by_user: cached_list_by_user
		};

		function list(){
			var deferred = $q.defer();
			if(account_list.length > 0){
				deferred.resolve(account_list);
			}
			else {
				$http
					.get('/data/accounts.json')
					.then(function(response){
						deferred.resolve(response.data);
					},function(error){
						deferred.reject(error);
					});
			}
			return deferred.promise;
		}

		function list_by_user(user_id) {
			var deferred = $q.defer();
			list().then(function(response) {
				var by_user = response.filter(function(e) {
					return e.user == user_id;
				});

				if (by_user.length > 0) {
					deferred.resolve(by_user);
				}
				else {
					deferred.reject("Użytkownik nie ma kont.");
				}
			});

			return deferred.promise;
		}

		function cached_list_by_user() {
			var deferred = $q.defer();
			var user = $cookies.getObject('user');
			var cached = $cookies.getObject('accounts');
			if (user === undefined) {
				deferred.reject("Nie zalogowano");
			}
			else if (cached === undefined) {
				list_by_user(user.id).then(function(accounts) {
					$cookies.putObject('accounts', accounts);
					deferred.resolve(accounts);
				}, deferred.reject);
			}
			else {
				deferred.resolve(cached);
			}
			return deferred.promise;
		}

		function make_transfer(account, amount) {
			var accounts = $cookies.getObject('accounts');
			for (var i in accounts) {
				if (accounts[i].id == account.id) {
					account.balance += amount;
					account.amount -= amount;		
					accounts[i] = account;
				}
			}
			$cookies.putObject('accounts', accounts);
		}
	} 
})();