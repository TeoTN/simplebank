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
		.run(run)
        .constant("EVENTS",  {
            "SIGNIN": "sign-in",
            "LOGOUT": "log-out"
        });

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
            .when('/login/', {
                templateUrl: '/views/login_form.html',
                controller: 'LoginFormController',
                controllerAs: 'vm',
                redirectAuth: '/accounts/'
            })
            .when('/accounts/', {
                templateUrl: '/views/accounts.html',
                controller: 'AccountsController',
                controllerAs: 'vm',
            })
            .when('/transfers/', {
                templateUrl: '/views/transfers.html',
                controller: 'TransfersController',
                controllerAs: 'vm',
            })
            .when('/transfers/new/', {
                templateUrl: '/views/new_transfer.html',
                controller: 'NewTransferController',
                controllerAs: 'vm',
            })
            .when('/logout/', {
                templateUrl: '/views/accounts.html',
                controller: ['Auth', function(Auth) {
                    Auth.logout();
                }],
            })
            .when('/notfound/', {
                templateUrl: '/views/notfound.html',
            })
            .otherwise({
                redirectTo: '/'
            });
           
        $locationProvider.html5Mode(true).hashPrefix('!');
    }
    
    function run($rootScope, $cookies, $location) {
        $rootScope.$on( "$routeChangeStart", function(event, next, current) {
            var username = $cookies.get('user');
            if ( !username && next.requireAuth) {
                $location.path('/');
            }
            if (username && next.redirectAuth) {
                $location.path(next.redirectAuth);
            }
        });
    }
})();
