define(['angularAMD', 'ng-upload', 'textEditor'], function(angularAMD) {

    var mailService = angular.module("mailService", ['ng-upload', 'textEditor']);

    // factory for mail
    mailService.factory('$mailService', function($http, $location, $sce, $modal, $compile, $rootScope) {

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

        // Open mail create modal
        data.mailModal = function(data) {

            var url = "modules/mail/mail/sendMail.html";
            var controller = "MailModal";

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

    // Send Mail Modal Controller
    mailService.controller("MailModal", function($scope, $controller, $stateParams, $http, $location, $rootScope, $modal, $modalInstance, $sticky, $compile, data) {
        $scope.mail = {};

        if (data) {
            $scope.mail.module = data.module;
            $scope.mail.module_id = data.module_id;
            if (data.contact_detail) {
                $scope.mail.to = data.contact_detail.email_id;
            }
        }

        // Change Template
        $scope.changeTemplate = function(data) {
            $scope.mail.attachment = [];
            $scope.mail.old_attachment = [];
            $(".file_preview").html("");

            if (data && data.id) {
                var d = {
                    mail_template_id: data.id,
                    module: $scope.mail.module,
                    module_id: $scope.mail.module_id,
                }

                $http({
                    url: serverUrl + "/public/common/web/getMailByTemplate",
                    method: "post",
                    data: d,
                }).then(function(response) {
                    $scope.mail.message = response.data.message;
                    $scope.mail.subject = response.data.subject;
                    $scope.mail.attach_pdf = response.data.attach_pdf;
                    $scope.mail.attachment = response.data.attachment;

                    if (response.data.email) {
                        $scope.mail.to = response.data.email;
                    }

                    if (typeof $scope.mail.attachment != 'undefined') {
                        $.each($scope.mail.attachment, function(i, val) {
                            var ele = $("<div />").addClass("file_preview_list").attr("id", "delete_" + val).text(val).append("<i class='la la-times file_list_delete' id='" + val + "' ng-click='delete_old_attachment(\"" + i + "\",\"" + val + "\")'></i>");
                            $(".file_preview").append(ele);
                            $compile(ele)($scope);
                            $scope.mail.old_attachment.push(val);
                        });
                    }

                    $scope.mail.cc = response.data.cc;
                });
            } else {
                delete $scope.mail.message;
                delete $scope.mail.subject;
            }
        }

        $scope.uploadOptions = {
            allowedFileType: ['gif', 'jpg', 'jpeg', 'png', 'tiff', 'bmp', 'svg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'zip', 'rar', 'tar'],
            deleteElement: ".file_list_delete",
            submit: function(e, data) {
                var ele;
                $.each(data.files, function(i, val) {
                    ele = $("<div />").addClass("file_preview_list").addClass("new").text(val.name).append("<i class='la la-refresh la-spin file_list_delete'></i>");
                    ele.attr("file", val.name);
                    $(".file_preview").append(ele);
                });
                data.context = $(".file_preview_list.new");
            },
            done: function(e, data) {
                data.context.find(".file_list_delete")
                    .removeClass("la-refresh")
                    .removeClass("la-spin")
                    .addClass("la-times");
            }
        };

        $scope.delete_old_attachment = function(index, value) {
            $scope.mail.old_attachment.splice(index, 1);
            $scope.mail.attachment.splice(index, 1);
            $("[id='delete_" + value + "']").remove();
        }

        // Send Mail
        $scope.sendMail = function() {
            $('#save').attr('disabled', true);

            $http({
                url: serverUrl + "/public/common/web/sendMail",
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    mail: $scope.mail
                }
            }).then(function(response) {
                $('#save').attr('disabled', false);
                $('#delete').attr('disabled', false);

                $sticky.success(response.data.hasOwnProperty('success_description') ? response.data.success_description : sprintf(messages.created, "mail"));

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