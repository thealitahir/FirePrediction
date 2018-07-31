angular.module('webApp.services').factory('vendorService',['$http',function ($http) {

    return {
        getVendorDetails: function () {
            var url='vendor/';
            return $http.get(url);
        },
        getAllvendors: function(){
            var url='/getAllVendors';
            return $http.get(url);
        },
        save : function(data){
            var url = 'vendor/';
            return $http.post(url,
                {
                    firstName:data.firstName,
                    lastName:data.lastName,
                    username:data.username,
                    password:data.password,
                    active:data.active,
                    role:data.role
                });
        },
        getVendor: function(vendorId){
            var url='vendor/get?vendorId='+vendorId;
            return $http.get(url);
        },
        update: function(vendor){
            var url = 'vendor/';
            return $http.put(url,{data:vendor});
        },
        update_password: function(vendor){
            var url = 'vendor/update_password';
            return $http.put(url,{data:vendor});
        },
        deleteVendor: function(vendorId){
            var url = 'vendordelete/'+vendorId;
            return $http.delete(url);
        }

    }

}]);