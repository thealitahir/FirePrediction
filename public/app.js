/**
 * Created by admin on 5/21/2018.
 */


'use strict';

var webApp = angular.module('webApp',[
    'ui.router',
    'ui.bootstrap',
    'webApp.services',
    'webApp.directives',
    'webApp.filters',
    'webApp.controllers',
    'ngSanitize',
    'ui.select',
    'ngMap'
])
    .run(
    [          '$rootScope', '$state', '$stateParams','userService','notifyService',
        function ($rootScope,   $state,   $stateParams,userService,notifyService) {
            // It's very handy to add references to $state and $stateParams to the $rootScope
            // so that you can access them from any scope within your application.For example,
            // <li ng-class="{ active: $state.includes('contacts.list') }"> will set the <li>
            // to active whenever 'contacts.list' or one of its decendents is active.


            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.showMessage=true;
            $rootScope.message="";


            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    notifyService.showLoading();

                }
            );
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams){
                    notifyService.hideLoading();
                })

        }
    ])
    .config(['$stateProvider', '$urlRouterProvider',
        function ($stateProvider,   $urlRouterProvider ) {
            $urlRouterProvider.otherwise("/firePredictor");
            $stateProvider
                .state("firePredictor",{
                    url : "/firePredictor",
                    templateUrl : "/partials/firePredictor/firePredictor.html",
                    controller : 'firePredictorCtrl'
                })
                .state("users",{
                    url : "/users",
                    templateUrl : "/partials/users/userList.html",
                    resolve : {
                        users : ['userService', function (userService) {
                            return userService.getAllUsers().then(function (res) {
                                return res.data.data;
                            });
                        }]
                    },
                    controller : 'usersCtrl'
                })

                .state("vendors",{
                    url : "/vendors",
                    templateUrl : "/partials/vendors/vendorList.html",
                    resolve : {
                        vendors : ['vendorService', function (vendorService) {
                            return vendorService.getAllvendors().then(function (res) {
                                console.log(res.data.data);
                                return res.data.data;
                            });
                        }]
                    },
                    controller : 'vendorsCtrl'
                })

                .state("services",{
                    url : "/service",
                    templateUrl : "/partials/ser/ser.html",
                    resolve : {
                        services : ['serService', function (serService) {
                            return serService.getAllServices().then(function (res) {
                                console.log(res.data.data);
                                return res.data.data.array;
                            });
                        }]
                    },
                    controller : 'serCtrl'
                })
                .state("serviceAdd",{
                    url : "/service/add",
                    templateUrl : "/partials/ser/addSer.html",
                    controller : 'serviceAddCtrl'
                })
                .state("serviceEdit",{
                    url : "/service/:serviceId",
                    templateUrl : "/partials/ser/addSer.html",
                    resolve : {
                        service : ['serService','$stateParams', function (serService,$stateParams) {
                            console.log($stateParams.serviceId)
                            return serService.getService($stateParams.serviceId).then(function (res) {
                                console.log(res.data.data);
                                return res.data.data;
                            });
                        }]
                    },
                    controller : 'serviceEditCtrl'
                })
                .state("vehicles",{
                    url : "/vehicle",
                    templateUrl : "/partials/vehicles/vehicles.html",
                    resolve : {
                        vehicle : ['vehicleService', function (vehicleService) {
                            return vehicleService.getAllvehicles().then(function (res) {
                                console.log(res.data.data);
                                return res.data.data;
                            });
                        }],
                        colors:['vehicleService',function(vehicleService){
                            return vehicleService.getallmodels().then(function(res){
                                console.log(res.data.data);
                                return res.data.data;
                            })
                        }]

                    },
                    controller : 'vehicleCtrl'
                })
        }]);
angular.module('webApp.controllers',['ui.router','ngAnimate']);
angular.module('webApp.services',[]);
angular.module('webApp.directives',[]);
angular.module('webApp.filters',[]);

