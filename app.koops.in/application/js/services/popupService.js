/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Breadcrumb App
    var popup = angular.module("popupService", []);

    // factory for icons
    popup.factory('$popup', function($http, $location, $sce, $modal, $compile, $rootScope, $templateRequest, $timeout, $controller, $q) {
        var $openedPopup = [];
        var zIndex = 999999;
        var $popup = {};

        function getIndex(popupInstance) {
            for (var i = 0; i < $openedPopup.length; i++) {
                if ($openedPopup[i] == popupInstance) {
                    return i;
                }
            }
        }

        function getTopIndex() {
            return $openedPopup.length - 1;
        }

        function loadTemplate(popupConfig, popupIndex, popupScope) {

            var _index = popupIndex;

            // load controllers
            if (popupConfig.hasOwnProperty("controller") && popupConfig.controller) {
                var ctrlInstance, ctrlLocals = {};
                ctrlLocals.$scope = popupScope;
                ctrlLocals.$scope.id = popupConfig.id ? {
                    id: popupConfig.id
                } : "";
                ctrlInstance = $controller(popupConfig.controller, ctrlLocals);
            }

            if (popupConfig.hasOwnProperty("templateUrl")) {
                var templateUrl = $sce.getTrustedResourceUrl(popupConfig.templateUrl);
                $templateRequest(templateUrl).then(function(template) {
                    $("#secondary-ui-view_" + _index).html(template);
                    $compile($("#secondary-ui-view_" + _index).contents())(popupScope);
                });
            } else if (popupConfig.hasOwnProperty("template")) {
                $("#secondary-ui-view_" + _index).html(popupConfig.template);
                $compile($("#secondary-ui-view_" + _index).contents())(popupScope);
            }
        };

        function loadModal(popupConfig, popupIndex) {
            $("body").append("<div class='popupBackdrop' id='popupBackdrop" + popupIndex + "' popupIndex='" + popupIndex + "' style='z-index:" + (zIndex + parseInt(popupIndex)) + "'></div>");
            $("body").append("<div class='secondary-ui-view' id='secondary-ui-view_" + popupIndex + "' index='" + popupIndex + "' style='z-index:" + (zIndex + parseInt(popupIndex) + 1) + "'></div>");

            $timeout(function() {
                popupConfig.size = popupConfig.size ? popupConfig.size : 100;
                $("#secondary-ui-view_" + popupIndex).addClass("active").css("width", "calc(" + popupConfig.size + "% - 200px)");
                $("body").addClass("secondary_open");
            }, 100);
        };

        function removePopup(index) {
            $("#secondary-ui-view_" + index).removeClass("active");
            $timeout(function() {
                $("#secondary-ui-view_" + index).remove();
                $("#popupBackdrop" + index).remove();
            }, 400);

            $openedPopup.splice(index, 1);

            if (!$openedPopup.length) {
                $("body").removeClass("secondary_open");
            }
        }

        $(document).off("click").on("click", ".popupBackdrop", function(e) {
            var popupIndex = getTopIndex();
            if (typeof popupIndex != 'undefined') {
                var instance = $openedPopup[popupIndex];
                instance.deferred.result.resolve();
                removePopup(popupIndex);
            }
        });

        $(document).off("click").on("click", ".popupBackdrop", function(e) {
            var popupIndex = getTopIndex();
            if (typeof popupIndex != 'undefined') {
                var instance = $openedPopup[popupIndex];
                instance.deferred.result.resolve();
                removePopup(popupIndex);
            }
        });

        $(document).bind("keydown", function(e) {
            if (e.which === 27) {
                var popupIndex = getTopIndex();
                if (typeof popupIndex != 'undefined' && popupIndex > -1) {
                    var instance = $openedPopup[popupIndex];
                    instance.deferred.result.resolve();
                    removePopup(popupIndex);
                    e.preventDefault();
                }
            }
        });

        $popup.open = function(data) {
            var popupConfig = data;

            var modalResultDeferred = $q.defer();
            var modalOpenedDeferred = $q.defer();

            //prepare an instance of a modal to be injected into controllers and returned to a caller
            var popupInstance = {
                result: modalResultDeferred.promise,
                opened: modalOpenedDeferred.promise,
                deferred: {
                    result: modalResultDeferred,
                    opened: modalOpenedDeferred,
                },
                close: function(result) {
                    $popup.close(popupInstance, result);
                },
                dismiss: function(reason) {
                    $popup.close(popupInstance, reason);
                }
            };

            $openedPopup.push(popupInstance);
            var index = $openedPopup.length - 1;

            var popupScope = (popupConfig.scope || $rootScope).$new();
            popupScope.is_popup = true;
            if (data.hasOwnProperty("resolve")) {
                popupScope['popupData'] = data.resolve;
            }

            loadModal(popupConfig, index);

            if (data.hasOwnProperty("route")) {
                var route = routes[data.route];
                var _js = route.controller.split("@");
                popupConfig.js = _js[0];
                popupConfig.controller = _js[1];
                popupConfig.templateUrl = route.template;
            }

            if (popupConfig.hasOwnProperty("js")) {
                require([popupConfig.js], function() {
                    loadTemplate(popupConfig, index, popupScope);
                });
            } else {
                loadTemplate(popupConfig, index, popupScope);
            }

            return popupInstance;
        };

        $popup.close = function(popupInstance, result) {
            var index = getIndex(popupInstance);
            if (typeof index != 'undefined') {
                popupInstance.deferred.result.resolve(result);
                removePopup(index);
            }
        };

        $popup.dismiss = function(popupInstance, reason) {
            var index = getIndex(popupInstance);
            if (typeof index != 'undefined') {
                popupInstance.deferred.result.reject(reason);
                removePopup(index);
            }
        };

        $popup.getLast = function() {
            var topIndex = getTopIndex();

            if (topIndex > -1) {
                return $openedPopup[topIndex];
            } else {
                return false;
            }
        };

        $popup.getIndex = function(popupInstance) {
            return getIndex(popupInstance);
        }

        return $popup;
    });
});