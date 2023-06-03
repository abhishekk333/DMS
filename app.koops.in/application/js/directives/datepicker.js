/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD', 'require', 'datepicker_lib', 'daterange_lib'], function(angularAMD, require) {

    var css = [
        'vendor/datepicker/css/bootstrap-datepicker.css',
        'vendor/datepicker/css/bootstrap-datepicker3.css',
        'vendor/datepicker/css/daterangepicker.css'
    ];

    $.each(css, function(i, val) {
        var cssUrl = require.toUrl(val);
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = cssUrl;
        $("head").append(link);
    });

    var _rid = 0;

    // Breadcrumb App
    var datepicker = angular.module("datepicker", []);

    datepicker.value('datepickerConfig', {});
    datepicker.value('daterangeConfig', {});

    datepicker.directive('kDatepicker', function($compile, datepickerConfig, $parse, $rootScope) {
        return {
            restrict: "A",
            link: function(scope, element, attr) {

                var option = {
                    format: 'dd-mm-yyyy',
                    autoclose: true,
                    todayHighlight: true,
                    multidate: false
                };

                if (datepickerConfig) {
                    angular.extend(option, datepickerConfig);
                }

                var new_opt = scope.$eval(attr.kDatepicker);

                if (new_opt) {
                    angular.extend(option, new_opt);
                }

                element.datepicker(option);

                setTimeout(function() {
                    var value = element.find("input").val();
                    element.datepicker('setDate', value);
                    $rootScope.somethingChanged = false;
                });

                scope.$on('datepickerUpdate', function(event, args) {
                    var value = element.find("input").val();
                    element.datepicker('setDate', value);
                });
            }
        };
    });

    datepicker.directive('kDaterange', function($compile, daterangeConfig, $parse, $date, $rootScope) {
        return {
            restrict: "A",
            scope: true,
            link: function(scope, element, attr) {

                var getter = $parse(element.find('input').attr('ng-model'));
                var setter = getter.assign;

                var opt = scope.$eval(attr.kDaterange);
                scope._date = {};
                element.click(function(e) {

                    if ($.isEmptyObject(scope._date)) {
                        var str = element.find("input").val();
                        var str_array = str.split(",");

                        scope._date.from = str_array[0];
                        scope._date.to = str_array[1];
                    }

                    e.preventDefault();

                    $("body").append("<div class='daterangePopoverMask'></div>");

                    var popover = $("<div />").addClass("daterangePopover");

                    if (opt.hasOwnProperty("onlyMonth") && opt.onlyMonth) {
                        scope._periods = [{
                                id: "current_month",
                                text: "Current month"
                            },
                            {
                                id: "current_quarter",
                                text: "Current quarter"
                            },
                            {
                                id: "current_year",
                                text: "Current year"
                            },
                            {
                                id: "previous_month",
                                text: "Previous month"
                            },
                            {
                                id: "previous_quarter",
                                text: "Previous quarter"
                            },
                            {
                                id: "previous_year",
                                text: "Previous year"
                            },
                        ];
                    } else {
                        scope._periods = [{
                                id: "today",
                                text: "Today"
                            },
                            {
                                id: "current_month",
                                text: "Current month"
                            },
                            {
                                id: "current_quarter",
                                text: "Current quarter"
                            },
                            {
                                id: "current_year",
                                text: "Current year"
                            },
                            {
                                id: "previous_month",
                                text: "Previous month"
                            },
                            {
                                id: "previous_quarter",
                                text: "Previous quarter"
                            },
                            {
                                id: "previous_year",
                                text: "Previous year"
                            },
                            {
                                id: "last_30",
                                text: "Last 30 days"
                            },
                            {
                                id: "last_90",
                                text: "Last 90 days"
                            },
                            {
                                id: "last_180",
                                text: "Last 180 days"
                            },
                            {
                                id: "last_365",
                                text: "Last 365 days"
                            },
                        ];
                    }

                    popover.append('<div class="box">' +
                        '<select ui-select2="{placeholder:\'Select Period\', onchange: periodChange}" id="period" ng-model="_date.period" ui-select2-data="_date.period">' +
                        '<option value=""></option>' +
                        '<option ng-repeat="_period in _periods" value="{{_period.id}}">{{_period.text}}</option>' +
                        '</select>' +
                        '</div>');

                    popover.append('<div class="box">\n\
                        <div class="box_input">\n\
                            <div class="input-group date" k-datepicker="' + (opt.hasOwnProperty("onlyMonth") && opt.onlyMonth ? '{format:\'MM yyyy\', minViewMode:\'months\', viewMode:\'months\'}' : '') + '">\n\
                                <input type="text" class="text" placeholder="From Date..." ng-model="_date.from" id="daterange_from">\n\
                                <span class="input-group-addon text_date_icon"><i class="la la-calendar"></i></span>\n\
                            </div>\n\
                        </div>\n\
                        <div class="clearfix"></div>\n\
                    </div>');

                    popover.append('<div class="box">\n\
                        <div class="box_input">\n\
                            <div class="input-group date" k-datepicker="' + (opt.hasOwnProperty("onlyMonth") && opt.onlyMonth ? '{format:\'MM yyyy\', minViewMode:\'months\', viewMode:\'months\'}' : '') + '">\n\
                                <input type="text" class="text" placeholder="To Date..." ng-model="_date.to" id="daterange_to">\n\
                                <span class="input-group-addon text_date_icon"><i class="la la-calendar"></i></span>\n\
                            </div>\n\
                        </div>\n\
                        <div class="clearfix"></div>\n\
                    </div>');

                    popover.append('<div class="box text-right action">\n\
                        <a class="link" href="javascript:void(0);" ng-click="onClear();">Clear</a>\n\
                        <a class="btn btn-important" href="javascript:void(0);" ng-click="onApply();">Apply</a>\n\
                    </div>');

                    $compile(popover.contents())(scope);

                    $("body").append(popover);

                    var offset = element.offset();
                    var height = element.outerHeight();
                    var width = element.outerWidth();

                    popover.css("top", (offset.top + height) + "px");

                    if (offset.left + 348 <= screen.width) {
                        popover.css("left", (offset.left) + "px");
                    } else {
                        popover.css("left", (offset.left - 248 + width) + "px");
                    }

                });

                scope.onApply = function() {
                    var str = "";
                    if (scope._date.from) {
                        str += str ? "," + scope._date.from : scope._date.from;
                    }

                    if (scope._date.to) {
                        str += str ? "," + scope._date.to : scope._date.to;
                    }

                    element.find("input").val(str);

                    setter(scope, str);

                    if (opt.hasOwnProperty('onapply')) {
                        opt.onapply();
                    }

                    $(".daterangePopover").remove();
                    $(".daterangePopoverMask").remove();
                }

                scope.onClear = function() {
                    var str = "";

                    element.find("input").val(str);

                    setter(scope, str);

                    if (opt.hasOwnProperty('onclear')) {
                        opt.onapply();
                    }

                    $(".daterangePopover").remove();
                    $(".daterangePopoverMask").remove();
                }

                scope.periodChange = function(data) {

                    var format = opt.hasOwnProperty("onlyMonth") && opt.onlyMonth ? "MM yyyy" : 'dd-mm-yyyy';

                    var range = $date.getRange(format, data.id);
                    scope._date.from = range[0];
                    scope._date.to = range[1];

                    element.attr("period", data.id);

                    $("#daterange_from").val(scope._date.from);
                    $("#daterange_to").val(scope._date.to);

                    $rootScope.$broadcast('datepickerUpdate');

                }

                $(document).off("click", ".daterangePopoverMask").on("click", ".daterangePopoverMask", function(e) {
                    $(".daterangePopover").remove();
                    $(".daterangePopoverMask").remove();
                });
            }
        };
    });
});