/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Modal App
    var stickyMessage = angular.module("stickyMessage", []);

    // factory for table
    stickyMessage.factory('$sticky', function($http, $location, $sce, $compile) {

        var data = {};

        var element = $("<div />").addClass("stickyMessageWrapper").html('<span class="stickyMessage hidden-print"></span>');

        // Error
        data.error = function(message) {
            $(element).find(".stickyMessage")
                .removeClass("success")
                .removeClass("warning")
                .removeClass("info")
                .addClass("error")
                .html(message);
            _getIn(element);
        }

        // Success
        data.success = function(message) {
            $(element).find(".stickyMessage")
                .removeClass("error")
                .removeClass("warning")
                .removeClass("info")
                .addClass("success")
                .html(message);
            _getIn(element);
        }

        // Warning
        data.warning = function(message) {
            $(element).find(".stickyMessage")
                .removeClass("success")
                .removeClass("error")
                .removeClass("info")
                .addClass("warning")
                .html(message);
            _getIn(element);
        }

        // Info
        data.info = function(message) {
            $(element).find(".stickyMessage")
                .removeClass("success")
                .removeClass("warning")
                .removeClass("error")
                .addClass("info")
                .html(message);
            _getIn(element);
        }

        function _getIn(ele) {
            $("body").prepend(ele);
            $(ele).animate({
                top: '0px'
            }, '500');
            setTimeout(function() {
                $(ele).animate({
                    top: '-30px'
                }, '500', function() {
                    $(ele).remove();
                });
            }, 2000);
        }

        return data;
    });
});