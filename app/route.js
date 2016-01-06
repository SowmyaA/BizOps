// Routing for single page application
(function () {
    'use strict';
    var app = angular.module("HMSApp", ['ngRoute']);

    app.config(function ($routeProvider) {
        //Welcome page
        $routeProvider.when('/', {
            templateUrl: './app/Pages/WelcomePage.html',
            controller: 'WelcomePage'
        })
        //Product Summary
        $routeProvider.when('/ProductSummary', {
            templateUrl: './app/Pages/ProductSummary.html',
            controller: 'ProductSummary'
        })
        //Discpline Summary
        $routeProvider.when('/DisciplineSummary', {
            templateUrl: './app/Pages/DisciplineSummary.html',
            controller: 'DisciplineSummary'
        })
        //Role Summary
        $routeProvider.when('/RoleSummary', {
            templateUrl: './app/Pages/RoleSummary.html',
            controller: 'RoleSummary'
        })
                
  .otherwise({ redirectTo: '/' });

    });

})();