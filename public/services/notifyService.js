/**
 * Created by Haniya on 9/29/2014.
 */
angular.module('webApp.services').factory('notifyService',['$rootScope','$timeout', function ($rootScope,$timeout) {

    return {
        notify : function(message){
            $rootScope.message = message;

                $timeout(function() {
                    $rootScope.showMessage = true;
                }, 3000);

            $rootScope.showMessage=false;
        },
        showLoading: function(msg){
            if (msg){
                $rootScope.message = msg;
            } else {
                $rootScope.message = 'Loading...';
            }


            $rootScope.showMessage=false;
        },
        hideLoading: function(){
            $rootScope.showMessage=true;
        }
    };
}]);