angular.module('webApp.services').factory('userService',['$http',function ($http) {

    return {
       /* getUserDetails: function () {
            var url='user/';
            return $http.get(url);
        },*/
        getAllUsers: function(){
            var url='/getUsers';
            return $http.get(url);
        },
        save : function(data){
            var url = 'user/';
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
        getUser: function(userId){
            var url='user/get?userId='+userId;
            return $http.get(url);
        },
        update: function(user){
            var url = 'user/';
            return $http.put(url,{data:user});
        },
        update_password: function(user){
            var url = 'user/update_password';
            return $http.put(url,{data:user});
        },
        deleteUser: function(userId){
            var url = 'userdelete/'+userId;
            return $http.delete(url);
        }

    }

}]);