/**
 * Created by admin on 6/22/2018.
 */
angular.module('webApp.controllers')
    .controller('vehicleCtrl',['$scope','vehicleService','colors','vehicle','$state',function($scope,vehicleService,colors,vehicle,$state){
        $scope.vehicle = vehicle;
        $scope.vehicle1 = {};
        $scope.colors =colors;
        $scope.savevehicle = function(){
            console.log("vehicle1",$scope.vehicle1);
            vehicleService.save($scope.vehicle1).success(function (res) {
                if(res) {
                    $scope.vehicle1 = {};
                    $state.go('vehicles');
                }
            });
        }
    }])