define(['angularAMD', 'ng-upload', 'smsService', 'mailService'], function(angularAMD) {

    var activityService = angular.module("activityService", ['ng-upload', 'smsService', 'mailService']);

    // factory for activity
    activityService.factory('$activityService', function($http, $location, $sce, $modal, $compile, $rootScope) {

        var data = {};
        var _icon = {
            'Task': 'calendar-check-o',
            'Call': 'phone',
            'Visit': 'map-marker',
            'Meeting': 'users',
            'Note': 'comment',
            'SMS': 'comments',
            'Mail': 'envelope',
            'order': 'shopping-cart',
            'sale_quotation': 'check-square-o',
            'estimate': 'calculator',
            'sales_return': 'mail-reply',
            'dispatch': 'truck',
            'payment_collection': 'money',
            'production': 'cart-plus',
            'grn': 'check-square-o',
            'goods_in': 'download',
            'goods_out': 'upload',
            'delivery_receipt': 'file-text-o',
            'invoice': 'file-text-o',
            'warehouse_transfer': 'exchange',
            'expense': 'beer',
            'account': 'user',
            'deal': 'thumbs-up',
            'lead': 'user',
            'purchase_order': 'cart-arrow-down',
            'worker': '',
            'job': 'flask',
            'leave': 'user-times',
            'incoming': 'arrow-circle-o-down',
            'outgoing': 'arrow-circle-o-up',
            'missed': 'minus-circle',
            'voicemail': 'microphone',
            'rejected': 'times-circle-o',
            'blocked': 'dot-circle-o',
            'complaint': 'ticket',
            'user': 'users',
            'product': 'cubes'
        }

        // Open activity create modal
        data.addActivity = function(data) {
            var url = "modules/activity/activity/activityCreate.html";
            var controller = "ActivityModal";

            if (data) {
                if (data.type == 'note') {
                    url = "modules/activity/activity/noteCreate.html";
                    controller = "NoteModal";
                } else if (data.type == 'sms') {
                    url = "modules/sms/sms/sendSms.html";
                    controller = "SmsModal";
                } else if (data.type == 'mail') {
                    url = "modules/mail/mail/sendMail.html";
                    controller = "MailModal";
                }
            }

            var $modalInstance = $modal.open({
                templateUrl: url,
                controller: controller,
                resolve: {
                    data: function() {
                        return data;
                    },
                }
            });
        }

        data.getIcon = function(_data) {
            var icon = 'circle';
            if (_data && _icon[_data] != undefined) {
                icon = _icon[_data];
            }
            return icon;
        }

        return data;
    });

    // Activity Create Modal Controller
    activityService.controller("ActivityModal", function($scope, $controller, $stateParams, $http, $location, $rootScope, $modal, $modalInstance, $sticky, data) {

        $scope.data = data;

        $scope.timeData = [];
        for (var i = 0; i < 24; i++) {
            var h = (i == 0 ? 12 : (i > 12 ? i - 12 : i));
            var mar = (i >= 12 ? 'PM' : 'AM');
            var j = 0;
            while (j < 60) {
                var _h = ('0' + h).slice(-2);
                var _j = ('0' + j).slice(-2);
                $scope.timeData.push(_h + ":" + _j + " " + mar);
                j += 5;
            }
        }

        $scope.getActivityType = function() {
            $http({
                url: serverUrl + "/public/common/web/getActivityTypeButton",
                method: "post",
                data: {
                    only_task: true
                },
            }).then(function(response) {
                $scope.activity_type = response.data;
                if (!$scope.activity.activity_type_id) {
                    $scope.activity.activity_type_id = $scope.activity_type[0]['id'];
                    $scope.activity.activity_type = $scope.activity_type[0]['name'];
                    $scope.activity.placeholder = $scope.activity_type[0]['activity_template'];
                } else {
                    var index = $scope.activity_type.findIndex(function(a) {
                        return a.id == $scope.activity.activity_type_id;
                    });
                    $scope.activity.placeholder = $scope.activity_type[index]['activity_template'];
                }
            });
        }

        $scope.activity_type = [];

        $scope.activity = {
            due_date: $rootScope.getCurrentDate(),
            due_date_time: $rootScope.getCurrentTime(),
            assigned_to: ($scope.data != undefined && $scope.data.user_id != undefined) ? $scope.data.user_id : $rootScope.USERCONST._ksuserid,
            assigned_to_name: ($scope.data != undefined && $scope.data.user_name != undefined) ? $scope.data.user_name : $rootScope.USERCONST._ksname,
            module: 'account',
            placeholder: 'Enter Activity...'
        };

        $scope.moduleName = {
            order: "Order",
            deal: "Deal",
            payment_collection: "Payment",
            expense: "Expense",
            purchase_order: "Purchase Order",
            worker: "Worker",
            job: "Job",
            production: "Production",
            grn: "Grn",
            goods_in: "Goods In",
            goods_out: "Goods Out",
            delivery_receipt: "Delivery Receipt",
            warehouse_transfer: "Warehouse Transfer"
        };

        if ($scope.data) {
            $.extend($scope.activity, $scope.data);
            if ($scope.activity.is_from_customer) {
                $scope.activity.module_id = $scope.activity.is_from_customer;
            }

            /*if($scope.moduleName[$scope.activity.module]) {
                $scope.activity.module_name = $scope.moduleName[$scope.activity.module]+" - "+$scope.activity.module_id;
            }*/
        }

        $scope.getActivityType();

        if ($scope.activity.id) {
            $scope.is_edit = true;
        }

        $scope.addActivity = function() {
            const activityData = angular.copy($scope.activity);
            activityData.due_date = $rootScope.convertToServerTime(activityData.due_date);
            activityData.due_date_time = $rootScope.convertToServerTime(activityData.due_date_time, 'hh:mm A', 'hh:mm A');

            $('#save').attr('disabled', true);
            $('#delete').attr('disabled', true);

            $http({
                url: serverUrl + "/public/common/web/saveActivity" + ($scope.activity.id ? "/" + $scope.activity.id : ""),
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    activity: activityData
                }
            }).then(function(response) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);

                $sticky.success(response.data.hasOwnProperty('success_description') ? response.data.success_description : sprintf(messages.created, "activityType"));
                $rootScope.$broadcast("activityAdded", response.data.data);

                if ($scope.is_edit || $scope.activity.is_from_customer) {
                    $modalInstance.dismiss('cancel');
                } else {
                    delete $scope.activity.activity;
                    if ($scope.data && $scope.data.module) {
                        $scope.activity.module = $scope.data.module;
                        $scope.activity.module_id = $scope.data.module_id;
                        $scope.activity.module_name = $scope.data.module_name;
                    } else {
                        delete $scope.activity.module;
                        delete $scope.activity.module_id;
                        delete $scope.activity.module_name;
                        $('#activity_module').select2("val", null);
                        $scope.select2Option.ajax_url = "lead";
                    }

                    setTimeout(function() {
                        $rootScope.$broadcast("reloadSelect2", {
                            id: "select2Module"
                        });
                    });
                }
            }, function(rejection) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);
                var data = rejection.data
                if (data.error == 'validation_error') {
                    $sticky.error(data.hasOwnProperty('error_description') ? data.error_description : messages.some_error);
                    $.each(data.error_data, function(i, val) {
                        $scope[i + "_error"] = val[0];
                    });
                } else {
                    $sticky.error(data.hasOwnProperty('error_description') ? data.error_description : messages.some_error);
                }
            });
        }

        $scope.activityTypeChange = function($index) {
            $scope.activity.placeholder = $scope.activity_type[$index]['activity_template'];
            $scope.activity.activity_type = $scope.activity_type[$index]['name'];
            $("#activity_text").focus();
        }

        $scope.changeModule = function(data) {
            $scope.select2Option.ajax_url = $scope.activity.module;
            $scope.select2Option.placeholder = 'Select ' + ($scope.activity.module ? ($scope.activity.module == 'account' ? 'customer' : $scope.activity.module) : "linked to module");
            delete $scope.activity.module_id;
            if (data) {
                $rootScope.$broadcast("reloadSelect2", {
                    id: "select2Module"
                });
            }
        }

        $scope.select2Option = {
            ajax_url: $scope.activity.module ? $scope.activity.module : 'lead',
            placeholder: 'Select linked to module'
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.cancelInner = function() {
            $scope.modalInstance.dismiss('cancel');
        };

        $scope.deleteActivity = function() {
            $scope.modalInstance = $modal.open({
                template: '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()" >×</button>' +
                    '<h3 class="modal-title">' + messages.are_you_sure_heading + '</h3>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    sprintf(messages.delete_are_you_sure_description, 'activity') +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button class="btn btn-important" ng-click="delete()">Yes</button>' +
                    '<button class="btn" ng-click="cancelInner()">No</button>' +
                    '</div>',
                scope: $scope
            });
        }

        $scope.delete = function() {
            $('#save').attr('disabled', true);
            $('#delete').attr('disabled', true);

            $scope.modalInstance.dismiss('cancel');

            $http({
                url: serverUrl + "/public/common/web/deleteActivity/" + $scope.activity.id,
                method: "post",
            }).then(function(response) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);
                $modalInstance.close();
                $rootScope.$broadcast("activityDeleted", $scope.activity);
                $sticky.success(response.data.hasOwnProperty("success_description") ? response.data.success_description : sprintf(messages.deactivated, 'activity'));
            }, function(rejection) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);
                $sticky.error(rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error);
            });
        }

    });

    // Note Create Modal Controller
    activityService.controller("NoteModal", function($scope, $controller, $stateParams, $http, $location, $rootScope, $modal, $modalInstance, $sticky, data) {

        $scope.data = data;

        $scope.activity = {
            due_date: $rootScope.getCurrentDate(),
            due_date_time: $rootScope.getCurrentTime(),
            assigned_to: $rootScope.USERCONST._ksuserid,
            assigned_to_name: $rootScope.USERCONST._ksname,
            placeholder: 'Enter Activity...'
        };

        if ($scope.data) {
            $.extend($scope.activity, $scope.data);
        }

        if ($scope.activity.id) {
            $scope.is_edit = true;
        }

        $scope.addActivity = function() {
            const activityData = angular.copy($scope.activity);
            activityData.due_date = $rootScope.convertToServerTime(activityData.due_date);
            activityData.due_date_time = $rootScope.convertToServerTime(activityData.due_date_time, 'hh:mm A', 'hh:mm A');
            $('#save').attr('disabled', true);
            $('#delete').attr('disabled', true);

            $http({
                url: serverUrl + "/public/common/web/saveActivity" + ($scope.activity.id ? "/" + $scope.activity.id : ""),
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    activity: activityData
                }
            }).then(function(response) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);

                $sticky.success(response.data.hasOwnProperty('success_description') ? response.data.success_description : sprintf(messages.created, "activityType"));
                $rootScope.$broadcast("activityAdded", response.data.data);
                if ($scope.is_edit) {
                    $modalInstance.dismiss('cancel');
                } else {
                    delete $scope.activity.activity;
                    if ($scope.data && $scope.data.module) {
                        $scope.activity.module = $scope.data.module;
                        $scope.activity.module_id = $scope.data.module_id;
                        $scope.activity.module_name = $scope.data.module_name;
                    } else {
                        delete $scope.activity.module;
                        delete $scope.activity.module_id;
                        delete $scope.activity.module_name;
                        $('#activity_module').select2("val", null);
                        $scope.select2Option.ajax_url = "lead";
                    }

                    setTimeout(function() {
                        $rootScope.$broadcast("reloadSelect2", {
                            id: "select2Module"
                        });
                    });
                }
            }, function(rejection) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);
                var data = rejection.data
                if (data.error == 'validation_error') {
                    $.each(data.error_data, function(i, val) {
                        $scope[i + "_error"] = val[0];
                    });
                } else {
                    $sticky.error(data.hasOwnProperty('error_description') ? data.error_description : messages.some_error);
                }
            });
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.cancelInner = function() {
            $scope.modalInstance.dismiss('cancel');
        };

        $scope.deleteActivity = function() {
            $scope.modalInstance = $modal.open({
                template: '<div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()" >×</button>' +
                    '<h3 class="modal-title">' + messages.are_you_sure_heading + '</h3>' +
                    '</div>' +
                    '<div class="modal-body">' +
                    sprintf(messages.delete_are_you_sure_description, 'activity') +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button class="btn btn-important" ng-click="delete()">Yes</button>' +
                    '<button class="btn" ng-click="cancelInner()">No</button>' +
                    '</div>',
                scope: $scope
            });
        }

        $scope.delete = function() {
            $('#save').attr('disabled', true);
            $('#delete').attr('disabled', true);

            $scope.modalInstance.dismiss('cancel');

            $http({
                url: serverUrl + "/public/common/web/deleteActivity/" + $scope.activity.id,
                method: "post",
            }).then(function(response) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);
                $modalInstance.close();
                $rootScope.$broadcast("activityDeleted", $scope.activity);
                $sticky.success(response.data.hasOwnProperty("success_description") ? response.data.success_description : sprintf(messages.deactivated, 'activity'));
            }, function(rejection) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);
                $sticky.error(rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error);
            });
        }
    });

    activityService.directive('activity', function($parse, $filter, $location, $rootScope, $compile, $http, $sticky, $activityService, $modal, $popup) {
        return {
            restrict: "A",
            link: function(scope, element, attr) {

                var options = {};
                options = angular.extend(options, scope.$eval(attr.activity));
                scope.options = options;

                // flag to show/hide add and schedule activity sections
                scope.isFormModule = false;
                if (scope.options.module.includes('form_')) {
                    scope.isFormModule = true;
                }

                $http({
                    url: serverUrl + "/public/common/web/getActivityTypeButton",
                    method: "post",
                }).then(function(response) {
                    scope.activity_type = response.data;
                });

                element.addClass("activityLog");
                element.append("<div ng-include=\"'modules/activity/activity/activitySide.html'\" style='height:100%;'></div>");
                $compile($(element).contents())(scope);

                scope.undoneLoading = false;
                scope.undoneActivity = [];
                scope.getUndoneActivity = function() {
                    scope.undoneLoading = true;

                    $http({
                        url: serverUrl + "/public/common/web/getUndoneActivity",
                        method: "post",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        spinner: false,
                        data: options,
                    }).then(function(response) {
                        scope.undoneLoading = false;
                        scope.undoneActivity = response.data.data;
                        $rootScope.undoneActivityData = scope.undoneActivity;
                    }, function(rejection) {
                        $sticky.error(rejection.data.hasOwnProperty('error_description') ? rejection.error_description : messages.some_error);
                    });
                }

                scope.doneActivity = [];
                scope.doneLoading = false;
                scope.loadMore = true;
                scope.getDoneActivity = function(filter, clear) {

                    if (clear) {
                        scope.doneActivity = [];
                        delete scope.options.lastId;
                        delete scope.options.filter;
                        scope.loadMore = true;
                        scope.$broadcast("refresh_scroll");
                    }

                    if (filter) {
                        scope.options.filter = filter;
                    }

                    if (scope.loadMore) {
                        scope.doneLoading = true;
                        scope.options.length = scope.doneActivity.length;

                        $http({
                            url: serverUrl + "/public/common/web/getDoneActivity",
                            method: "post",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            spinner: false,
                            data: options,
                        }).then(function(response) {
                            scope.doneLoading = false;
                            $.merge(scope.doneActivity, response.data.data);
                            $rootScope.doneActivityData = scope.doneActivity;
                            scope.loadMore = response.data.data.length >= 20;
                        }, function(rejection) {
                            $sticky.error(rejection.data.hasOwnProperty('error_description') ? rejection.error_description : messages.some_error);
                        });
                    }
                }

                $(document).off("click", ".view_from_link").on("click", ".view_from_link", function(e) {

                    var _id = $(this).attr("id").replace("view_module_", "");
                    var _module_route = $(this).attr("module_route");

                    scope.popupInstance = $popup.open({
                        route: _module_route + '/view/id',
                        id: _id
                    });
                });

                scope.getUndoneActivity();
                scope.getDoneActivity();

                scope.changeStatus = function(id, status, $index) {
                    $("#activity" + id).css("background", "#f5f5f5");
                    $("#activityCheck" + id).prop("disabled", true);
                    $http({
                        url: serverUrl + "/public/common/web/changeActivityStatus",
                        method: "post",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        spinner: false,
                        data: {
                            id: id,
                            status: status,
                            filter: scope.options.filter
                        },
                    }).then(function(response) {
                        if (status == 1) {
                            scope.undoneActivity.splice($index, 1);
                            if (response.data.data) {
                                scope.doneActivity.unshift(response.data.data);
                            }
                        } else {
                            scope.doneActivity.splice($index, 1);
                            scope.undoneActivity.push(response.data.data);
                            if (response.data.data) {
                                scope.undoneActivity.sort(function(a, b) {
                                    var dateA = new Date(a.due_date).getTime();
                                    var dateB = new Date(b.due_date).getTime();
                                    return dateA > dateB ? 1 : -1;
                                });
                            }
                        }
                    }, function(rejection) {
                        $sticky.error(rejection.data.hasOwnProperty('error_description') ? rejection.error_description : messages.some_error);
                    });
                }

                scope.getIcon = $activityService.getIcon;

                scope.$on("activityAdded", function(event, data) {
                    var undoneIndex = scope.undoneActivity.findIndex(function(a) {
                        return a.id == data.id
                    });
                    var doneIndex = scope.doneActivity.findIndex(function(a) {
                        return a.id == data.id
                    });

                    if (undoneIndex > -1) {
                        scope.undoneActivity.splice(undoneIndex, 1);
                    }

                    if (doneIndex > -1) {
                        scope.doneActivity.splice(doneIndex, 1);
                    }
                    if ((data.module == scope.options.module && data.module_id == scope.options.module_id) || (data.reference == scope.options.module && data.reference_id == scope.options.module_id)) {
                        if (data.done_status == 1) {
                            var add = false;
                            if (scope.options.filter) {
                                if (scope.options.filter == 'activity' && ['note', 'log'].indexOf(data.activity_type) <= -1) {
                                    add = true;
                                } else if (scope.options.filter == 'note' && ['note'].indexOf(data.activity_type) > -1) {
                                    add = true;
                                } else if (scope.options.filter == 'log' && ['log'].indexOf(data.activity_type) > -1) {
                                    add = true;
                                }
                            } else {
                                add = true;
                            }

                            if (add) {
                                scope.doneActivity.push(data);
                                scope.doneActivity.sort(function(a, b) {
                                    var dateA = new Date(a.done_date).getTime();
                                    var dateB = new Date(b.done_date).getTime();
                                    return dateA < dateB ? 1 : -1;
                                });
                            }
                        } else {
                            scope.undoneActivity.push(data);
                            scope.undoneActivity.sort(function(a, b) {
                                var dateA = new Date(a.due_date).getTime();
                                var dateB = new Date(b.due_date).getTime();
                                return dateA > dateB ? 1 : -1;
                            });
                        }
                    }
                });

                scope.displayRecordIcon = function(recording_url) {
                    if (recording_url !== null) {
                        return true;
                    } else {
                        return false;
                    }
                }

                scope.showRecording = function(act, recording_url) {
                    let html = '<audio controls class="audio_modal_view">' +
                        '<source src="' + recording_url + '">' +
                        '</audio>';
                    html += '<p class="mediaName">' + act + '<span class="pull-right" ng-click="closeModal()"><i class="la la-times"></i></span></p>';
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

                scope.closeModal = function() {
                    $(".audio_modal_view")[0].pause();
                    scope.modalInstance.dismiss('cancel');
                }

                scope.$on("activityDeleted", function(event, data) {
                    var undoneIndex = scope.undoneActivity.findIndex(function(a) {
                        return a.id == data.id
                    });
                    var doneIndex = scope.doneActivity.findIndex(function(a) {
                        return a.id == data.id
                    });

                    if (undoneIndex > -1) {
                        scope.undoneActivity.splice(undoneIndex, 1);
                    }

                    if (doneIndex > -1) {
                        scope.doneActivity.splice(doneIndex, 1);
                    }
                });

                scope.$on("getRecentActivity", function(event, data) {
                    $http({
                        url: serverUrl + "/public/common/web/getRecentActivity/" + data,
                        method: "post",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        spinner: false,
                    }).then(function(response) {
                        var data = response.data.data;
                        if (data.module == scope.options.module && data.module_id == scope.options.module_id) {
                            if (data.done_status == 1) {
                                var add = false;
                                if (scope.options.filter) {
                                    if (scope.options.filter == 'activity' && ['Note', 'Log'].indexOf(data.activity_type) <= -1) {
                                        add = true;
                                    } else if (scope.options.filter == 'note' && ['Note'].indexOf(data.activity_type) > -1) {
                                        add = true;
                                    } else if (scope.options.filter == 'log' && ['Log'].indexOf(data.activity_type) > -1) {
                                        add = true;
                                    }
                                } else {
                                    add = true;
                                }

                                if (add) {
                                    scope.doneActivity.push(data);
                                    scope.doneActivity.sort(function(a, b) {
                                        var dateA = new Date(a.done_date).getTime();
                                        var dateB = new Date(b.done_date).getTime();
                                        return dateA < dateB ? 1 : -1;
                                    });
                                }
                            } else {
                                scope.undoneActivity.push(data);
                                scope.undoneActivity.sort(function(a, b) {
                                    var dateA = new Date(a.due_date).getTime();
                                    var dateB = new Date(b.due_date).getTime();
                                    return dateA > dateB ? 1 : -1;
                                });
                            }
                        }
                    }, function(rejection) {
                        $sticky.error(rejection.data.hasOwnProperty('error_description') ? rejection.error_description : messages.some_error);
                    });
                });

                scope.addActivity = function(d) {

                    var _d = scope.$eval(attr.activity);

                    var data = {
                        module: _d.module,
                        module_id: _d.module_id,
                        module_name: _d.module_name,
                        contact_detail: _d.contact_detail,
                    };
                    if (d) {
                        data.activity_type = d.name;
                        data.activity_type_id = d.id;
                        data.type = d.type;
                        data.placeholder = d.activity_template;
                    }

                    $activityService.addActivity(data);
                }

                scope.deleteActivity = function(id, done_status, $index) {
                    scope.modalInstance = $modal.open({
                        template: '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()" >×</button>' +
                            '<h3 class="modal-title">' + messages.are_you_sure_heading + '</h3>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            sprintf(messages.delete_are_you_sure_description, 'activity') +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button class="btn btn-important" ng-click="delete(' + id + ',' + done_status + ',' + $index + ')">Yes</button>' +
                            '<button class="btn" ng-click="cancel()">No</button>' +
                            '</div>',
                        scope: scope
                    });
                }

                scope.delete = function(id, done_status, $index) {
                    scope.modalInstance.close();
                    $http({
                        url: serverUrl + "/public/common/web/deleteActivity/" + id,
                        method: "post",
                    }).then(function(response) {
                        $sticky.success(response.data.hasOwnProperty("success_description") ? response.data.success_description : sprintf(messages.deactivated, 'activity'));
                        if (done_status == 1) {
                            scope.doneActivity.splice($index, 1);
                        } else {
                            scope.undoneActivity.splice($index, 1);
                        }
                    }, function(rejection) {
                        $sticky.error(rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error);
                    });
                }

                scope.cancel = function(id) {
                    scope.modalInstance.dismiss('cancel');
                }

                scope.editActivity = function($event, d, $index) {
                    if (!$($event.target).hasClass("module_link")) {
                        if ($rootScope.checkRight(['manage_team_activity']) || d.assigned_to == $rootScope.USERCONST._ksuserid || d.created_by == $rootScope.USERCONST._ksuserid) {
                            if ($.inArray(d.type, ['log', 'call_log', 'mail', 'sms']) == -1) {
                                var _d = angular.copy(d);
                                _d.placeholder = scope.activity_type[scope.activity_type.findIndex(function(a) {
                                    return a.id == d.activity_type_id;
                                })]['activity_template'];
                                const newDueDate = _d.due_date + ' ' + _d.due_date_time;
                                const time = $rootScope.convertToLocalTime(newDueDate, 'DD-MM-YYYY hh:mm A', 'DD-MM-YYYY hh:mm A').split(' ');
                                _d.due_date = time[0];
                                _d.due_date_time = time[1] + ' ' + time[2];
                                $activityService.addActivity(_d);
                            }
                        }
                    }
                }

                scope.openModuleInPopup = function(module, module_id) {
                    if (module == "sale_quotation") {
                        module = "quotation";
                    }
                    if (module == "sales_return") {
                        module = "salesReturn";
                    }
                    if (module == "payment_collection") {
                        module = "paymentCollection"
                    }

                    if (module && module_id) {
                        scope.popupInstance = $popup.open({
                            route: module + '/view/id',
                            id: module_id
                        });
                    }
                }

            }
        }
    });

    activityService.directive('userActivity', function($parse, $filter, $location, $rootScope, $compile, $http, $sticky, $activityService, $modal, $cookies, $popup) {
        return {
            restrict: "A",
            link: function(scope, element, attr) {

                var options = {
                    initOnLoad: true
                };

                scope.loadOption = function() {
                    options = angular.extend(options, scope.$eval(attr.userActivity));
                    scope.filter = options.filter;
                }

                scope.loadOption();

                scope.activity = [];
                scope.loadMore = true;
                scope.isLoading = false;

                var div = $('<div id="activityMain" ng-scroll="getData()" />');
                div.addClass('activityMainDiv');
                div.append('<div class="activityMainInner"></div>');
                div.append('<div ng-if="!activity.length && !isLoading" style="margin-top: 100px;" class="text-center"><h3>No activity found.</h3><button class="btn btn-important" ng-if="$root.checkRight([\'manage_team_activity\'])" ng-click="addActivity()">Schedule an activity</button></div>');
                div.append('<div ng-if="isLoading" style="margin-top: 30px;" class="text-center text-muted"><i class="la la-refresh la-2x la-spin"></i></div>');

                element.append(div);
                $compile($(element).contents())(scope);

                scope.getData = function(clear) {
                    if (!scope.isLoading) {
                        if (options.cookie) {
                            $cookies.putObject($rootScope.USERCONST._ksuserid + "_my_activity", scope.filter, {
                                path: cookiePath
                            });
                        }

                        if (clear) {
                            scope.activity = [];
                            $(".activityMainInner").html("");
                            scope.loadMore = true;
                            scope.$broadcast("refresh_scroll");
                        }

                        if (scope.loadMore) {
                            scope.isLoading = true;
                            scope.filter.length = scope.activity.length;

                            $http({
                                url: serverUrl + "/public/common/web/getActivityAll",
                                method: "post",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                spinner: false,
                                data: {
                                    search: scope.filter
                                }
                            }).then(function(response) {
                                //$.merge($scope.activity, response.data.data);
                                //$("#search").prop("disabled", false);
                                scope.loadMore = response.data.data.length >= 20;
                                scope.isLoading = false;
                                $.each(response.data.data, function(i, val) {
                                    scope.activity.push(val);
                                    scope.makeActivityView(val);
                                });
                            }, function(rejection) {
                                $sticky.error(rejection.data.hasOwnProperty('error_description') ? rejection.data.error_description : messages.some_error);
                            });
                        }
                    }
                };

                if (options.initOnLoad) {
                    scope.getData(true);
                }

                scope.makeActivityView = function(data, isEdit) {
                    if (isEdit) {
                        var html = $("#activity" + data.id);
                        html.html("");
                    } else {
                        var html = $("<div />").addClass("activityBox").addClass("large").attr("id", 'activity' + data.id);
                    }

                    if (data.done_status) {
                        html.addClass("done");
                    } else {
                        html.removeClass("done");
                    }

                    var icon = $activityService.getIcon(data.activity_type);
                    html.append("<div class='activityIcon'><i class='la la-" + icon + "'></i></div>");

                    var due_date = "";
                    if (data.done_status == 1) {
                        due_date = "<small class='text-muted'>by <a href='javascript:void(0)' class='module_link' ng-click=openPopupModuleView('user'," + data.assigned_to + ") style='font-weight:bold'>" + data.done_by_name + "</a> on <b>" + $rootScope.convertToLocalTime(data.display_date, 'DD-MM-YYYY hh:mm A') + "</b></small>";
                    } else {
                        // var assigned_to = (data.assigned_to == $rootScope.USERCONST._ksuserid) ? "Me" : data.assigned_to_name;
                        var assigned_to = data.assigned_to_name;
                        var created_by = (data.created_by == $rootScope.USERCONST._ksuserid) ? "" : ("&nbsp;&nbsp;by " + data.created_by_name);
                        due_date = "<small class='text-muted'><span" + (data.overdue ? " class='text-danger'" : "") + ">" + $rootScope.convertToLocalTime(data.display_date, 'DD-MM-YYYY hh:mm A') + "</span>&nbsp;&nbsp;</small>" +
                            "<small class='text-muted'>|&nbsp;&nbsp;to <a href='javascript:void(0)' class='module_link' ng-click=openPopupModuleView('user'," + data.assigned_to + ")>" + assigned_to + "</a> <a href='javascript:void(0)' class='module_link' ng-click=openPopupModuleView('user'," + data.created_by + ")>" + created_by + "</a></small>";
                    }

                    var module_link = "";
                    if (data.module) {
                        var module_icon = $activityService.getIcon(data.module);
                        data.module_link_name = data.module.replace(/_([a-z])/g, function(g) {
                            return g[1].toUpperCase();
                        });
                        if (data.module_link_name == "saleQuotation") {
                            data.module_link_name = "quotation"
                        }
                        // module_link = data.module_name ? "<small class='text-muted'>|&nbsp;&nbsp;<a href='#/" + data.module_link_name + "/view/" + data.module_id + "' class='module_link'><i class='la la-" + module_icon + "'></i>&nbsp;" + data.module_name + "</a></small>" : "";
                        module_link = data.module_name ? "<small class='text-muted'>|&nbsp;&nbsp;<a href='javascript:void(0)' ng-click=openPopupModuleView(\'" + data.module_link_name + "\'," + data.module_id + ") class='module_link'><i class='la la-" + module_icon + "'></i>&nbsp;" + data.module_name + "</a></small>" : "";

                    }

                    var reference_link = "";
                    if (data.reference) {
                        var reference_icon = $activityService.getIcon(data.reference);
                        /*reference_link = data.reference_name ? "<small class='text-muted'>|&nbsp;&nbsp;<a href='#/" + data.reference + "/view/" + data.reference_id + "' class='module_link'>refrence link => <i class='la la-" + reference_icon + "'></i>&nbsp;" + data.reference_name + "</a></small>" : ""*/
                        reference_link = data.reference_name ? "<small class='text-muted'>|&nbsp;&nbsp;<a href='javascript:void(0)' ng-click=openPopupModuleView(\'" + data.reference + "\'," + data.reference_id + ") class='module_link'><i class='la la-" + reference_icon + "'></i>&nbsp;" + data.reference_name + "</a></small>" : ""
                    }
                    html.append("<div class='activityText' ng-click='editActivity($event," + JSON.stringify(data) + ")'>\n\
                            <p>" + data.activity + "</p>\n\
                            " + due_date + "\n\
                            " + module_link + "\n\
                            " + reference_link + "\n\
                        </div>");

                    var can_delete_activity = $rootScope.checkRight(['manage_team_activity']) || data.created_by == $rootScope.USERCONST._ksuserid;
                    if ($rootScope.checkRight(['manage_team_activity']) || data.created_by == $rootScope.USERCONST._ksuserid || data.assigned_to == $rootScope.USERCONST._ksuserid) {
                        html.append("<div class='activityCheck'>\n\
                                <input type='checkbox' id='activityCheck" + data.id + "' ng-checked='" + (data.done_status ? 'true' : 'false') + "' ng-click='changeStatus(" + data.id + "," + (data.done_status ? 0 : 1) + ")' />\n\
                                <label for='activityCheck" + data.id + "'></label>\n\
                                <div class='activityAction text-muted'>\n\
                                    <i class='la la-pencil' ng-click='editActivity($event," + JSON.stringify(data) + ")'></i>\n\
                                    <i class='la la-trash' ng-if='" + can_delete_activity + "' ng-click='deleteActivity(" + data.id + ")'></i>\n\
                                </div>\n\
                             </div>");
                    }
                    html.append("<div class='clearfix'></div>");

                    $compile(html)(scope);
                    if (!isEdit) {
                        $(".activityMainInner").append(html);
                    }
                }

                scope.openPopupModuleView = function(module, module_id) {
                    if (module && module_id) {
                        scope.onPopup = true;
                        scope.popupInstance = $popup.open({
                            route: module + '/view/id',
                            id: module_id
                        });
                    }
                }

                scope.activityDone = function(activity) {
                    $http({
                        url: serverUrl + "/public/common/web/activityDone",
                        method: "post",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            activity: activity
                        }
                    }).then(function(response) {
                        scope.activity.splice(activity, 1);
                    })
                }

                scope.editActivity = function($event, activity) {
                    if (!$($event.target).hasClass("module_link")) {
                        if ($rootScope.checkRight(['manage_team_activity']) || activity.assigned_to == $rootScope.USERCONST._ksuserid || activity.created_by == $rootScope.USERCONST._ksuserid) {
                            const _d = angular.copy(activity);
                            const newDueDate = _d.due_date + ' ' + _d.due_date_time;
                            const time = $rootScope.convertToLocalTime(newDueDate, 'DD-MM-YYYY hh:mm A', 'DD-MM-YYYY hh:mm A').split(' ');
                            _d.due_date = time[0];
                            _d.due_date_time = time[1] + ' ' + time[2];
                            console.log(_d);
                            $activityService.addActivity(_d);
                        }
                    }
                }

                scope.deleteActivity = function(id, done_status, $index) {
                    scope.modalInstance = $modal.open({
                        template: '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="cancel()" >×</button>' +
                            '<h3 class="modal-title">' + messages.are_you_sure_heading + '</h3>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            sprintf(messages.delete_are_you_sure_description, 'activity') +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button class="btn btn-important" ng-click="delete(' + id + ',' + done_status + ',' + $index + ')">Yes</button>' +
                            '<button class="btn" ng-click="cancel()">No</button>' +
                            '</div>',
                        scope: scope
                    });
                }

                scope.delete = function(id, done_status, $index) {
                    scope.modalInstance.close();
                    $http({
                        url: serverUrl + "/public/common/web/deleteActivity/" + id,
                        method: "post",
                    }).then(function(response) {
                        $sticky.success(response.data.hasOwnProperty("success_description") ? response.data.success_description : sprintf(messages.deactivated, 'activity'));
                        var index = scope.activity.findIndex(function(a) {
                            return a.id == id
                        });
                        scope.activity.splice(index, 1);
                        $("#activity" + id).remove();
                    }, function(rejection) {
                        $sticky.error(rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error);
                    });
                }

                scope.cancel = function(id) {
                    scope.modalInstance.dismiss('cancel');
                }

                scope.changeStatus = function(id, status) {
                    if (scope.onPopup) {
                        scope.doneActivity = $rootScope.doneActivityData;
                        scope.undoneActivity = $rootScope.undoneActivityData;
                    }
                    $("#activity" + id).css("background", "#f5f5f5");
                    $("#activityCheck" + id).prop("disabled", true);
                    $http({
                        url: serverUrl + "/public/common/web/changeActivityStatus",
                        method: "post",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        spinner: false,
                        data: {
                            id: id,
                            status: status
                        },
                    }).then(function(response) {
                        var data = response.data.data;
                        if (scope.onPopup) {
                            if (status == 1) {
                                var index = scope.undoneActivity.findIndex(function(u) {
                                    return u.id == id
                                });
                                scope.undoneActivity.splice(index, 1);
                                if (data) {
                                    scope.doneActivity.unshift(data);
                                }
                            } else {
                                var index = scope.doneActivity.findIndex(function(d) {
                                    return d.id == id
                                });
                                scope.doneActivity.splice(index, 1);
                                scope.undoneActivity.push(data);
                                if (data) {
                                    scope.undoneActivity.sort(function(a, b) {
                                        var dateA = new Date(a.due_date).getTime();
                                        var dateB = new Date(b.due_date).getTime();
                                        return dateA > dateB ? 1 : -1;
                                    });
                                }
                            }
                            if (scope.filter.done_status == 0 || scope.filter.done_status == 1) {
                                $("#activity" + id).toggle();
                            }
                        } else {
                            if (scope.filter.done_status == 0 || scope.filter.done_status == 1) {
                                scope.activity.splice(index, 1);
                                $("#activity" + id).remove();
                            } else {
                                if ($("#activity" + id).length) {
                                    $("#activity" + id).removeAttr("style");
                                }
                            }
                        }
                        scope.makeActivityView(data, true);
                    }, function(rejection) {
                        $sticky.error(rejection.data.hasOwnProperty('error_description') ? rejection.error_description : messages.some_error);
                    });
                }

                scope.$on("activityAdded", function(event, data) {
                    scope.getData(true);
                });

                scope.$on("reloadActivityOption", function(event, data) {
                    scope.loadOption();
                    scope.getData(true);
                });

                scope.$on("activityDeleted", function(event, data) {
                    $("#activity" + data.id).remove();
                });
            }
        }
    });
});