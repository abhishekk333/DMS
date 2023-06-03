/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD', 'ng-upload'], function(angularAMD) {

    // Breadcrumb App
    var importService = angular.module("import", ['ng-upload']);

    // factory for import
    importService.factory('$importService', function($http, $location, $sce, $modal, $compile) {

        var data = {};

        // Open import modal
        data.addImport = function(module, data) {

            if (data == undefined) {
                data = {};
            }

            var $modalInstance = $modal.open({
                templateUrl: "template/import.html",
                controller: "ImportModal",
                resolve: {
                    modalData: function() {
                        return {
                            module: module,
                            data: data
                        };
                    }
                }
            });
        }
        return data;
    });

    // staffExpense Create Modal Controller
    importService.controller("ImportModal", function($scope, $controller, $stateParams, $http, $location, $rootScope, $modal, $modalInstance, modalData, $sticky, $settingService) {
        $scope.module = modalData.module;

        $scope.data = modalData.data

        $scope.data.status = 0;
        if ($scope.module == 'area') {
            $scope.data.level = 'country';
        }
        if ($scope.module == 'job') {
            $scope.data.status = 1;
        };

        // Settings
        var setting = $settingService.get(['stock_config']);
        $scope.stock_config = setting.stock_config;
        $scope.barcode_autogenerate = setting.stock_config.barcode_autogenerate;

        $scope.import = function(data = {}) {

            $scope.error = "";

            let url = serverUrl + "/public/common/web/import/" + $scope.module;

            if (data.hasOwnProperty('isFormModule') && data.isFormModule) {
                url = serverUrl + "/public/common/web/import/formData/" + $scope.module.replace("form_", "");
            }

            $http({
                url: url,
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.data,
            }).then(function(response) {
                $sticky.success(response.data.hasOwnProperty('success_description') ? response.data.success_description : sprintf(messages.imported, $scope.module));
                if ($scope.module == 'user_route') {
                    $rootScope.$broadcast('getEvents', response.data.user_route);
                } else if ($scope.module == 'product_bom') {
                    $rootScope.$broadcast('getBomProducts', response.data);
                } else if ($scope.module == 'job_product') {
                    $rootScope.$broadcast('getJobProducts', response.data);
                } else if ($scope.module == 'order_product') {
                    $rootScope.$broadcast('getOrderProduct', response.data);
                } else if ($scope.module == 'purchase_order_product') {
                    $rootScope.$broadcast('getPurchaseOrderProduct', response.data);
                } else {
                    $rootScope.$broadcast('refreshTable');
                }

                $scope.cancel();
            }, function(rejection) {
                $scope.error = rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error;
                $(".file_preview").html("");
                $scope.data.attachment = "";
                if (rejection.data.hasOwnProperty("redirect") && rejection.data.redirect) {
                    $rootScope.downloadFile(rejection.data.redirect.file);
                    $scope.cancel();
                }
            });
        };

        $scope.downloadDemo = function(data = {}) {

            var url = serverUrl + "/public/common/web/downloadDemoFile/" + $scope.module;

            if ($scope.module == 'product' || $scope.module == 'account') {
                url = serverUrl + "/public/common/web/" + $scope.module + "/downloadImportDemo";
            }

            if (data.hasOwnProperty('isFormModule') && data.isFormModule) {
                url = serverUrl + "/public/common/web/formData/downloadImportDemo/" + $scope.module.replace("form_", "");
            }

            $http({
                url: url,
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.data,
            }).then(function(response) {
                $sticky.success(response.data.hasOwnProperty('success_description') ? response.data.success_description : sprintf(messages.demo_downloaded, modalData.bit));
                if (response.data.hasOwnProperty("redirect") && response.data.redirect) {
                    $rootScope.downloadFile(response.data.redirect.file);
                }
            }, function(rejection) {
                $sticky.error(rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error);
            });
        };

        $scope.uploadOptions = {
            allowedFileType: ($scope.module == 'account' || $scope.module == 'product' || $scope.module.includes('form_')) ? ['csv'] : ['xls', 'xlsx'],
            deleteElement: ".file_list_delete",
            submit: function(e, data) {
                var ele;
                ele = $("<div />").addClass("file_preview_list").addClass("new").text(data.files[0].name).append("<i class='la la-refresh la-spin file_list_delete'></i>");
                ele.attr("file", data.files[0].name);
                $(".file_preview").html(ele);

                data.context = $(".file_preview_list.new");
            },
            done: function(e, data) {
                data.context.find(".file_list_delete")
                    .removeClass("la-refresh")
                    .removeClass("la-spin")
                    .addClass("la-times");
            }
        };

        $scope.deactivateCancel = function() {
            $scope.modalERR.dismiss('cancel');
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
});