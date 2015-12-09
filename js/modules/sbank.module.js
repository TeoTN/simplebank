(function(){
	"use strict";
	
	var dependencies = [
		'sbank.controllers',
		'sbank.directives',
		'sbank.services',
		'ngCookies',
		'ngRoute'
	];

	angular
		.module('sbank', dependencies)
		.config(config)
		.run(run);

	angular.module('sbank.controllers', [])
	angular.module('sbank.directives', [])
	angular.module('sbank.services', []);

	config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/welcome_page.html',
                controller: 'WelcomePageController',
                controllerAs: 'vm',
                redirectAuth: '/accounts/'
            })
            .when('/profile/', {
                templateUrl: '/views/accounts.html',
                controller: 'AccountsController',
                controllerAs: 'vm',
            });
           
        $locationProvider.html5Mode(true);
    }
    
    function run($rootScope, $cookies, $location) {
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            var username = $cookies.get('username');
            if ( !username && next.requireAuth) {
                $location.path('/');
            }
            if (username && next.redirectAuth) {
                $location.path(next.redirectAuth);
            }
        });
    }

})();