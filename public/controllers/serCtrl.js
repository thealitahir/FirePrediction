/**
 * Created by admin on 5/29/2018.
 */
angular.module('webApp.controllers')
    .controller('serCtrl', ['$scope','services','serService','$state', function ($scope,services,serService,$state) {
        $scope.services = services;
        console.log(services);
        $scope.editServices= function(id,action){
            if(action == 'edit')
                $state.go("serviceEdit",{serviceId:id});
            else if(action == 'remove'){
                var confirmation = confirm("Are you sure ? Service will be deleted permanently");
                if(confirmation == true) {
                    serService.deleteService(id).success(function (res) {
                        var ser_index = _.indexOf($scope.ser, {_id: id});
                        $scope.services.splice(ser_index, 1);
                    });
                }
            }
            else if (action == 'add'){
                $state.go("serviceAdd");
            }
        };
    }])
    .controller('serviceEditCtrl', ['$scope','service','serService','$state', function ($scope,service,serService,$state) {
        $scope.editMode = true;
        $scope.service=service;
        console.log(service);
        $scope.saveService = function() {
            console.log("in edit service");
            serService.update($scope.service).success(function (res) {
                $state.go('services');
            });
        }
    }])
    .controller('serviceAddCtrl',['$scope','serService','$state',function($scope,serService,$state){
        $scope.service = {
            service_name: '',
            service_detail: '',
            service_price: '',
            service_image:''
        };
        console.log($scope.service);
        console.log($scope.service_image);
        $scope.saveService = function(){
            console.log("in add service");
            serService.save($scope.service).success(function (res) {
                $state.go("services");
            });
        }
    }])