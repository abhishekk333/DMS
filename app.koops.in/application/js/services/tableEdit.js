/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Table App
    var tableEdit = angular.module("tableEdit", []);

    tableEdit.directive('tableEdit', function($parse, $location, $rootScope, $http, $compile, $modal, $filter) {

        return {
            restrict: "A",
            scope: true,
            link: function(scope, element, attr) {
                var opt = scope.$eval(attr.tableEdit);

                opt.table_name_display = opt.table == 'account' ? 'customer' : opt.table.replace(/_/g, ' ');

                element.click(function($event) {
                    $event.stopPropagation();
                    if ($(".tdCheckbox:checked").length) {
                        opt.list = $(".tdCheckbox").serializeArray();

                        var $modalInstance = $modal.open({
                            templateUrl: "template/tableEdit.html",
                            scope: scope,
                            controller: "editModalCtrl",
                            resolve: {
                                editModalData: function() {
                                    return {
                                        input: opt
                                    };
                                }
                            }
                        });
                    } else {
                        $rootScope.modalInstance = $modal.open({
                            template: '<div class="modal-header">' +
                                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="deactivateCancel()" >×</button>' +
                                '<h3 class="modal-title">' + sprintf(messages.not_selected_heading, opt.table_name_display) + '</h3>' +
                                '</div>' +
                                '<div class="modal-body"> You have not selected any ' + opt.table_name_display + '  to edit. Please select atleast one ' + opt.table_name_display + ' to edit.' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                '<button class="btn btn-important" ng-click="deactivateCancel()">OK</button>' +
                                '</div>',
                            scope: $rootScope
                        });
                        return false;
                    }
                });
            }
        }
    });

    tableEdit.controller("editModalCtrl", function($modalInstance, $scope, $timeout, $rootScope, $modal, $controller, $http, $modalInstance, editModalData, $sticky, $compile) {
        $scope.list = editModalData.input.list;
        $scope.table = editModalData.input.table;
        $scope.table_name_display = editModalData.input.table_name_display;
        $scope.column = angular.copy(editModalData.input.column);
        $scope.url = editModalData.input.url;

        $scope.data = {};

        var html = '';

        $scope.setView = function() {
            var _i = 0;
            $.each($scope.column, function(i, val) {
                $scope.selected_data = '';
                $scope.allowClear = true;

                var ngIf = "",
                    data = "";
                var auto_focus = _i == 0 ? "auto-focus" : "";

                if (i == 'parent_id') {
                    ngIf = 'data.level > 0';
                }

                if (i == 'level') {
                    val.option = [{
                        id: 0,
                        name: $scope.customer_level[0],
                        selected: true
                    }];
                    $scope.data.level = "0";
                    if ($scope.enable_secondary_sales > 0) {
                        val.option.push({
                            id: 1,
                            name: $scope.customer_level[1]
                        });
                    }
                    if ($scope.enable_secondary_sales > 1) {
                        val.option.push({
                            id: 2,
                            name: $scope.customer_level[2]
                        });
                    }
                    if ($scope.enable_secondary_sales > 2) {
                        val.option.push({
                            id: 3,
                            name: $scope.customer_level[3]
                        });
                    }
                    $scope.allowClear = false;
                }

                if (i == 'lead_status') {
                    $scope.selected_data = {
                        id: $scope.lead_status.id,
                        text: $scope.lead_status.text
                    };
                    $scope.data.lead_status = $scope.lead_status.id;
                    $scope.allowClear = false;
                }

                if (i == 'deal_pipeline') {
                    $scope.data.deal_pipeline = 0;
                    $scope.allowClear = false;
                }

                if (i == 'payment_type') {
                    $scope.data.payment_type = 0;
                }

                if ($scope.table == "expense_to_user") {
                    $scope.data.expense = 0;
                    $scope.data.amount = 0;
                }

                if (i == 'owner') {
                    $scope.selected_data = {
                        id: $rootScope.USERCONST._ksuserid,
                        text: $rootScope.USERCONST._ksname
                    };
                    $scope.data.owner = $rootScope.USERCONST._ksuserid;
                    $scope.allowClear = false;
                }

                if (i == 'is_new') {
                    $scope.data.is_new = 0;
                }

                if (i == 'approve_amount') {
                    ngIf = 'data.expense_status == 1';
                }

                if (i == 'reason') {
                    ngIf = 'data.expense_status == 1 || data.expense_status == 2';
                }

                var input = '<div class="box" ' + (ngIf ? "ng-if='" + ngIf + "'" : "") + '><div class="box_label">' + val.display + '</div><div class="box_input">';
                if (val.type == 'dropdown' || val.type == 'multi_select') {
                    if (val.source) {
                        input += '<input id="' + i + '" type="hidden" ui-select2-data=\'' + JSON.stringify($scope.selected_data) + '\'  ng-model="data.' + i + '" ui-select2="{ajax_url:\'' + val.source + '\', placeholder:\'Select ' + (val.display) + '\' ' + (val.type == 'multi_select' ? ", multiple:true" : "") + ',data:getDependData, allowClear: ' + ($scope.allowClear ? 1 : 0) + '}" ' + auto_focus + ' />' +
                            '<p class="text-danger small">{{' + i + '_error}}</p>';
                    } else if (val.option) {
                        input += "<select id='" + i + "' ng-model='data." + i + "' ui-select2='{placeholder:\"Select " + val.display + "\", allowClear: " + ($scope.allowClear ? 1 : 0) + "}' " + (val.type == 'multi_select' ? "multiple" : "") + " " + auto_focus + "><option></option>";
                        $.each(val.option, function(j, k) {
                            input += "<option value='" + k.id + "'" + (k.selected ? " selected" : "") + ">" + k.name + "</option>";
                        });
                        input += "</select>";
                    }
                } else if (val.type == 'radio') {
                    if (val.option) {
                        $scope.data[i] = val.option[0]['id'];
                        $.each(val.option, function(j, k) {
                            input += "<input type='radio' name='" + i + "' value='" + k.id + "' ng-model='data." + i + "' id='table_edit_radio_" + i + "_" + k.id + "' /> <label for='table_edit_radio_" + i + "_" + k.id + "'>" + k.name + "</label>&nbsp;&nbsp;&nbsp;&nbsp;";
                        });
                    }
                } else if (val.type == 'checkbox') {
                    if (val.option) {
                        $.each(val.option, function(j, k) {
                            input += "<input ng-model='data." + i + "' ng-true-value='1' ng-false-value='0' type='checkbox' id='table_edit_checkbox_" + i + "_" + k.id + "' /> <label for='table_edit_checkbox_" + i + "_" + k.id + "'>" + k.name + "</label>&nbsp;&nbsp;&nbsp;&nbsp;";
                        });
                    }
                } else if (val.type == 'date') {
                    input += '<div class="input-group date" k-datepicker="">\n\
                                    <input type="text" class="text" placeholder="Select ' + val.display + '" ng-model="data.' + i + '" ' + auto_focus + ' />\n\
                                    <span class="input-group-addon text_date_icon"><i class="la la-calendar"></i></span>\n\
                               </div>';
                } else if (val.type == 'text') {
                    input += '<input class="text" placeholder="Enter ' + val.display + '" id="' + i + '" type="text"  ng-model="data.' + i + '" ' + auto_focus + ' />' +
                        '<p class="text-danger small">{{' + i + '_error}}</p>';
                } else if (val.type == 'textarea') {
                    input += '<textarea class="text" placeholder="Enter ' + val.display + '" id="' + i + '" ng-model="data.' + i + '" ' + auto_focus + ' ></textarea>' +
                        '<p class="text-danger small">{{' + i + '_error}}</p>';
                }

                input += '</div></div>';
                $('.editCustomerLoader').addClass('hidden');
                $('#show_details').append(input);
                $compile($('#show_details').contents())($scope);

                _i++;
            });
        };

        $scope.account_assign = false;

        $scope.setViewMain = function() {
            if ($scope.column.hasOwnProperty("level") || $scope.column.hasOwnProperty("parent")) {
                $http({
                    url: serverUrl + "/public/common/web/getAccountAssignSetting",
                    method: "post",
                }).then(function(response) {
                    $scope.account_assign = response.data.account_assign == 'accountwise';
                    $scope.enable_secondary_sales = response.data.enable_secondary_sales;
                    $scope.customer_level = $.parseJSON(response.data.customer_level);
                    $scope.setView();
                });
            } else if ($scope.column.hasOwnProperty("lead_status")) {
                $http({
                    url: serverUrl + "/public/common/web/getFirstLeadStatus",
                    method: "post",
                }).then(function(response) {
                    $scope.lead_status = {
                        id: response.data.id,
                        text: response.data.name
                    };
                    $scope.setView();
                });
            } else {
                $scope.setView();
            }
        }

        $scope.getDependData = function(id) {
            var data = {};
            data.status = 0;
            if (id == 'parent_id') {
                data.level = $scope.data.level;
            } else if (id == 'area_id') {
                data.city = $scope.data.city_id;
            } else if (id == 'city_id') {
                data.state = $scope.data.state_id;
            } else if (id == 'state_id') {
                data.country = $scope.data.country_id;
            } else if (id == 'collaborators') {
                data.not_in_owner = $scope.data.owner;
                data.without_child = true;
            } else if (id == 'deal_pipeline_stage') {
                data.deal_pipeline = $scope.data.deal_pipeline;
            }
            return data;
        }

        $(document).on("change", "#level, #country_id, #state_id, #city_id, #area_id", function(evt) {
            var id = $(this).attr("id");
            var clear = [];
            if (id == 'level') {
                $("#parent_id").select2("val", "");
                delete $scope.data.parent_id;
            } else if (id == 'country_id') {
                $("#state_id").select2("val", "");
                $("#city_id").select2("val", "");
                $("#area_id").select2("val", "");
                delete $scope.data.state_id;
                delete $scope.data.city_id;
                delete $scope.data.area_id;
            } else if (id == 'state_id') {
                $("#city_id").select2("val", "");
                $("#area_id").select2("val", "");
                delete $scope.data.city_id;
                delete $scope.data.area_id;
            } else if (id == 'city_id') {
                $("#area_id").select2("val", "");
                delete $scope.data.area_id;
            }

            if (evt.val) {

                if ($.inArray(id, ['state_id', 'city_id', 'area_id']) > -1) {
                    var parent = "";
                    if (id == 'state_id') {
                        parent = "country_id";
                    } else if (id == 'city_id') {
                        parent = "state_id";
                    } else if (id == 'area_id') {
                        parent = "city_id";
                    }

                    $(".btn").prop("disabled", true);

                    $http({
                        url: serverUrl + "/public/common/web/getParentArea/" + evt.val,
                        method: "post",
                        spinner: false,
                    }).then(function(response) {
                        if (response.data.id) {
                            $scope.data[parent] = response.data.id;
                            $timeout(function() {
                                $("#" + parent).select2('data', {
                                    'id': response.data.id,
                                    'text': response.data.name
                                });
                            });

                            if (response.data.state && response.data.state.id) {
                                $scope.data.state_id = response.data.state.id;
                                $timeout(function() {
                                    $("#state_id").select2('data', {
                                        'id': response.data.state.id,
                                        'text': response.data.state.name
                                    });
                                });
                            }
                            if (response.data.country && response.data.country.id) {
                                $scope.data.country_id = response.data.country.id;
                                $timeout(function() {
                                    $("#country_id").select2('data', {
                                        'id': response.data.country.id,
                                        'text': response.data.country.name
                                    });
                                });
                            }
                        }
                        $(".btn").prop("disabled", false);
                    }, function(rejection) {
                        $(".btn").prop("disabled", false);
                    });
                }

                $scope.data[id] = evt.val;
            }

        });

        $scope.saveEdit = function() {
            if ($scope.data.expected_closing_date == "") {
                $scope.data = "";
            }
            if (Object.keys($scope.data).length == 0) {
                $scope.warning = $modal.open({
                    template: '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="deactivateCancel()" >×</button>' +
                        '<h3 class="modal-title"> Value not entered. </h3>' +
                        '</div>' +
                        '<div class="modal-body"> You have not entered any value. This will make this field empty for each ' + $scope.table_name_display + ' selected.' +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button class="btn btn-important" ng-click="saveConfirm()">Yes</button>' +
                        '<button class="btn btn-important" ng-click="closeWarning()">No</button>' +
                        '</div>',
                    scope: $scope
                });
            } else {
                $scope.saveConfirm();
            }
        }

        $scope.saveConfirm = function() {
            if ($scope.warning) {
                $scope.warning.close();
            }

            $scope.parent_id_error = "";

            $.each($scope.column, function(i, val) {
                if ($scope.data[i]) {
                    $scope.column[i]['value'] = $scope.data[i];
                    if ($scope.column[i]['type'] && $scope.column[i]['type'] == 'date') {
                        $scope.column[i]['value'] = $rootScope.convertToServerTime($scope.column[i]['value'], 'YYYY-MM-DD HH:mm:ss', 'DD-MM-YYYY');
                    }
                }
            });

            setTimeout(function() {
                $http({
                    url: $scope.url,
                    method: "post",
                    data: {
                        column: $scope.column,
                        list: $scope.list,
                        table: $scope.table
                    },
                }).then(function(response) {
                    if (response.data.errorDetails) {
                        $scope.show_error = true;
                        $scope.errorDetails = response.data.errorDetails;
                    } else {
                        $scope.data = {};
                        $modalInstance.close();
                        $sticky.success(response.data.hasOwnProperty("success_description") ? response.data.success_description : sprintf(messages.updated, 'Accounts'));
                    }
                    $rootScope.$broadcast('getTable', {
                        checked: $scope.list
                    });
                }, function(rejection) {
                    var data = rejection.data;
                    if (data.error == 'validation_error') {
                        $.each(data.error_data, function(i, val) {
                            $scope[i + "_error"] = val['0'];
                        });
                    } else {
                        $sticky.error(data.hasOwnProperty('error_description') ? data.error_description : messages.some_error);
                    }
                });
            });
        }

        $scope.closeWarning = function() {
            $scope.warning.close();
        }

        $scope.close = function() {
            $modalInstance.close();
        }

        $scope.showErrorDetails = function() {
            $scope.show_details = true;
            var html = '';
            $.each($scope.errorDetails, function(i, val) {
                html += '<tr>' +
                    '<td>' + val.name + '</td>' +
                    '<td>' + val.error + '</td>' +
                    '</tr>';
            });
            setTimeout(function() {
                $('#tableErrors').find('tbody').html(html);
                $compile($('#tableErrors').find("tbody tr").contents())($scope);
            });
        }
    });
});