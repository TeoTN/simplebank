(function(){
	"use strict";
	
	var dependencies = [
		'sbank.controllers',
		'sbank.directives',
		'sbank.services'
	];

	angular
		.module('sbank', dependencies);

	angular
		.module('sbank.controllers', [])
		.module('sbank.directives', [])
		.module('sbank.services', []);
})();