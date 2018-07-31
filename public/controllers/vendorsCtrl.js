/**
 * Created by admin on 5/21/2018.
 */
angular.module('webApp.controllers')
    .controller('vendorsCtrl', ['$scope','vendors','vendorService','$state', function ($scope,vendors,vendorService,$state) {
        $scope.vendors = vendors;
        $scope.editVendor= function(id,action){
            if(action == 'remove'){
                var confirmation = confirm("Are you sure ? Vendor will be deleted permanently");
                if(confirmation == true) {
                    vendorService.deleteVendor(id).success(function (res) {
                        var vendor_index = _.findIndex($scope.vendors, {_id: id});
                        $scope.vendors.splice(vendor_index, 1);
                    });
                }
            }
        };
    }])