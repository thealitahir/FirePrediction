/**
 * Created by admin on 5/29/2018.
 */
angular.module('webApp.services').factory('serService',['$http',function ($http) {

    return {

        getAllServices: function(){
            var url='/getServices';
            return $http.get(url);
        },

        save : function(data) {
            console.log(data);
            var url = 'AddService/';
            return $http.post(url,{
                data:
                {
                    service_name: data.service_name,
                    service_detail: data.service_detail,
                    service_price: data.service_price,
                    service_image:data.service_image
                }
        });
        },
        getService: function(serviceId){
            var url='getService/'+serviceId;
            return $http.get(url);
        },
        update: function(service){
        var url = 'updateService/';
        return $http.post(url,{data:service});
        },
        deleteService: function(ServiceId){
            var url = 'servicedelete/'+ServiceId;
            return $http.delete(url);
        }

    }

}]);