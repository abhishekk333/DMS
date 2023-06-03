/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Plugins App
    var plugin = angular.module("ngPlugins", []);

    plugin.config(function($sceProvider) {
        $sceProvider.enabled(false);
    });

    /* 
     * --------------------
     * Breadcrumb
     * -------------------- 
     */
    plugin.directive('breadcrumb', function() {
        return {
            restrict: 'E',
            scope: "@",
            transclude: true,
            template: '<div class="breadcrumb"><div class="globalBack" ng-click="$root.globalBack()" Title="Back"><i class="la la-angle-left"></i></div><ul ng-bind-html="breadcrumbHtml"></ul><div class="clearfix"></div></div>',
            link: function(scope, element) {

                scope.breadcrumbHtml = "";

                var getBreadcrumb = function() {
                    scope.breadcrumbHtml = "";
                    $.each(scope.breadcrumb, function(i, val) {
                        scope.breadcrumbHtml += "<li>" + ((i == (scope.breadcrumb.length - 1) || scope.is_popup) ? "<span>" + val[0] + "</span>" : "<a tabindex='-1' " + "href='#/" + val[1] + "'>" + val[0] + "</a>") + "</li>";
                    });
                }

                getBreadcrumb();

                scope.$watch("breadcrumb", function() {
                    scope.breadcrumbHtml = "";
                    getBreadcrumb();
                });
            },
            replace: true
        };
    });

    /*
     * ------------------------
     * ngEnter
     * ------------------------
     */
    plugin.directive('ngEnter', function($parse) {
        return {
            restrict: "A",
            link: function(scope, element, attr) {
                element.bind("change keydown", function(e) {
                    if (e.keyCode == 13) {
                        var parsed = $parse(attr.ngEnter);
                        scope.$apply(function() {
                            parsed(scope);
                        });
                    }
                });
            }
        };
    });

    /*
     * ------------------------
     * toggle
     * ------------------------
     */
    plugin.directive('toggle', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                $(element).click(function() {
                    if (!$(attr.toggle).is(":visible"))
                        $(attr.toggle).css("display", "block");
                    else
                        $(attr.toggle).css("display", "none");
                });

                $("body").click(function(e) {
                    if (e.target != $(attr.toggle))
                        $(attr.toggle).css("display", "none");
                });

                $(attr.toggle).click(function(e) {
                    e.stopPropagation();
                });

                $(element).click(function(e) {
                    e.stopPropagation();
                });
            }
        };
    });

    /*
     * ------------------------
     * ngScroll
     * ------------------------
     */
    plugin.directive('ngScroll', function($parse, $rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.scroll(function() {

                    var parsed = $parse(attr.ngScroll);

                    if (attr.ngScrollDirection == "up") {
                        if (element.scrollTop() <= 0 && element[0].scrollHeight > element.outerHeight()) {
                            scope.$apply(function() {
                                parsed(scope);
                            });
                        }
                    } else {
                        var scrolled = attr.scrolled ? attr.scrolled : 0;

                        //if (element.scrollTop() > scrolled && element.scrollTop() + element.outerHeight() + 10 >= element[0].scrollHeight) {
                        if (element.scrollTop() > scrolled && element.scrollTop() + element.outerHeight() >= element[0].scrollHeight) {
                            attr.scrolled = element.scrollTop();
                            scope.$apply(function() {
                                parsed(scope);
                            });
                        }
                    }
                });

                scope.$on("refresh_scroll", function() {
                    attr.scrolled = 0;
                });

            }
        };
    });

    /*
     * ------------------------
     * autoFocus
     * ------------------------
     */
    plugin.directive('autoFocus', function($parse, $rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var opt = scope.$eval(attr.autoFocus);
                var delay = 0;

                if (opt != undefined && opt.delay != undefined) {
                    delay = opt.delay;
                }

                $timeout(function() {
                    if (attr.uiSelect2 != undefined) {
                        element.select2('focus');
                    } else {
                        element.focus();
                    }
                }, delay);
            }
        }
    });

    plugin.directive('focusTrap', function($parse, $rootScope, $timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                $timeout(function() {
                    var first = element.find(":focusable:first");
                    var last = element.find(":focusable:last");
                    last.keydown(function(e) {
                        if (e.which == 9) {
                            if (first.hasClass('select2-choice')) {
                                first.closest(".select2-container").next("[ui-select2]").select2('focus');
                            } else {
                                first.focus();
                            }
                            e.preventDefault();
                        }
                    })
                }, 500);
            }
        }
    });

    /*
     * ------------------------
     * autosize
     * ------------------------
     */
    plugin.directive('autosize', function($parse, $rootScope) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                element.addClass("autosize");
                $(element).on('keypress', function() {
                    setTimeout(function() {
                        $(element).css("height", ($(element).prop('scrollHeight') + 2) + "px");
                    });
                });
            }
        };
    });

    /*
     * ------------------------
     * currency
     * ------------------------
     */
    plugin.directive('currency', function($parse, $rootScope, $sce) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                const currency_decimal_code = attr.currency ? attr.currency : $rootScope.SETTING.currency_decimal_code;
                element.html(currency_decimal_code);
            }
        };
    });

    /*
     * ------------------------
     * barcode
     * ------------------------
     */
    plugin.directive('barcode', function($parse, $rootScope, $sce) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var barcode_height = attr.bheight ? parseFloat(attr.bheight) : 15;
                var barcode_width = attr.bwidth ? parseFloat(attr.bwidth) : 1;

                scope.options = {
                    width: barcode_width,
                    height: barcode_height,
                    textAlign: "center",
                    fontSize: 12,
                    displayValue: false,
                }
                setTimeout(function() {
                    var barcode = scope.$eval(attr.barcode);
                    if (typeof barcode === 'number') {
                        barcode = barcode.toString();
                    }
                    if (barcode) {
                        $(element).JsBarcode(barcode, scope.options);
                    }
                }, 100);
            }
        };
    });

    /*
     * ------------------------
     * qrcode
     * ------------------------
     */
    plugin.directive('qrcode', function($parse, $rootScope, $sce) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var qrcode_height = attr.qrheight ? parseFloat(attr.qrheight) : 68;
                var qrcode_width = attr.qrwidth ? parseFloat(attr.qrwidth) : 68;
                scope.options = {
                    text: scope.$eval(attr.qrcode),
                    width: qrcode_width,
                    height: qrcode_height,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                }
                var qrcodeVal = scope.$eval(attr.qrcode);
                if (qrcodeVal) {
                    setTimeout(function() {
                        new QRCode(document.getElementById(attr.id), scope.options);
                    }, 500)
                }
            }
        };
    });

    /*
     * ------------------------
     * clear
     * ------------------------
     */
    plugin.directive('myClear', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {

                scope.options = {};
                var options = scope.$eval(attr.myClear);

                var aft = 12 / options.col;
                setTimeout(function() {
                    $(element).find(".col-md-" + options.col).each(function(index) {
                        var i = (index + 1) % aft;
                        if (i == 0) {
                            $(this).after("<div class='clearfix'></div>");
                        }
                    });
                }, 1000);
            }
        };
    });

    plugin.filter('formatDate', function($rootScope) {
        return function(date, displayFormat = 'DD-MM-YYYY', givenFormat = 'YYYY-MM-DD hh:mm:ss') {
            const moment = $rootScope.LOCALTIMEZONE !== $rootScope.SERVERTIMEZONE ?
                require('moment').tz.setDefault($rootScope.SERVERTIMEZONE) :
                require('moment');

            let returnDate = moment(date, givenFormat);
            returnDate = $rootScope.LOCALTIMEZONE !== $rootScope.SERVERTIMEZONE ?
                returnDate.tz($rootScope.LOCALTIMEZONE) :
                returnDate;

            returnDate = returnDate.format(displayFormat);
            return returnDate;
        }
    });

});