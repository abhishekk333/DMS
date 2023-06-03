/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD', 'require', 'fileupload', 'fileupload-ui'], function(angularAMD, require) {

    // ngScroll App
    var ngUpload = angular.module("ng-upload", []);

    ngUpload.value('ngUploadConfig', {});

    ngUpload.directive('fileupload', function($parse, ngUploadConfig, $filter, $modal, $rootScope) {

        // Default Options
        var options = {
            url: serverUrl + "/public/common/upload",
            dataType: "JSON",
            maxSize: 2 * 1024 * 1024,
            allowedFileType: ['gif', 'jpg', 'jpeg', 'png', 'tiff', 'bmp', 'svg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'zip', 'rar', 'tar', 'mp4', 'mp3'],
            dropZone: null,
            pasteZone: null,
            autoUpload: true,
            singleFileUploads: false,
            maxNumberOfFiles: 5,
            module: null
        };
        if (ngUploadConfig) {
            angular.extend(options, ngUploadConfig);
        }

        return {
            restrict: "A",
            link: function(scope, element, attr) {
                var getter = $parse(attr.ngModel);
                var setter = getter.assign;
                var opts = angular.extend({}, options, scope.$eval(attr.fileupload));

                opts.dropZone = opts.dropZone ? $(opts.dropZone) : $(element);

                if ($.isFunction(opts.submit))
                    var submit_function = opts.submit;

                opts.submit = function(e, data) {
                    if (submit_function)
                        submit_function(e, data);

                    if (!data.context)
                        data.context = element;

                    data.formData = {
                        access_token: $rootScope.LOGINCONST._ksat,
                        username: $rootScope.USERCONST._ksemail,
                        global_user_id: $rootScope.USERCONST._ksglobaluserid,
                        request_from: request_from,
                        app_version: app_version,
                        module: opts.module
                    }

                    data.context.each(function(i) {
                        if ($(this).attr("file") == 'undefined') {
                            $(this).attr("file", data.files[i]['name']);
                        }

                        //                        if (opts.deleteElement) {
                        //                            $(this).find(opts.deleteElement).unbind("click").bind("click", function () {
                        //                                abortUpload(data.files[i]);
                        //                            });
                        //                        }
                    });

                    //                    if (opts.deleteElement) {
                    //                        data.context.find(opts.deleteElement).unbind("click").bind("click", function () {
                    //                            abortUpload(data);
                    //                        });
                    //                    }
                }

                if ($.isFunction(opts.add))
                    var add_function = opts.add;

                opts.add = function(e, data) {
                    if (add_function)
                        add_function(e, data);

                    if (data.files.length > opts.maxNumberOfFiles) {
                        scope.modalInstance = $modal.open({
                            template: getModalTemplate(messages.too_many_files_heading, sprintf(messages.too_many_files_description, opts.maxNumberOfFiles)),
                            scope: scope
                        });

                        return false;
                    } else {
                        $.each(data.files, function(i, val) {
                            if (opts.allowedFileType && opts.allowedFileType instanceof Array) {
                                var ext = val['name'].split(".");
                                ext = ext[ext.length - 1];
                                ext = $filter('lowercase')(ext);
                                if ($.inArray(ext, opts.allowedFileType) < 0) {
                                    var join = opts.allowedFileType.join(", ");

                                    scope.modalInstance = $modal.open({
                                        template: getModalTemplate(messages.not_allowed_extension_heading, sprintf(messages.not_allowed_extension_description, join)),
                                        scope: scope
                                    });

                                    return false;

                                }
                            }

                            if (opts.maxSize) {
                                if (val.size > opts.maxSize) {
                                    var b = opts.maxSize;

                                    if (b < 1024)
                                        b = b + " Bytes";
                                    else if (b < 1048576)
                                        b = (b / 1024).toFixed(1) + " KB";
                                    else if (b < 1073741824)
                                        b = (b / 1048576).toFixed(1) + " MB";
                                    else
                                        b = (b / 1073741824).toFixed(1) + " GB";

                                    scope.modalInstance = $modal.open({
                                        template: getModalTemplate(messages.large_file_heading, sprintf(messages.large_file_description, b)),
                                        scope: scope
                                    });

                                    return false;
                                }
                            }
                            if (i == data.files.length - 1)
                                data.submit();
                        });
                    }
                }

                if ($.isFunction(opts.done))
                    var done_function = opts.done;

                opts.done = function(e, data) {
                    $.each(data.result.files, function(i, val) {
                        if (val.hasOwnProperty("error")) {
                            scope.modalInstance = $modal.open({
                                template: getModalTemplate(messages.upload_failed_heading, val['error']),
                                scope: scope
                            });
                            data.context.remove();
                            return false;

                        } else {
                            if (attr.hasOwnProperty('ngModel')) {
                                if (attr.hasOwnProperty("multiple")) {
                                    var old = getter(scope);

                                    if (typeof old != 'undefined' && old instanceof Array)
                                        old.push(val.name);
                                    else
                                        old = [val.name];

                                    setter(scope, old);
                                } else
                                    setter(scope, val.name);

                                if (opts.deleteElement) {
                                    console.log("Sdsdsd");
                                    console.log($(data.context).parent().find("[file='" + data.files[i].name + "']"));
                                    $(data.context).parent().find("[file='" + data.files[i].name + "']").find(opts.deleteElement).unbind("click").bind("click", function() {
                                        console.log("sdsd");
                                        deleteFile($(data.context).parent().find("[file='" + data.files[i].name + "']"), val);
                                    });
                                }
                            }
                        }
                        if (i == data.files.length - 1 && done_function)
                            done_function(e, data);

                    });
                }

                if ($.isFunction(opts.fail))
                    var fail_function = opts.fail;

                opts.fail = function(e, data) {
                    data.context.remove();
                    scope.modalInstance = $modal.open({
                        template: getModalTemplate(messages.upload_failed_heading, messages.upload_failed_description),
                        scope: scope
                    });

                    if (fail_function)
                        fail_function(e, data);
                }

                scope.modelCancel = function() {
                    scope.modalInstance.dismiss('cancel');
                }

                $(element).fileupload(opts);

                if (opts.dropZone) {
                    $(document).bind('dragover', function(e) {
                        opts.dropZone.addClass("file_in");
                    });

                    opts.dropZone.bind('dragover', function(e) {
                        opts.dropZone.addClass("file_hover");
                    });

                    $(document).bind('drop', function(e) {
                        opts.dropZone.removeClass("file_in file_hover");
                    });

                    $(document).bind('dragleave', function(e) {
                        opts.dropZone.removeClass("file_in file_hover");
                    });
                }


                function deleteFile(_ele, val) {
                    var deleteUrl = val.deleteUrl;

                    deleteUrl += '&access_token=' + $rootScope.LOGINCONST._ksat;
                    deleteUrl += '&username=' + $rootScope.USERCONST._ksemail;
                    deleteUrl += '&global_user_id=' + $rootScope.USERCONST._ksglobaluserid;
                    deleteUrl += '&request_from=' + request_from;
                    deleteUrl += '&app_version=' + app_version;

                    $.ajax({
                        url: deleteUrl,
                        type: "DELETE",
                        success: function(result) {
                            if (attr.hasOwnProperty('ngModel')) {
                                if (attr.hasOwnProperty("multiple")) {
                                    var old = getter(scope);
                                    if (typeof old != 'undefined' && old instanceof Array)
                                        old.splice($.inArray(val.name, old), 1);
                                    else
                                        old = [];

                                    setter(scope, old);
                                } else
                                    setter(scope, "");
                            }

                            if (opts.hasOwnProperty("deleteCallback")) {
                                opts.deleteCallback(_ele);
                            } else {
                                _ele.remove();
                            }
                        }
                    });
                }

                function abortUpload(data) {

                    if (data.jqXHR) {
                        data.jqXHR.abort();
                    }
                    data.context.remove();
                }

                function getModalTemplate(heading, description) {
                    var modalHtml = '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="modelCancel()" >×</button>' +
                        '<h3 class="modal-title">' + heading + '</h3>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        description +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button class="btn btn-important" ng-click="modelCancel()">OK</button>' +
                        '</div>';
                    return modalHtml;
                }
            }
        }
    });
});