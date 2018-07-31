/**
 * Created by admin on 5/21/2018.
 */
angular.module('webApp.controllers')
    .controller('usersCtrl', ['$scope','users','userService','$state', function ($scope,users,userService,$state) {
        $scope.users = users;
        $scope.editUser= function(id,action){
             if(action == 'remove'){
                var confirmation = confirm("Are you sure ? User will be deleted permanently");
                if(confirmation == true) {
                    userService.deleteUser(id).success(function (res) {
                        var user_index = _.findIndex($scope.users, {_id: id});
                        $scope.users.splice(user_index, 1);
                    });
                }
            }
        };
    }])