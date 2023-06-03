define(['angularAMD', 'ng-upload'], function(angularAMD) {

    var smsService = angular.module("smsService", ['ng-upload']);

    // factory for sms
    smsService.factory('$smsService', function($http, $location, $sce, $modal, $compile, $rootScope) {

        var data = {};
        var _icon = {
            'Task': 'calendar-check-o',
            'Call': 'phone',
            'Visit': 'map-marker',
            'Meeting': 'users',
            'Note': 'comment',
            'order': 'shopping-cart',
            'dispatch': 'truck',
            'payment_collection': 'money',
            'user_expense': 'beer',
            'account': 'user',
            'deal': 'thumbs-up',
            'lead': 'user',
            'incoming': 'arrow-circle-o-down',
            'outgoing': 'arrow-circle-o-up',
            'missed': 'minus-circle',
            'voicemail': 'microphone',
            'rejected': 'times-circle-o',
            'blocked': 'dot-circle-o',
        }

        // Open sms create modal
        data.smsModal = function(data) {

            var url = "modules/sms/sms/sendSms.html";
            var controller = "SmsModal";

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

        return data;
    });

    // Send Sms Modal Controller
    smsService.controller("SmsModal", function($scope, $controller, $stateParams, $http, $location, $rootScope, $modal, $modalInstance, $sticky, data) {
        //$scope.data = data;
        $scope.sms = {
            module: data.module,
            module_id: data.module_id,
            //to: data.contact_detail.contact_no
        };
        if (data.contact_detail) {
            $scope.sms.to = data.contact_detail.contact_no
        }

        // Change Template
        $scope.changeTemplate = function(data) {
            if (data && data.id) {
                var d = {
                    sms_template_id: data.id,
                    module: $scope.sms.module,
                    module_id: $scope.sms.module_id,
                }

                $http({
                    url: serverUrl + "/public/common/web/getSmsByTemplate",
                    method: "post",
                    data: d,
                }).then(function(response) {
                    $scope.sms.message = response.data.message;
                    if (response.data.to) {
                        $scope.sms.to = response.data.to;
                    }
                    if (response.data.cc) {
                        $scope.sms.cc = response.data.cc;
                    } else {
                        delete $scope.sms.cc;
                    }
                    if (response.data.sms_config) {
                        $scope.sms.sms_config = response.data.sms_config;
                    } else {
                        delete $scope.sms.sms_config;
                    }
                });
            } else {
                delete $scope.sms.message;
                delete $scope.sms.sms_config;
                delete $scope.sms.cc;
            }
        }

        // Send Sms
        $scope.sendSms = function() {
            $('#save').attr('disabled', true);

            $http({
                url: serverUrl + "/public/common/web/sendSms",
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    sms: $scope.sms
                }
            }).then(function(response) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);

                $sticky.success(response.data.hasOwnProperty('success_description') ? response.data.success_description : sprintf(messages.created, "sms"));

                console.log(response.data);
                $rootScope.$broadcast("activityAdded", response.data.data);

                $modalInstance.dismiss('cancel');
            }, function(rejection) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);
                var data = rejection.data
                if (data.error == 'validation_error') {
                    $.each(data.error_data, function(i, val) {
                        $scope[i + "_error"] = val[0];
                    });
                } else if (data.error == "mobile_no_not_valid") {
                    $sticky.error(data.hasOwnProperty('error_description') ? data.error_description : messages.some_error);
                } else if (data.error == "sms_limit") {
                    $sticky.error(data.hasOwnProperty('error_description') ? data.error_description : messages.some_error);
                } else {
                    $sticky.error(data.hasOwnProperty('error_description') ? data.error_description : messages.some_error);
                }
            });
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
    });
});