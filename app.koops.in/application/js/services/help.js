/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD', 'bootstrap'], function(angularAMD) {

    // Breadcrumb App
    var helpService = angular.module("help", []);

    // factory for import
    helpService.factory('$helpService', function($http, $location, $sce, $modal, $compile) {

        var data = {};

        // Open import modal
        data.showHelp = function(data) {

            // type = new_signup / help_page

            var $modalInstance = $modal.open({
                templateUrl: "template/intro.html",
                controller: "HelpModal",
                size: 'lg',
                resolve: {
                    modalData: function() {
                        return {
                            data: data
                        };
                    }
                }
            });
        }
        return data;
    });

    // Directive for help
    helpService.directive('help', function($compile, $parse, $rootScope, $helpService) {
        return {
            restrict: "A",
            scope: true,
            link: function(scope, element, attr) {
                var data = scope.$eval(attr.help);

                element.attr("title", "help")

                element.click(function() {
                    $helpService.showHelp(data);
                });
            }
        };
    });

    // Help Modal Controller
    helpService.controller("HelpModal", function($scope, $controller, $stateParams, $http, $location, $rootScope, $modal, $modalInstance, modalData, $sticky, $compile) {
        $scope.data = modalData.data;
        $scope.complete = false;
        $scope.currentSlide = 0;
        $scope.header = "";
        setTimeout(function() {
            $.each($scope.data, function(i, v) {
                var html = $("<div />").addClass("item");
                if (i == 0) {
                    html.addClass("active");
                    $scope.header = v.title;
                    $(".introHeader").html($scope.header);
                }

                if (v.type == 'video') {
                    html.append('<iframe src="' + v.link + '" width="898" height="450" frameborder="0" allowfullscreen></iframe>');
                } else if (v.type == 'image') {
                    html.append('<img src="' + v.link + '" />');
                }

                $compile(html)($scope);
                $("#myCarousel .carousel-inner").append(html);

                if (i == $scope.data.length - 1) {
                    $scope.init();
                }

            });
        }, 500);

        $scope.init = function() {
            $("#myCarousel").carousel({
                interval: false,
                wrap: false
            });
        }

        $scope.nextSlide = function() {
            if ($scope.currentSlide != $scope.data.length - 1) {
                $("#myCarousel").carousel('next');
                $scope.currentSlide++;
                $scope.header = $scope.data[$scope.currentSlide]['title'];
            }
        }

        $scope.prevSlide = function() {
            if ($scope.currentSlide != 0) {
                $("#myCarousel").carousel('prev');
                $scope.currentSlide--;
                $scope.header = $scope.data[$scope.currentSlide]['title'];
            }
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
    });
});