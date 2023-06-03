/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Http Interceptor App
    var httpInterceptor = angular.module("httpInterceptor", []);

    // Http Interceptor
    httpInterceptor.factory('myHttpInterceptor', function($q, $window, $rootScope, $httpBuffer, $location) {

        return {
            request: function(request) {

                var spinner = request.hasOwnProperty('spinner') ? request.spinner : true;
                if (spinner) {
                    $("#spinner").show();
                    $(".btn").prop("disabled", true);
                }

                var data = request.method == 'GET' || request.method == 'DELETE' ? request.params : request.data;

                if (typeof data === 'undefined' || typeof data === 'object') {

                    data = (typeof data === 'undefined') ? {} : data;

                    data.access_token = $rootScope.LOGINCONST._ksat;
                    data.username = $rootScope.USERCONST._ksusername;
                    data.global_user_id = $rootScope.USERCONST._ksglobaluserid;
                    data.request_from = request_from;
                    data.app_version = app_version;
                    data.request_timezone = requestTimezone;
                } else if (typeof data === 'string') {
                    data += '&access_token=' + $rootScope.LOGINCONST._ksat;
                    data += '&username=' + $rootScope.USERCONST._ksemail;
                    data += '&global_user_id=' + $rootScope.USERCONST._ksglobaluserid;
                    data += '&request_from=' + request_from;
                    data += '&app_version=' + app_version;
                    data += '&request_timezone=' + requestTimezone;
                }

                if (request.method == 'GET' || request.method == 'DELETE') {
                    request.params = data;
                } else {
                    request.data = data;
                }

                if ($rootScope.reLogin && !request.hasOwnProperty('isRelogin')) {
                    var deferred = $q.defer();
                    $httpBuffer.append(request, deferred);
                    return deferred.promise;
                }
                return request;
            },
            requestError: function(rejection) {
                var spinner = rejection.hasOwnProperty('spinner') ? rejection.spinner : true;
                if (spinner) {
                    $("#spinner").hide();
                    $(".btn").prop("disabled", false);
                }
                return rejection;
            },
            response: function(response) {
                var spinner = response.config.hasOwnProperty('spinner') ? response.config.spinner : true;
                var autoFocus = response.config.hasOwnProperty('autoFocus') ? response.config.autoFocus : response.config.method == "POST";

                if (spinner) {
                    $("#spinner").hide();
                    if (autoFocus) {
                        var el = "[auto-focus]";
                        if ($(".modal").length) {
                            el = ".modal " + el
                        }

                        if ($(el).length) {
                            if ($(el).attr('ui-select2')) {
                                $(el).select2('focus');
                            } else {
                                $(el).focus();
                            }
                        }
                    }
                    $(".btn").prop("disabled", false);
                }

                setTimeout(function() {
                    $rootScope.$broadcast("renderData");
                });

                return response;
            },
            responseError: function(rejection) {
                var spinner = rejection.config.hasOwnProperty('spinner') ? rejection.config.spinner : true;
                if (spinner) {
                    $("#spinner").hide();
                    $(".btn").prop("disabled", false);
                }

                if (rejection.status == 401) {
                    $rootScope.$broadcast('loginRequired', true);

                    var deferred = $q.defer();
                    $httpBuffer.append(rejection.config, deferred);
                    return deferred.promise;
                } else if (rejection.status == 503) {
                    localStorage.setItem("heading", rejection.data.heading);
                    localStorage.setItem("description", rejection.data.description);
                    localStorage.setItem("link", (rejection.data.link != undefined ? rejection.data.link : ""));
                    window.location.href = "../error_page/503.html";
                } else if (rejection.status == 505) {
                    localStorage.setItem("heading", rejection.data.heading);
                    localStorage.setItem("description", rejection.data.description);
                    localStorage.setItem("can_extend", (rejection.data.can_extend != undefined ? rejection.data.can_extend : 1));
                    window.location.href = "../error_page/505.html";
                } else if (rejection.status == 404) {
                    //window.location.href = "../error_page/404.html";
                } else if (rejection.status == 403) {
                    if (rejection.data.error == 'access_forbidden') {
                        window.location.href = "../error_page/401.html";
                    } else if (rejection.data.error == 'unregistered_user' || rejection.data.error == 'inactive_user') {
                        $rootScope.logout();
                    }
                } else if (rejection.status == 402) {
                    localStorage.setItem("heading", rejection.data.heading);
                    localStorage.setItem("description", rejection.data.description);
                    localStorage.setItem("link", (rejection.data.link != undefined ? rejection.data.link : ""));
                    window.location.href = "../error_page/402.html";
                }

                return $q.reject(rejection);
            }
        }
    });

    // Http Buffer
    httpInterceptor.factory('$httpBuffer', function($injector) {

        var buffer = [];
        var $http;

        function retryHttpRequest(config, deferred) {
            function successCallback(response) {
                deferred.resolve(response);
            }

            function errorCallback(response) {
                deferred.reject(response);
            }
            $http = $http || $injector.get('$http');
            $http(config).then(successCallback, errorCallback);
        }
        return {
            append: function(config, deferred) {
                buffer.push({
                    config: config,
                    deferred: deferred
                });
            },
            retryAll: function(updater) {
                for (var i = 0; i < buffer.length; ++i) {
                    retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
                }
                buffer = [];
            }
        };
    });
});