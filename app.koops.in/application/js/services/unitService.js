/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Modal App
    var unitService = angular.module("unitService", []);

    // factory for table
    unitService.factory('$unit', function($http, $location, $sce, $compile, $rootScope) {

        var data = {};

        // Parse Unit
        data.parse = function(qty, unit_id, rounding_type = "normal") {
            var decimal_point = 2;
            var quantity = 0;

            if (unit_id && $.inArray(unit_id, $rootScope.UNIT) && $.isNumeric($rootScope.UNIT[unit_id]['decimal_point'])) {
                decimal_point = $rootScope.UNIT[unit_id]['decimal_point'];
            }

            if (qty != undefined && qty != "") {
                quantity = parseFloat(qty);
                var _q = parseFloat(quantity.toFixed(decimal_point));
                if (_q == 0) {
                    var p = Math.pow(10, decimal_point);
                    quantity = Math.ceil(quantity * p) / p;
                } else if (rounding_type == "upward") {
                    var p = Math.pow(10, decimal_point);
                    quantity = Math.ceil(qty * p) / p;
                } else {
                    quantity = _q;
                }
            }

            return quantity.toFixed(decimal_point);
        }

        // get unit data
        data.get = function(unit_id) {
            if (unit_id && $.inArray(unit_id, $rootScope.UNIT)) {
                return $rootScope.UNIT[unit_id];
            } else {
                return false;
            }
        }

        return data;
    });

    unitService.directive('myUnitParse', function($parse, $location, $rootScope, $http, $compile, $modal, $cookies, $filter, $unit) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var options = {
                    name: true
                };
                options = angular.extend(options, scope.$eval(attr.myUnitParse));
                //                var options = scope.$eval(attr.myUnitParse);
                var qty = $unit.parse(options.quantity, options.unit_id);
                var unit = $unit.get(options.unit_id);
                element.html(qty + " " + (options.name && unit.name ? unit.name : ""));
            }
        }
    });
});