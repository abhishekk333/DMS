/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
var service_required = [

]

define(['angularAMD', 'require', 'select2'], function(angularAMD, require) {

    // ngScroll App
    var uiSelect2 = angular.module("ui-select2", []);

    uiSelect2.value('uiSelect2Config', {});

    uiSelect2.directive('uiSelect2', function($parse, uiSelect2Config, $filter, $location, $rootScope, $injector, $compile) {

        // Default Options
        var defaults = {};

        if (uiSelect2Config) {
            angular.extend(defaults, uiSelect2Config);
        }

        return {
            restrict: "A",
            link: function(scope, element, attr) {

                scope.render = function(element, attr) {
                    var getter = $parse(attr.ngModel);
                    var setter = getter.assign;

                    var per_page = 20;
                    var elementType = element.prop("tagName");
                    var options = {
                        allowClear: true,
                        placeholder: "Select Data...",
                    }

                    options = angular.extend(options, defaults, scope.$eval(attr.uiSelect2));

                    var data = options.data;
                    delete options.data;

                    if (elementType == 'SELECT') {
                        delete options.multiple;
                        delete options.ajax_url;
                    }

                    if (options.hasOwnProperty('ajax_url')) {
                        options.ajax = {
                            quietMillis: 500,
                            url: serverUrl + "/public/common/getSuggestion/" + options.ajax_url,
                            type: 'POST',
                            dataType: 'json',
                            data: function(term, page) {
                                var send = {
                                    str: term != undefined ? term : "", // search term
                                    page: page != undefined ? page : 1,
                                    page_limit: per_page,
                                    request_from: request_from,
                                    app_version: app_version,
                                    access_token: $rootScope.LOGINCONST._ksat,
                                    username: $rootScope.USERCONST._ksusername,
                                    global_user_id: $rootScope.USERCONST._ksglobaluserid
                                };

                                if (typeof data != undefined) {
                                    if (typeof data == 'object') {
                                        send.data = data;
                                    } else if (typeof data == 'function') {
                                        send.data = data(element.attr("id"));
                                    }
                                }

                                return send;

                            },
                            results: function(data, page) {
                                if (options.hasOwnProperty('addCustom') && options.addCustom) {
                                    if (data.str && page >= data.last_page) {
                                        data.data.push({
                                            id: "new_" + data.str,
                                            text: data.str + " [ new ]"
                                        })
                                    }
                                }

                                return {
                                    results: data.data,
                                    more: page < data.last_page
                                };
                            },
                        };
                    } else if (options.hasOwnProperty('pre_data')) {
                        options.data = options.pre_data;
                        delete options.pre_data;
                    }

                    if (options.hasOwnProperty('is_color') && options.is_color) {
                        options.formatResult = function(state) {
                            if (!state.id) return state.text; // optgroup
                            return "<span class='color_tag' style='background:" + state.color + "'></span> " + state.text;
                        }
                        options.formatSelection = function(state) {
                            if (!state.id) return state.text; // optgroup
                            return "<span class='color_tag' style='background:" + state.color + "'></span> " + state.text;
                        }
                        options.escapeMarkup = function(m) {
                            return m;
                        }
                        delete options.is_color;
                    }

                    var select = $(element).select2(options);

                    if (options.disable) {
                        $(element).select2("enable", false);
                    }

                    $(element).on('select2-open', function(e) {
                        if ($(".select2-drop").find('.select2-add-new').length) {
                            $(".select2-drop .select2-add-new").remove();
                        }

                        if (options.hasOwnProperty("addNew") && options.addNew) {

                            var addNew = options.addNew.split("|");

                            if (addNew[1] === undefined || $rootScope.checkRight([addNew[1]])) {
                                var div = $("<div " + addNew[0] + " />")
                                    .addClass('select2-add-new')
                                    .attr('id', options.uiSelect2Id ? options.uiSelect2Id : '');

                                if (options.addNewHtml) {
                                    div.html(options.addNewHtml);
                                } else {
                                    div.html("<b>+</b> Create new");
                                }

                                $compile(div)(scope);
                                $(".select2-drop ul").after(div);
                                div.on('click', function(e) {
                                    $(element).select2("close");
                                });
                            }
                        }
                    });

                    select.on('change', function(e) {
                        var data = $(element).select2('data');

                        if (attr.ngModel) {
                            if (options.type == 'object') {
                                setter(scope, data);
                            } else if (options.type == 'search_object') {
                                data = data.id + "|" + data.text;
                                setter(scope, data);
                            } else {
                                var data = e.val;
                                setter(scope, data);
                            }
                        }

                        if (options.onchange) {
                            if (options.onchangeData) {
                                options.onchange($(element).select2('data'), options.onchangeData);
                            } else {
                                options.onchange($(element).select2('data'));
                            }
                        }

                        attr.is_rendered = true;
                    });
                }

                scope.render(element, attr);

                scope.$on('renderData', function(event, args) {
                    if (!attr.is_rendered) {
                        if (typeof attr.uiSelect2Data !== undefined) {
                            var select2Data = scope.$eval(attr.uiSelect2Data);
                            var opt = scope.$eval(attr.uiSelect2);
                            if (typeof select2Data != 'undefined' && (typeof select2Data != 'object' || !$.isEmptyObject(select2Data))) {
                                if (opt && opt.hasOwnProperty('ajax_url') && opt.ajax_url) {
                                    if (select2Data.id || select2Data instanceof Array) {
                                        $(element).select2('data', select2Data);
                                        attr.is_rendered = true;
                                    }
                                } else {
                                    $(element).select2('val', select2Data);
                                    attr.is_rendered = true;
                                }
                            }
                        }
                    }
                });

                scope.$on("reloadSelect2", function(event, args) {
                    if (attr.id == args.id) {
                        $(element).select2('data', {});
                        scope.render(element, attr);
                    }
                });
            }
        }
    });
});