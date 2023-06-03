/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Auth app
    var auth = angular.module("auth", []);

    // service for auth
    auth.factory('$auth', function($q, $http, $cookies, $rootScope) {

        return {

            // Re Login [ login with refresh token ]
            reLogin: function() {
                var deffered = $q.defer();
                var ck = $cookies.getObject("_ksld");
                if (ck != undefined && ck._ksrt != undefined) {
                    $http({
                        url: serverUrl + '/public/common/loginWithRefreshToken',
                        method: "post",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        spinner: false,
                        isRelogin: true,
                        data: {
                            grant_type: 'refresh_token',
                            client_id: '1',
                            client_secret: '123456',
                            username: $rootScope.USERCONST._ksemail,
                            global_user_id: $rootScope.USERCONST._ksglobaluserid,
                            refresh_token: ck._ksrt
                        },
                    }).then(function(response) {
                        var cookieObj = makeCookieObject(response.data);

                        $cookies.putObject("_ksld", cookieObj._ksld, {
                            path: cookiePath,
                            domain: cookieDomain
                        });

                        $cookies.putObject("_ksud", cookieObj._ksud, {
                            path: cookiePath,
                            domain: cookieDomain
                        });

                        $rootScope.USERCONST = JSON.parse($cookies.getAll()._ksud);
                        $rootScope.LOGINCONST = JSON.parse($cookies.getAll()._ksld);
                        deffered.resolve('success');


                    }, function(rejection) {
                        $cookies.remove('_ksld', {
                            path: cookiePath,
                            domain: cookieDomain
                        });
                        $cookies.remove('_ksud', {
                            path: cookiePath,
                            domain: cookieDomain
                        });
                        $cookies.remove('_ksld', {
                            path: cookiePath
                        });
                        $cookies.remove('_ksud', {
                            path: cookiePath
                        });
                        delete $rootScope.USERCONST;
                        delete $rootScope.LOGINCONST;
                        deffered.reject('error');
                    });
                } else {
                    $cookies.remove('_ksld', {
                        path: cookiePath,
                        domain: cookieDomain
                    });
                    $cookies.remove('_ksud', {
                        path: cookiePath,
                        domain: cookieDomain
                    });
                    $cookies.remove('_ksld', {
                        path: cookiePath
                    });
                    $cookies.remove('_ksud', {
                        path: cookiePath
                    });
                    delete $rootScope.USERCONST;
                    delete $rootScope.LOGINCONST;
                    deffered.reject('error');
                }

                return deffered.promise;
            },

            // Logout Function
            logout: function() {
                $http({
                    url: serverUrl + '/public/common/logout',
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }).then(function(response) {
                    $cookies.remove('_ksld', {
                        path: cookiePath,
                        domain: cookieDomain
                    });
                    $cookies.remove('_ksud', {
                        path: cookiePath,
                        domain: cookieDomain
                    });
                    $cookies.remove('_ksld', {
                        path: cookiePath
                    });
                    $cookies.remove('_ksud', {
                        path: cookiePath
                    });
                    delete $rootScope.USERCONST;
                    delete $rootScope.LOGINCONST;
                    window.location.href = baseUrl;
                }, function(rejection) {
                    $cookies.remove('_ksld', {
                        path: cookiePath,
                        domain: cookieDomain
                    });
                    $cookies.remove('_ksud', {
                        path: cookiePath,
                        domain: cookieDomain
                    });
                    $cookies.remove('_ksld', {
                        path: cookiePath
                    });
                    $cookies.remove('_ksud', {
                        path: cookiePath
                    });
                    delete $rootScope.USERCONST;
                    delete $rootScope.LOGINCONST;
                    window.location.href = baseUrl;
                });
            },

            // Logged In
            loggedIn: function() {
                var loggedIn = false;

                var _ksld = $cookies.getObject('_ksld');
                var _ksud = $cookies.getObject('_ksud');
                if (typeof _ksld != 'undefined' && typeof _ksud != 'undefined') {
                    loggedIn = true;
                }

                return loggedIn;
            }
        };
    });
});