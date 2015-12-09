(function() {
	"use strict";
	angular
		.module('sbank.services')
		.factory('User', User)
		.factory('Auth', Auth);
	
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
			$rootScope.$broadcast(EVENTS.LOGOUT, {
				user: user
			});
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
})();