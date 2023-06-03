/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

define(['angularAMD', 'require', 'trumbowyg', 'trumbowyg_color'], function(angularAMD, require) {

    // ngScroll App
    var textEditor = angular.module("textEditor", []);

    textEditor.directive('textEditor', function($parse, $filter, $location, $rootScope, $injector, $compile) {

        return {
            restrict: "A",
            require: '?ngModel',
            link: function(scope, element, attr, ngModel) {

                var options = angular.extend({
                    fullscreenable: true,
                    semantic: false,
                    closable: false,
                    btns: [
                        ['undo', 'redo'], // Only supported in Blink browsers
                        ['formatting'],
                        ['bold', 'italic', 'underline', 'strikethrough'],
                        ['foreColor', 'backColor'],
                        ['superscript', 'subscript'],
                        ['link'],
                        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
                        ['unorderedList', 'orderedList'],
                        ['horizontalRule'],
                        ['removeformat'],
                        ['viewHTML']
                    ]
                }, scope.$eval(attr.textEditor));

                ngModel.$render = function() {
                    var html = ngModel.$viewValue ? ngModel.$viewValue : "";
                    element.trumbowyg('html', html);
                };

                var editor = element.trumbowyg(options);

                editor.on('tbwchange', function() {
                    ngModel.$setViewValue(element.trumbowyg('html'));
                });

                editor.on('tbwpaste', function() {
                    ngModel.$setViewValue(element.trumbowyg('html'));
                });

                scope.$parent.$watch(attr.ngDisabled, function(newVal) {
                    element.trumbowyg(newVal ? 'disable' : 'enable');
                });
            }
        }
    });
});