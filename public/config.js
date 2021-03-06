(function() {
    angular
        .module("CoinTrac")     
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider
            // --------  Home  --------
           .when("/", {
                templateUrl : "views/home/templates/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model",
                resolve: {
                    currentUser: getCurrentUser
                }
            })
            // -------- Details --------
            .when("/details/:coinId", {
                templateUrl : "views/details/templates/details.view.client.html",
                controller: "DetailsController",
                controllerAs: "model"
            })
            // ------ Profile ----------
            .when("/profile", {
                templateUrl : "views/user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    currentUser: protectBehindLogin
                }
            })
            // ------- Settings --------
            .when("/settings", {
                templateUrl : "views/user/templates/settings.view.client.html",
                controller: "SettingsController",
                controllerAs: "model",
                resolve: {
                    currentUser: protectBehindLogin
                }
            })
            // ------- Manage --------
            .when("/manage", {
                templateUrl : "views/user/templates/manage.view.client.html",
                controller: "ManageController",
                controllerAs: "model",
                resolve: {
                    currentUser: isAdmin
                }
            });

            function isAdmin(UserService, $q, $location) {
                var deferred = $q.defer();
                
                UserService
                    .checkLogin()
                    .then(function (user) {
                        if (user != '0' && user.isAdmin) {
                            deferred.resolve(user);
                        } else {
                            deferred.reject();
                            $location.url("/");
                        }
                    });
                
                return deferred.promise;
            }


            // Return the currently logged in user, for changing context of things that can
            // be viewed by registered and unregisterd users. If no user page will load with result null
            function getCurrentUser(UserService, $q) {
                var deferred = $q.defer();
                
                UserService
                    .checkLogin()
                    .then(function (user) {
                        if(user === '0') {
                            deferred.resolve(null);
                        } else {
                            deferred.resolve(user);
                        }
                    });
                
                return deferred.promise;
            }


            // Redirect the the home page if the user is not currently logged in
            // if user is logged in allow them to access page and return user def

            // returns a promise so that resolve can run multiple async checks.
            function protectBehindLogin(UserService, $q, $location) {
                var deferred = $q.defer();

                UserService
                    .checkLogin()
                    .then(function (user) {
                        if(user === '0') {
                            deferred.reject();
                            $location.url("/");
                        } else {
                            deferred.resolve(user);
                        }
                    });

                return deferred.promise;
            }
    }
})();