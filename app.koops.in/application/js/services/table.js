/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD', 'angular-tree', 'icons', 'tableEdit', 'unitService'], function(angularAMD) {

    // Table App
    var table = angular.module("table", ['ui.tree', 'icons', 'tableEdit', 'unitService']);

    table.value('tableConfig', {});

    table.directive('datatable', function($parse, tableConfig, $location, $rootScope, $http, $compile, $modal, $iconsService, $filter, $unit) {

        // Default Options
        var defaults = {
            active: false,
            showFooter: true,
            rows_per_page: 20,
            searchable: true,
            paging: 'simple',
            showTotalCount: 'true',
            manage_column: true,
            showCount: true,
            editUrl: "",
            viewUrl: "",
            editFunction: "",
            viewFunction: "",
            massEditUrl: "",
            deleteUrl: "",
            deleteFunction: "",
            editable: true,
            searchFromUrl: true,
            showTotal: false,
            unseen_column: "",
            defaultSearch: "",
            extraClass: "",
            initOnLoad: true,
            dataModel: "",
            total_quantity: false,
            module: ""
        };

        if (tableConfig) {
            angular.extend(defaults, tableConfig);
        }

        return {
            restrict: "A",
            scope: true,
            link: function(scope, element, attr) {

                var options = {};
                options = angular.extend(options, defaults, scope.$eval(attr.datatable));

                element.addClass("datatable");

                element.append('<div class="datatable_inner" style="overflow: auto; width: 100%;">\n\
                                    <table class="datatable_main">\n\
                                        <thead id="putHeadData"></thead>\n\
                                        <tbody id="putBodyData"></tbody>\n\
                                    </table>\n\
                                </div>\n\
                                <div id="putFootData" class="tfoot clearfix hidden-print" style="border-bottom: 1px solid #ddd; padding: 10px 0;"></div>');

                if (options.active) {
                    element.find(".datatable_main").addClass("active");
                }

                if (options.extraClass) {
                    element.addClass(options.extraClass);
                }

                scope.rows_per_page = options.rows_per_page != undefined && options.rows_per_page ? options.rows_per_page : 20;

                scope.search = {};
                if (options.searchFromUrl && $location.search()) {
                    scope.search = $location.search();
                    if (scope.search.rows_per_page !== undefined) {
                        scope.rows_per_page = scope.search.rows_per_page;
                        $location.search('rows_per_page', scope.rows_per_page);
                    } else {
                        scope.search.rows_per_page = scope.rows_per_page;
                    }
                } else {
                    scope.search.rows_per_page = scope.rows_per_page;
                }
                if (options.defaultSearch) {
                    //$.extend(scope.search, options.defaultSearch);
                    scope.search = $.extend(options.defaultSearch, scope.search);
                } else {
                    //$.extend(scope.search, {status: "0"})
                    scope.search = $.extend({
                        status: "0"
                    }, scope.search);
                }

                scope.search.asc = scope.search.asc == 'true';

                if (scope.$parent && scope.$parent.$parent) {
                    scope.$parent.$parent.search = scope.search;
                }

                // mouse move 
                $(".scrollable .datatable_inner").append("<div class='scrollLeft'></div>");
                $(".scrollable .datatable_inner").append("<div class='scrollRight'></div>");

                $(".scrollable .datatable_inner .scrollLeft").mouseenter(function() {
                    $(".scrollable .datatable_inner").stop().animate({
                        scrollLeft: 0
                    }, 1000);
                }).mouseleave(function() {
                    $(".scrollable .datatable_inner").stop().animate();
                });

                $(".scrollable .datatable_inner .scrollRight").mouseenter(function() {
                    $(".scrollable .datatable_inner").stop().animate({
                        scrollLeft: $(".scrollable .datatable_inner")[0].scrollWidth
                    }, 1000);
                }).mouseleave(function() {
                    $(".scrollable .datatable_inner").stop().animate();
                });

                $(".scrollable .datatable_inner").scroll(function() {
                    if ($(this).scrollLeft() == 0) {
                        $(".scrollable .datatable_inner .scrollLeft").css("display", "none");
                    } else {
                        $(".scrollable .datatable_inner .scrollLeft").css("display", "block");
                    }
                    if ($(this).scrollLeft() + $(this).innerWidth() >= $(this)[0].scrollWidth) {
                        $(".scrollable .datatable_inner .scrollRight").css("display", "none");
                    } else {
                        $(".scrollable .datatable_inner .scrollRight").css("display", "block");
                    }
                });

                // Get Table
                scope.getTable = function(getColumn) {
                    const _scopeSearch = angular.copy(scope.search);
                    $.each(_scopeSearch, function(i, x) {
                        let isDateTypeAttribute = false;
                        if (scope.attribute && !isNaN(i) && x != '') {
                            const isDateType = scope.attribute.some(function(ax) {
                                return ax.attribute_id == i && ax.type == 'date'
                            });
                            isDateTypeAttribute = isDateType === true ? true : false;
                        }
                        var isFormDate = false;
                        if (options.defaultSearch.form_id != undefined && x !== null && x !== "" && typeof x == 'string' && x.indexOf(',') > -1) {
                            let formDate = x.split(',');
                            let regExp = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
                            if (formDate[0].match(regExp) && formDate[1].match(regExp)) {
                                isFormDate = true;
                            }
                        }
                        if ((x !== null && x !== "" && options.filter && options.filter.hasOwnProperty(i)) && options.filter[i].includes("formatDate") || isDateTypeAttribute || isFormDate) {
                            let date = x.split(',');
                            let _date = $rootScope.convertToServerTime(date[0] + ' 00:00:00', 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm:ss');
                            if (date.length > 1) {
                                _date += ',' + $rootScope.convertToServerTime(date[1] + ' 23:59:59', 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm:ss');
                            }
                            _scopeSearch[i] = _date;
                        }
                    });
                    scope._scopeSearch = _scopeSearch;
                    localStorage.setItem('datatable_filter', JSON.stringify(_scopeSearch));
                    $http({
                        url: options.baseUrl + (scope.search.page ? '?page=' + scope.search.page : ""),
                        method: "post",
                        autoFocus: false,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            getColumn: getColumn,
                            sortBy: scope.search.sortBy,
                            asc: scope.search.asc,
                            search: scope._scopeSearch,
                            rows_per_page: scope.rows_per_page
                        }
                    }).then(function(response) {
                        var result = response.data;
                        var main_data = result.data;

                        if (getColumn) {
                            scope.column = main_data.column;
                            scope.setColumn();
                        }

                        scope.data = main_data.data;
                        scope.attribute = main_data.attribute;
                        scope.from = main_data.from;
                        scope.to = main_data.to;
                        scope.search.page = main_data.current_page;
                        scope.total = main_data.total;
                        scope.link = main_data.link;
                        scope.per_page = main_data.per_page
                        scope.next_page_url = main_data.next_page_url
                        scope.prev_page_url = main_data.prev_page_url

                        scope.row_total = result.total;

                        if (options.dataModel) {
                            scope.$parent[options.dataModel] = scope.data;
                        }

                        scope.setData();
                        if (options.showFooter) {
                            scope.setFooter();
                        }
                        if (options.total_quantity) {
                            scope.totalQuantity();
                        };

                    }, function(response) {

                    });
                };

                if (options.initOnLoad) {
                    scope.getTable(true);
                }

                scope.setColumn = function() {
                    var columnTr = "";
                    var searchTr = "";
                    var tagDrop = new Array();

                    $.each(scope.column, function(i, val) {
                        if (options.searchable) {
                            if (val.searchable_input) {
                                if (val.searchable_input === "dropdown") {
                                    var input = "";
                                    if (val.hasOwnProperty('searchable_source') && val.searchable_source) {
                                        input = '<input id="' + val.name + '" class="searchbox" type="hidden" ng-model="search[\'' + (val.attribute_id ? val.attribute_id : val.name) + '\']" ui-select2="{ajax_url:\'' + val.searchable_source + (val.attribute_id ? '/' + val.attribute_id : '') + '\', is_color: ' + (val.type === "dynamic_color_tag" ? 'true' : 'false') + ', placeholder:\'&#xf2eb; ' + (val.display ? val.display : val.name) + '\', onchange:searchFunction, onchangeData:\'' + (val.attribute_id ? val.attribute_id : val.name) + '\'}" ui-select2-data="{id:search[\'' + (val.attribute_id ? val.attribute_id : val.name) + '\'],text:search[\'' + (val.attribute_id ? val.attribute_id : val.name) + '_text\']}" />';
                                    } else if (val.hasOwnProperty('tag') && val.tag) {

                                        var search_tag = $.parseJSON(val.tag);

                                        tagDrop[val.name] = search_tag;

                                        var option = '<option></option>';

                                        $.each(search_tag, function(j, tag) {
                                            option += '<option value="' + tag.name + '">' + tag.display + '</option>';
                                        });

                                        input = '<select id="' + (val.attribute_id ? val.attribute_id : val.name) + '" class="searchbox" ng-model="search[\'' + (val.attribute_id ? val.attribute_id : val.name) + '\']" ui-select2="{placeholder:\'&#xf2eb; ' + (val.display ? val.display : val.name) + '\', onchange:searchFunction}" ui-select2-data="search[\'' + (val.attribute_id ? val.attribute_id : val.name) + '\']">' + option + '</select>';

                                    }

                                    searchTr += "<th class='searchbar tag-dropdown " + (val.extra_class ? " " + val.extra_class : '') + "' ng-enter='searchFunction()' style='" + val.style + "'>" + input + "</th>";
                                } else if (val.searchable_input === "datepicker") {
                                    searchTr += "<th class='searchbar " + (val.extra_class ? " " + val.extra_class : '') + "' ng-enter='searchFunction()' style='" + val.style + "'>" +
                                        '<div class="input-group date" k-daterange="{onapply:searchFunction,onclear:searchFunction}">' +
                                        '<input type="text" class="searchbox" ng-model="search[\'' + (val.attribute_id ? val.attribute_id : val.name) + '\']" placeholder="&#xf2eb; ' + (val.display ? val.display : val.name) + '" />' +
                                        '<span class="input-group-addon searchbox_date_icon"><i class="la la-calendar"></i></span>' +
                                        '</div>' +
                                        "</th>";
                                } else if (val.searchable_input === "monthpicker") {
                                    searchTr += "<th class='searchbar " + (val.extra_class ? " " + val.extra_class : '') + "' ng-enter='searchFunction()' style='" + val.style + "'>" +
                                        '<div class="input-group date" k-daterange="{onapply:searchFunction,onclear:searchFunction, onlyMonth:true}">' +
                                        '<input type="text" class="searchbox" ng-model="search[\'' + (val.attribute_id ? val.attribute_id : val.name) + '\']" placeholder="&#xf2eb; ' + (val.display ? val.display : val.name) + '" />' +
                                        '<span class="input-group-addon searchbox_date_icon"><i class="la la-calendar"></i></span>' +
                                        '</div>' +
                                        "</th>";
                                } else {
                                    if (val.name == "checkbox" || val.name == "action") {
                                        if (options.editable == undefined || options.editable) {
                                            searchTr += "<th class='searchbar " + (val.extra_class ? " " + val.extra_class : '') + "' style='" + val.style + "' ng-enter='searchFunction()'><input type='text' class='searchbox' placeholder='&#xf2eb; " + (val.display ? val.display : val.name) + "' ng-model='search[\"" + (val.attribute_id ? val.attribute_id : val.name) + "\"]' /></th>";
                                        }
                                    } else {
                                        searchTr += "<th class='searchbar " + (val.extra_class ? " " + val.extra_class : '') + "' style='" + val.style + "' ng-enter='searchFunction()'><input type='text' class='searchbox' placeholder='&#xf2eb; " + (val.display ? val.display : val.name) + "' ng-model='search[\"" + (val.attribute_id ? val.attribute_id : val.name) + "\"]' /></th>";
                                    }
                                }
                            } else {
                                if (val.name == "checkbox" || val.name == "action") {
                                    if (options.editable == undefined || options.editable) {
                                        searchTr += "<th class='searchbar" + (val.extra_class ? (" " + val.extra_class) : '') + "'></th>";
                                    }
                                } else {
                                    searchTr += "<th class='searchbar" + (val.extra_class ? (" " + val.extra_class) : '') + "'></th>";
                                }
                            }
                        }
                        if (val.name !== "checkbox" && val.name !== "action") {
                            columnTr += "<th class='" + (val.extra_class ? " " + val.extra_class : '') + (val.is_sortable == 1 ? " sortable" : "") + "'  ng-click='sort(" + (val.is_sortable == 1 ? true : false) + ",\"" + (val.attribute_id ? val.attribute_id : val.name) + "\")' style='" + val.style + "'>\n\
                            <p class='pencil_icon'>" + (val.display ? val.display : val.name) + (val.edit_input ? "<span class='edit_icon' table-edit='{column:" + val.edit_input + ", table:\"" + val.table_name + "\", url:\"" + options.massEditUrl + "\"}'><i class='la la-pencil'></i></span>" : "") + (val.is_sortable == 1 ? "<span class='sort_icon hidden-print'><i class='la la-sort'></i></span>" : "") + "</p>\n\
                            </th>";
                        } else if (val.name == 'action') {
                            if (options.editable == undefined || options.editable) {
                                columnTr += "<th class='" + (val.extra_class ? " " + val.extra_class : '') + (val.is_sortable == 1 ? " sortable" : "") + "'  ng-click='sort(" + (val.is_sortable == 1 ? true : false) + ",\"" + (val.attribute_id ? val.attribute_id : val.name) + "\")' style='" + val.style + "'>\n\
                                <p class='pencil_icon'>" + (val.display ? val.display : val.name) + (val.edit_input ? "<span class='edit_icon' table-edit='{column:" + val.edit_input + ", table:\"" + val.table_name + "\", url:\"" + options.massEditUrl + "\"}'><i class='la la-pencil'></i></span>" : "") + (val.is_sortable == 1 ? "<span class='sort_icon hidden-print'><i class='la la-sort'></i></span>" : "") + "</p>\n\
                                </th>";
                            }
                        } else {
                            if (options.editable == undefined || options.editable) {
                                columnTr += "<th class='" + (val.extra_class ? " " + val.extra_class : '') + "' ><input type='checkbox' ng-change='selectAll()' ng-model='selected' id='select_all' /> <label for='select_all'></label></th>";
                            }
                        }
                    });

                    var search_th = searchTr ? "<tr class='hidden-print'>" + searchTr + "</tr>" : "";
                    var column_th = "<tr>" + columnTr + "</tr>";
                    var th = search_th + column_th;

                    if (element.hasClass("scrollable")) {
                        element.find("thead#putHeadData").html(th);
                        $compile(element.find("thead#putHeadData").contents())(scope);
                    } else {
                        element.find("thead#putHeadData").html(th);
                        $compile(element.find("thead#putHeadData").contents())(scope);
                    }

                    $rootScope.$broadcast('renderData');
                }

                // set Data
                scope.setData = function() {
                    var tableData = "";
                    if (typeof scope.data !== 'undefined') {
                        var data_length = scope.data.length;
                        $.each(scope.data, function(index, value) {
                            var td = '';
                            $.each(scope.column, function(i, val) {
                                var _ec = "";
                                if (val.conditional_class) {
                                    $.each(val.conditional_class, function(cl, cond) {
                                        var con = cond.split('|');
                                        if (eval(value[con[0]] + " " + con[1] + " " + con[2])) {
                                            _ec += (" " + cl);
                                        }
                                    });
                                }

                                var _class = angular.copy(val.extra_class);
                                _class += _ec ? " " + _ec : "";

                                if (val.type === 'auto_increment') {
                                    td += "<td class='" + (_class ? " " + _class : '') + " datatableSrNo'>" + (index + 1) + "</td>";
                                } else if (val.type === 'auto_decrement') {
                                    td += "<td class='" + (_class ? " " + _class : '') + " datatableSrNo'>" + (data_length - index) + "</td>";
                                } else if (val.type === "checkbox") {
                                    var checked = false;
                                    if (scope.checked) {
                                        var ch = scope.checked.filter(function(el) {
                                            return el.value == value.id;
                                        });

                                        if (ch && ch.length) {
                                            checked = true;
                                        }
                                        //                                console.log(ch);
                                    }
                                    if (options.editable == undefined || options.editable) {
                                        td += "<td class='" + (_class ? " " + _class : '') + " no_click'>\n\
                                            " + ((value.is_deletable == undefined || value.is_deletable) ? "<input type='checkbox' row_index='" + index + "' id='check_" + value.id + "' name='chkbox[]' class='tdCheckbox' value='" + value.id + "' " + (value.disable_checkbox ? "disabled" : "") + " ng-click='selectParent($event)' " + (checked ? "checked" : "") + " /> <label for='check_" + value.id + "'></label>" : "") + "\n\
                                       </td>";
                                    }
                                } else if (val.type === 'action') {
                                    if (options.editable == undefined || options.editable) {
                                        var btn = "";
                                        if (val.hasOwnProperty("buttons")) {
                                            $.each(val.buttons, function(j, k) {
                                                if (k === "edit" && (value.is_editable == undefined || value.is_editable)) {
                                                    if (options.table_name === 'form') {
                                                        btn += '<a href="" ng-click="edit($event,\'' + value.id + '\')" class="btn btn-primary btn-xs ' + (value.disable_edit ? "disabled" : "") + '" style="display:' + (value.disable_edit ? "none" : "block") + ';"><i class="la la-pencil"></i></a>';
                                                    } else {
                                                        btn += '<a href="" ng-click="edit($event,' + value.id + ')" class="btn btn-primary btn-xs ' + (value.disable_edit ? "disabled" : "") + '" style="display:' + (value.disable_edit ? "none" : "block") + ';"><i class="la la-pencil"></i></a>';
                                                    }
                                                } else if (k === "delete" && (value.is_deletable == undefined || value.is_deletable)) {
                                                    if (options.table_name === 'form') {
                                                        btn += '<a href="javascript:void(0)" ng-click="delete($event,\'' + value.id + '\')" class="btn btn-primary btn-xs ' + (value.disable_delete ? "disabled" : "") + '" style="display:' + (value.disable_delete ? "none" : "block") + ';"><i class="la la-times"></i></a>';
                                                    } else {
                                                        btn += '<a href="javascript:void(0)" ng-click="delete($event,' + value.id + ')" class="btn btn-primary btn-xs ' + (value.disable_delete ? "disabled" : "") + '" style="display:' + (value.disable_delete ? "none" : "block") + ';"><i class="la la-times"></i></a>';
                                                    }
                                                } else if (k === "trash" && (value.is_deletable == undefined || value.is_deletable)) {
                                                    btn += '<a href="javascript:void(0)" ng-click="delete($event,' + value.id + ')" class="btn btn-primary btn-xs ' + (value.disable_delete ? "disabled" : "") + '" style="display:' + (value.disable_delete ? "none" : "block") + ';"><i class="la la-trash"></i></a>';
                                                } else if (k === "done") {
                                                    btn += '<a href="javascript:void(0)" ng-click="delete($event,' + value.id + ')" class="btn btn-primary btn-xs ' + (value.disable_delete ? "disabled" : "") + '" style="display:' + (value.disable_delete ? "none" : "block") + ';"><i class="la la-check"></i></a>';
                                                } else if ($.inArray(k, ['edit', 'delete', 'trash', 'done']) == -1) {
                                                    // check req call from "Form" module
                                                    if (options.defaultSearch.hasOwnProperty('form_id') && options.defaultSearch.form_id != '' && options.table_name === 'form_' + options.defaultSearch.form_id) {
                                                        btn += '<a href="javascript:void(0)" ng-click="callback($event,' + (k.replace(" ", "_")).toLowerCase() + ',' + value.id + ')" class="btn btn-primary btn-xs ' + (value.disable_delete ? "disabled" : "") + '" style="display:' + (value.disable_delete ? "none" : "block") + ';">' + k + '</a>';
                                                    } else {
                                                        btn += '<a href="javascript:void(0)" ng-click="callback($event,' + (k.replace(" ", "_")).toLowerCase() + ',' + value.id + ')" class="btn btn-primary btn-xs ' + (value.disable_delete ? "disabled" : "") + '" style="display:' + (value.disable_delete ? "none" : "block") + ';">' + k + '</a>';
                                                    }
                                                }
                                            });
                                        }
                                        td += "<td class='" + (_class ? " " + _class : '') + " no_click'><div class='btn-group'>" + btn + "</div></td>";
                                    }
                                } else if (val.type == 'tag') {
                                    var span = "";
                                    var put_tag = $.parseJSON(val.tag);
                                    var tag = $.grep(put_tag, function(n, i) {
                                        return n.name == value[val.name];
                                    });

                                    if (tag.length) {
                                        if (tag[0].type && tag[0].type != 'text') {
                                            span = "<span class='label label-" + tag[0].type + "'>" + tag[0].display + "</span>";
                                        } else {
                                            span = "<span>" + tag[0].display + "</span>";
                                        }
                                    }

                                    td += "<td class='" + (_class ? " " + _class : '') + "'>\n\
                                        <p>" + span + "</p>\n\
                                   </td>";
                                } else if (val.type === "image") {
                                    if (val.attribute_id) {
                                        var v = $.grep(scope.attribute, function(a) {
                                            return a.attribute_id == val.attribute_id && a.reference_id == value.id;
                                        });

                                        var _val = "<i class=\"la la-file-o\"></i>";

                                        if (v.length) {
                                            if (v[0]['value']) {
                                                var fileData = $iconsService(v[0]['value']);
                                                if (fileData.file_type === 'image') {
                                                    _val = '<a href="' + v[0]['url'] + '" target="_blank"><img src="' + v[0]['thumbnail_url'] + '" /></a>';
                                                } else {
                                                    _val = '<a href="' + v[0]['url'] + '" target="_blank">' + fileData.icon + '</a>';
                                                }
                                            }
                                        }

                                        td += "<td class='no_click attr_table_image " + (_class ? " " + _class : '') + "'>" + _val + "</td>";
                                    } else {
                                        var filepath = value[val.name];
                                        if (value[val.name] !== null) { //filepath.isFile){
                                            // show preview for form datatable                                            
                                            if (options ? .table_name && options.table_name.indexOf('form_') > -1) {
                                                var _fileData = $iconsService(value[val.name]);
                                                if (_fileData.file_type === 'image') {
                                                    _val = '<a href="' + value[val.name] + '" target="_blank"><img src="' + value[val.name] + '" /></a>';
                                                } else {
                                                    _val = '<a href="' + value[val.name] + '" target="_blank">' + _fileData.icon + '</a>';
                                                }
                                                td += "<td class='no_click attr_table_image " + (_class ? " " + _class : '') + "'>" + _val + "</td>";
                                            } else {
                                                td += "<td class='" + (_class ? " " + _class : '') + "'><img src='" + filepath + "' style='max-height: 50px; max-width: 50px;' /></td>";
                                            }
                                        } else {
                                            td += "<td class='" + (_class ? " " + _class : '') + "'><i class=\"la la-camera\"></i></td>";
                                        }
                                    }
                                } else if (val.type === "audio") {
                                    if (val.attribute_id) {
                                        var v = $.grep(scope.attribute, function(a) {
                                            return a.attribute_id == val.attribute_id && a.reference_id == value.id;
                                        });

                                        var _val = "<i class=\"la la-file-o\"></i>";

                                        if (v.length) {
                                            if (v[0]['value']) {
                                                var fileData = $iconsService(v[0]['value']);
                                                if (fileData.file_type === 'image') {
                                                    _val = '<a href="' + v[0]['url'] + '" target="_blank"><img src="' + v[0]['thumbnail_url'] + '" /></a>';
                                                } else {
                                                    _val = '<a href="' + v[0]['url'] + '" target="_blank">' + fileData.icon + '</a>';
                                                }
                                            }
                                        }

                                        td += "<td class='no_click attr_table_image " + (_class ? " " + _class : '') + "'>" + _val + "</td>";
                                    } else {
                                        var filepath = value[val.name];
                                        if (filepath !== null) { //filepath.isFile){
                                            td += "<td class='" + (_class ? " " + _class : '') + "' ng-click='showRecording($event,\"" + filepath + "\")'><i class=\"la la-microphone\"></i></td>";
                                        } else {
                                            td += "<td class='" + (_class ? " " + _class : '') + "'>-</td>";
                                        }
                                    }
                                } else if (val.type === "dynamic_color_tag") {
                                    var style = '';
                                    if (value['color']) {
                                        var font_color = scope.colorFromHexCode(value['color']);
                                        if (font_color == '#222') {
                                            style = "border: 1px solid #eee;";
                                        }
                                    } else {
                                        var font_color = '#222';
                                    }
                                    td += "<td class='" + (_class ? " " + _class : '') + "'><p><span class='label' style='" + style + "background-color: " + value['color'] + "; color: " + font_color + " '>" + (value[val.name] ? value[val.name] : '-') + "</span></p></td>";
                                } else {
                                    if (val.attribute_id) {
                                        var v = $.grep(scope.attribute, function(a) {
                                            return a.attribute_id == val.attribute_id && a.reference_id == value.id;
                                        });

                                        var _val = "-";

                                        if (v.length) {
                                            if (v[0]['value']) {
                                                _val = v[0]['value'];
                                            } else if (v[0]['option_name']) {
                                                _val = v[0]['option_name'];
                                            } else if (v[0]['foreign_value']) {
                                                _val = v[0]['foreign_value'];
                                            } else if (v[0]['date_value']) {
                                                _val = $rootScope.convertToLocalTime(v[0]['date_value']);
                                            }
                                        }

                                        td += "<td class='" + (_class ? " " + _class : '') + "'><p>" + _val + "</p></td>";

                                    } else {
                                        var _v = "-";

                                        if (val.is_quantity) {
                                            if (val.expression) {
                                                var str = val.expression.split(":");
                                                var fun = str[0];
                                                var values = str[1].split(",");
                                                value[val.name] = scope[str[0]](value[values[0]], value[values[1]]);
                                            }
                                            _v = $unit.parse(value[val.name], value[val.is_quantity.unit_id_column]) + " " + (value[val.is_quantity.unit_name_column] ? value[val.is_quantity.unit_name_column] : "") + " " + (value[val.name + "_other"] ? value[val.name + "_other"] : "");
                                        } else {
                                            if (value[val.name] !== null && options.filter && options.filter.hasOwnProperty(val.name)) {
                                                let args = [...options.filter[val.name].split('|')];
                                                const filterName = args[0];
                                                args.shift();
                                                _v = $filter(filterName)(value[val.name], ...args);
                                            } else if (value[val.name] !== null) {
                                                _v = value[val.name];
                                            }
                                        }

                                        td += "<td class='" + (_class ? " " + _class : '') + "'><p>" + _v + "</p></td>";
                                    }
                                }
                            });

                            // all form datatable
                            if (options.table_name === 'form') {
                                tableData += "<tr id='" + value.id + "' ng-click='view($event,\"" + value.id + "\")' class='" + (options.unseen_column && value[options.unseen_column] == 0 ? 'unseen' : "") + "'>" + td + "</tr>";
                            } else {
                                tableData += "<tr id='" + value.id + "' ng-click='view($event," + value.id + ", \"" + (value.hasOwnProperty("text") && value.text ? value.text : (value.hasOwnProperty("name") && value.name ? value.name : "")) + "\")' class='" + (options.unseen_column && value[options.unseen_column] == 0 ? 'unseen' : "") + "'>" + td + "</tr>";
                            }
                        });

                        if (options.showTotal) {
                            tableData += "<tr>\n\
                                    <td colspan='" + (scope.column.length - 1) + "' class='right'><b>Total</b></td>\n\
                                    <td class='right'>" + (scope.row_total != undefined ? scope.row_total.toFixed(2) : '0.00') + "</td>\n\
                                 </tr>";
                        }
                    }
                    element.find("tbody#putBodyData").html(tableData);
                    $compile(element.find("tbody#putBodyData").contents())(scope);

                    setTimeout(function() {
                        if ($(".scrollable .datatable_inner").length) {
                            if ($(".scrollable .datatable_inner").scrollLeft() + $(".scrollable .datatable_inner").innerWidth() < $(".scrollable .datatable_inner")[0].scrollWidth) {
                                $(".scrollable .datatable_inner .scrollRight").css("display", "block");
                            }
                        }

                        if (scope.checked) {
                            $.each(scope.checked, function(i, val) {
                                $("#check_" + val.value).prop("checked", true);
                            });
                        }

                    }, 500);

                };

                scope.colorFromHexCode = function(hexcolor) {
                    // If a leading # is provided, remove it
                    if (hexcolor.slice(0, 1) === '#') {
                        hexcolor = hexcolor.slice(1);
                    }
                    // If a three-character hexcode, make six-character
                    if (hexcolor.length === 3) {
                        hexcolor = hexcolor.split('').map(function(hex) {
                            return hex + hex;
                        }).join('');
                    }
                    // Convert to RGB value
                    var r = parseInt(hexcolor.substr(0, 2), 16);
                    var g = parseInt(hexcolor.substr(2, 2), 16);
                    var b = parseInt(hexcolor.substr(4, 2), 16);

                    // Get YIQ ratio
                    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
                    // Check contrast
                    return (yiq >= 228) ? '#222' : '#fff';
                }

                // set Footer
                scope.setFooter = function() {
                    var tableFoot = "";
                    var column = Object.keys(scope.column).length;

                    if (Object.keys(scope.data).length) {
                        tableFoot = "<div class='table_record table_pagginate hidden-print'>";

                        if (scope.from && scope.to && options.paging && options.showCount) {
                            if (options.paging == 'simple') {
                                tableFoot += (options.showTotalCount ? "<a href='javascript:void(0)' ng-click='getTotalCount()' class='total_count'>Total Count</a> <span id='total_count'></span> | " : "") + "Show <input type='text' class='text' ng-model='rows_per_page' ng-enter='changePerPage()' style='width:50px; margin:0 10px;' /> Rows per page <span class='text-danger small'>{{rows_per_page_error}}</span>";
                            } else if (scope.total) {
                                tableFoot += "Showing " + scope.from + " to " + scope.to + " of " + scope.total + "&nbsp;&nbsp;|&nbsp;&nbsp;" +
                                    "Show <input type='text' class='text' ng-model='rows_per_page' ng-enter='changePerPage()' style='width:50px; margin:0 10px;' /> Rows per page <span class='text-danger small'>{{rows_per_page_error}}</span>";
                            }
                        }

                        if (options.manage_column) {
                            tableFoot += "<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span><button ng-click='manageColumn()' class='btn btn-primary btn-sm manage_column'>Manage Column</button>"
                        }

                        tableFoot += "</div>";

                        if (options.paging) {
                            if (options.paging == 'simple') {
                                tableFoot += "<div class='pull-right hidden-print simple_pagination_main'>";
                                tableFoot += "<span ng-click='simplePaginationFunction(\"prev\")' class='simple_pagination' ng-class='{\"text-muted\": !prev_page_url}'><i class='la la-angle-left'></i></span>";
                                tableFoot += "<span class='text-muted'>" + scope.from + " - " + scope.to + "</span>";
                                tableFoot += "<span ng-click='simplePaginationFunction(\"next\")' class='simple_pagination' ng-class='{\"text-muted\": !next_page_url}'><i class='la la-angle-right'></i></span>";
                                tableFoot += "</div>";
                            } else if (scope.link) {
                                tableFoot += "<pagination max-size='5' rotate='false' total-items='total' items-per-page='per_page' ng-model='search.page' ng-change='paginationFunction()'></pagination>";
                            }
                        }
                    } else if (Object.keys(scope.column).length) {

                        var search = $location.search();
                        if (parseInt(search.page) - 1) {
                            $location.search('page', parseInt(search.page) - 1);
                        } else {
                            tableFoot = "<div><p class='text-center'>No Data Found</p></div>";
                        }
                    } else {
                        tableFoot = "<div><p class='text-center'>Please Wait...</p></div>";
                    }

                    element.find(".tfoot#putFootData").html(tableFoot);
                    $compile(element.find(".tfoot#putFootData").contents())(scope);
                };

                // total quantity display in view
                scope.totalQuantity = function() {
                    var total_quantity = [];
                    $.each(scope.data, function(i, val) {
                        if (val.display_unit_id == null) {
                            val.display_unit_id = 0;
                        }
                        if (total_quantity[val.display_unit_id]) {
                            total_quantity[val.display_unit_id]['quantity'] += parseFloat(val.quantity);
                            total_quantity[val.display_unit_id]['count'] += 1;
                        } else {
                            const unit_name = val.display_unit_name ? (val.display_unit_name).split('[')[0] : val.display_unit_name;
                            total_quantity[val.display_unit_id] = {
                                'unit_id': val.display_unit_id,
                                'name': unit_name,
                                'count': 1,
                                'quantity': parseFloat(val.quantity)
                            };
                        }
                    });
                    total_quantity = total_quantity.filter(function(val) {
                        return val !== null;
                    });
                    if (options.module == 'deliveryReceipt') {
                        scope.deliveryReceipt.total = total_quantity;
                    } else if (options.module == 'goodsIn') {
                        scope.goodsIn.total = total_quantity;
                    } else if (options.module == 'goodsOut') {
                        scope.goodsOut.total = total_quantity;
                    } else if (options.module == 'grn') {
                        scope.grn.total = total_quantity;
                    } else if (options.module == 'production') {
                        scope.production.total = total_quantity;
                    } else if (options.module == 'warehouseTransfer') {
                        scope.warehouseTransfer.total = total_quantity;
                    }
                };

                // search function
                scope.searchFunction = function(data, model) {
                    if (data || model) {
                        if (data && model) {
                            scope.search[model + '_text'] = data.text;
                        } else {
                            delete scope.search[model + '_text'];
                        }
                    }
                    scope.$parent.$parent.search = scope.search;
                    scope.getTable(false);
                    if (options.searchFromUrl) {
                        $location.search($.param(scope.search));
                    }
                };

                // search function
                scope.changePerPage = function(data) {
                    scope.rows_per_page_error = "";
                    if (scope.rows_per_page <= 1000) {
                        $location.search('rows_per_page', scope.rows_per_page);
                        scope.search.rows_per_page = scope.rows_per_page;
                        scope.search.page = 1;
                        scope.search.rows_per_page = scope.rows_per_page;
                        scope.getTable(false);
                        if (options.searchFromUrl) {
                            scope.$parent.$parent.search = scope.search;
                            //$location.search($.param(scope.search));
                        }
                    } else {
                        scope.rows_per_page_error = "(Please Set < 1000 Numer.)";
                    }
                };

                // pagination function
                scope.paginationFunction = function() {
                    scope.getTable(false);
                    if (options.searchFromUrl) {
                        $location.search($.param(scope.search));
                    }
                };

                scope.simplePaginationFunction = function(type) {
                    if (type == 'next' && scope.next_page_url) {
                        scope.search.page = scope.search.page + 1;
                        scope.getTable();
                        if (options.searchFromUrl) {
                            $location.search($.param(scope.search));
                        }
                    } else if (type == 'prev' && scope.prev_page_url) {
                        scope.search.page = scope.search.page - 1;
                        scope.getTable();
                        if (options.searchFromUrl) {
                            $location.search($.param(scope.search));
                        }
                    }
                };

                // Sorting
                scope.sort = function(sortable, column) {
                    if (sortable) {
                        if (scope.search.sortBy !== column) {
                            scope.search.sortBy = column;
                            scope.search.asc = true;
                        } else {
                            scope.search.asc = !scope.search.asc;
                        }
                        scope.search.page = "";
                        scope.getTable(false);
                        if (options.searchFromUrl) {
                            $location.search($.param(scope.search));
                        }
                    }
                };

                // View
                scope.view = function($event, id, text) {
                    if (!$($event.target).hasClass("no_click") && !$($event.target).closest('.no_click').length && options.active) {
                        if (options.viewUrl) {
                            window.location.href = options.viewUrl + "/" + id;
                        } else if (options.viewFunction) {
                            scope[options.viewFunction](id, text);
                        }
                    }
                };

                scope.showRecording = function($event, url) {
                    // Do something
                    $event.stopPropagation();
                    let html = '<audio controls class="audio_modal_view">' +
                        '<source src="' + url + '">' +
                        '</audio>';
                    html += '<p class="mediaName">Recorded Audio<span class="pull-right" ng-click="closeRecordingModal()"><i class="la la-times"></i></span></p>';
                    scope.modalInstance = $modal.open({
                        template: '<div class="modal-body image_view">' + html + '</div>',
                        scope: scope,
                        windowClass: 'customModal',
                        backdropClass: 'customBackdrop'
                    });
                    setTimeout(function() {
                        $(".audio_modal_view")[0].play();
                    }, 700);
                }

                scope.closeRecordingModal = function() {
                    $(".audio_modal_view")[0].pause();
                    scope.modalInstance.dismiss('cancel');
                }

                // Edit
                scope.edit = function($event, id) {
                    if (options.editable) {
                        if (options.editUrl) {
                            window.location.href = options.editUrl + "/" + id;
                        } else if (options.editFunction) {
                            scope[options.editFunction](id);
                        }
                    }
                };

                // Delete
                scope.delete = function($event, id) {
                    if (options.editable) {
                        if (options.deleteUrl) {
                            window.location.href = options.deleteUrl + "/" + id;
                        } else if (options.deleteFunction) {
                            scope[options.deleteFunction](id);
                        }
                    }
                };

                // Callback
                scope.callback = function($event, function_name, id) {
                    if (typeof function_name == 'function') {
                        function_name(id);
                    } else {
                        window.location.href = function_name + "/" + id;
                    }
                };

                scope.selectAll = function() {
                    if (scope.selected) {
                        element.find(".tdCheckbox").prop("checked", true);
                    } else {
                        element.find(".tdCheckbox").prop("checked", false);
                    }
                };

                scope.lastChecked = null;

                scope.selectParent = function(e) {

                    var checked = $(e.target).attr("row_index");

                    if (!scope.lastChecked) {
                        scope.lastChecked = checked;
                        return
                    }

                    if (e.shiftKey) {
                        element.find(".tdCheckbox").prop('checked', false);
                        var start = scope.lastChecked;
                        var end = checked;

                        var min = Math.min(start, end);
                        var max = Math.max(start, end);

                        for (var i = min; i <= max; i++) {
                            $("[row_index='" + i + "']").prop('checked', true);
                        }
                    } else {
                        if ($(e.target).is(":checked")) {
                            scope.lastChecked = checked;
                        }
                    }

                    if (element.find(".tdCheckbox").length == element.find(".tdCheckbox:checked").length) {
                        $("#select_all").prop("checked", true);
                        scope.selected = true;
                    } else {
                        $("#select_all").prop("checked", false);
                        scope.selected = false;
                    }
                }

                // manage column
                scope.manageColumn = function() {
                    var $modalInstance = $modal.open({
                        templateUrl: 'template/manageColumn.html',
                        controller: "ManageColumnModal",
                        scope: scope,
                        resolve: {
                            modalData: function() {
                                return {
                                    table_name: options.table_name
                                };
                            }
                        }
                    }).result.then(function() {}, function() {
                        $rootScope.$broadcast('eventFired');
                    });
                }

                scope.diff = function(val1, val2) {
                    return val1 - val2;
                }

                scope.getTotalCount = function() {
                    $http({
                        url: options.baseUrl + "/count",
                        method: "post",
                        autoFocus: false,
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            sortBy: scope.search.sortBy,
                            asc: scope.search.asc,
                            search: scope._scopeSearch,
                            rows_per_page: scope.rows_per_page
                        }
                    }).then(function(response) {
                        $("#total_count").html(": " + response.data.data.count);
                    }, function(response) {});
                }

                // Refresh
                scope.$on('refreshTable', function(event, args) {
                    $location.url($location.path());
                    scope.selected = "";
                    // pass form_id in default search object when module is form
                    if (args == undefined && scope.search.hasOwnProperty("form_id")) {
                        scope.search = {
                            status: 0,
                            form_id: scope.search.form_id
                        };
                    } else {
                        scope.search = args != undefined && args.hasOwnProperty("search") ? args.search : {
                            status: "0"
                        };
                    }
                    scope.getTable(true);
                });

                // getTable
                scope.$on('getTable', function(event, args) {
                    var getColumn = false;
                    var _get = true;
                    if (args != undefined) {
                        getColumn = args.hasOwnProperty("getColumn") ? args.getColumn : false;
                        if (args.hasOwnProperty("changeSearch") && args.changeSearch) {
                            scope.search = args != undefined && args.hasOwnProperty("search") ? args.search : $location.search();
                        }
                        if (args.hasOwnProperty("table_name") && args.table_name && args.table_name != options.table_name) {
                            _get = false;
                        }
                        /*if(args.hasOwnProperty('checked') && args.checked) {
                            scope.checked = args.checked;
                        }*/
                    }

                    if (_get) {
                        scope.getTable(getColumn);
                    }
                });
            }
        }
    });

    table.controller("ManageColumnModal", function($rootScope, $scope, $controller, $http, $modalInstance, modalData, $sticky) {
        $rootScope.modalInstance = $modalInstance;
        $scope.table_name = modalData.table_name;

        $scope.breadcrumb = [
            ['Manage Column', 'manageColumn']
        ];

        $scope.back = function() {
            //$modalInstance.dismiss('cancel');
            $modalInstance.dismiss();
            delete $rootScope.modalInstance;
        };

        $scope.nodes = [];

        $http({
            url: serverUrl + "/public/common/getColumn/" + $scope.table_name,
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(function(response) {
            $scope.nodes = response.data;
        }, function(rejection) {
            $sticky.error((rejection.data.hasOwnProperty('error_description') ? rejection.data.error_description : messages.some_error), 4000);
        });

        $scope.save = function() {
            $http({
                url: serverUrl + "/public/common/saveUserColumn/" + $scope.table_name,
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    column: $scope.nodes
                },
            }).then(function(response) {
                $modalInstance.dismiss();
                $scope.getTable(true);
                delete $rootScope.modalInstance;
            }, function(rejection) {
                $sticky.error((rejection.data.hasOwnProperty('error_description') ? rejection.data.error_description : messages.some_error), 4000);
            });
        }
    });
});