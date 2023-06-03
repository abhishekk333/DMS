/* 
 * ----------------------------------------
 * activity.js
 * ----------------------------------------
 * 
 * Iniatialize your app here.
 * 
 */

var module = 'modules/activity';

define(['angularAMD', 'moment_timezone'], function(angularAMD) {

    // Activity App 
    var activity = angular.module("activity", []);

    // Index Controller
    activity.controller('index', function($scope, $stateParams, $http, $location, $rootScope, $cookies, $modal, $sticky, $activityService, $compile, $settingService) {

        $scope.breadcrumb = [
            ['My Activity', 'activity'],
        ];

        var setting = $settingService.get(['enable_sale_quotation']);
        $scope.enable_sale_quotation = setting.enable_sale_quotation;

        $scope.filter = $cookies.getObject($rootScope.USERCONST._ksuserid + '_my_activity');

        $scope.user = {
            id: $rootScope.USERCONST._ksuserid,
            text: $rootScope.USERCONST._ksname
        };

        if (typeof $scope.filter == 'undefined') {
            $scope.filter = {
                done_status: "0",
                period: "today",
                my_activity: true,
                user_id: $scope.user,
            }
            $cookies.putObject($rootScope.USERCONST._ksuserid + "_my_activity", $scope.filter, {
                path: cookiePath
            });
        } else {
            $scope.filter.user_id = $scope.user;
            $cookies.putObject($rootScope.USERCONST._ksuserid + "_my_activity", $scope.filter, {
                path: cookiePath
            });
        }

        $scope.activity_option = {
            cookie: true,
            filter: $scope.filter
        }

        $scope.addActivity = $activityService.addActivity;
    });
});