/**
 * Created by admin on 6/22/2018.
 */
angular.module('webApp.services').factory('vehicleService',['$http',function ($http) {

    return {

        getAllvehicles: function(){
            var url='/getallVehicleCompany';
            return $http.get(url);
        },
        save:function(data){
            var url='/setVehicleModel';
            return $http.post(url,data);
        },
        getallmodels: function(){
            var url='/getallmodels';
            return $http.get(url);
        }
    }

}]);