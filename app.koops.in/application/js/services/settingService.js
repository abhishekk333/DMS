/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Breadcrumb App
    var icons = angular.module("settingService", []);

    // factory for icons
    icons.factory('$settingService', function($http, $location, $sce, $modal, $compile, $rootScope) {
        var imgIcon = [];
        return {
            get: function(setting) {
                var data = {};
                if (setting && setting.length) {
                    $.each($rootScope.SETTING, function(i, s) {
                        if ($.inArray(i, setting) > -1) {
                            data[i] = s;
                        }
                    });
                } else {
                    data = $rootScope.SETTING;
                }
                return data;
            },
            check: function(setting, value) {
                setting = setting.split(".");
                var val;
                if (setting.length > 1) {
                    val = $rootScope.SETTING;
                    $.each(setting, function(i, val) {
                        val = val[setting[i]];
                    });
                } else {
                    val = $rootScope.SETTING[setting];
                }

                if (value == val) {
                    return true;
                } else {
                    return false;
                }
            }
        };
    });
});