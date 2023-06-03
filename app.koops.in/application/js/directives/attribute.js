/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD', 'require', 'icons'], function(angularAMD, require) {

    // ngScroll App
    var attribute = angular.module("attribute", ['icons']);

    attribute.value('attributeConfig', {});

    attribute.directive('attribute', function($parse, attributeConfig, $filter, $location, $http, $sticky, $compile, $timeout, $iconsService, $rootScope) {

        // Default Options
        var defaults = {};
        if (attributeConfig) {
            angular.extend(defaults, attributeConfig);
        }

        return {
            restrict: "A",
            link: function(scope, element, attr) {

                var attribute = {};
                var data = {};

                var timeout = attr.attributeTimeout != undefined ? attr.attributeTimeout : 0;
                var gridSize = attr.attributeColumn != undefined ? attr.attributeColumn : 3;
                $timeout(function() {
                    if (attr.attributeFor !== undefined && attr.attributeFor) {
                        data.id = attr.attributeFor;
                    }
                    if (attr.attributeMultiPrint !== undefined && attr.attributeMultiPrint) {
                        attribute = attr.attributeData !== undefined && attr.attributeData ? JSON.parse(attr.attributeData) : [];
                        scope._attribute_schema = attribute.attribute;
                        setElement();
                    } else {
                        $http({
                            url: serverUrl + "/public/common/web/getModuleAttribute/" + attr.attribute,
                            method: "post",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: data,
                        }).then(function(response) {
                            attribute = response.data;
                            scope._attribute_schema = attribute.attribute;
                            setElement();
                        }, function(rejection) {
                            $sticky.error(rejection.data.hasOwnProperty('error_description') ? rejection.data.error_description : messages.some_error);
                        });
                    }
                }, 500);

                var setElement = function() {
                    $(element).html("");
                    var section_ele = {};
                    var opt = [];
                    var _k = 1;
                    scope._attribute = [];

                    scope.uploadOptions = {
                        deleteElement: ".attribute_file_delete",
                        allowedFileType: ['gif', 'jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
                        submit: function(e, data) {

                            var fileInput = $(data.fileInput.context).attr("attribute_id");

                            $(".att_upload_" + fileInput).find(".attribute_file_input p").html(data.files[0].name);
                            $(".att_upload_" + fileInput).addClass("engage");
                            data.context = $(".att_upload_" + fileInput);
                        },
                        done: function(e, data) {
                            var fileData = $iconsService(data.files[0].name);
                            var html = "";
                            if (fileData.file_type === 'image') {
                                html = '<img src="' + data.result.files[0].thumbnailUrl + '" />';
                            } else {
                                html = fileData.icon;
                            }
                            data.context.find(".attribute_file_preview").html(html);
                            var att_id = data.context.find("input[type='file']").attr("attribute_id");
                        },
                        deleteCallback: function(ele) {
                            $(ele).removeClass("engage");
                            $(ele).find(".attribute_file_input p").html("");
                            $(ele).find(".attribute_file_preview").html('<i class="la la-file-o"></i>');
                            var att_id = $(ele).find("input[type='file']").attr("attribute_id");
                            scope.attribute[att_id] = "";
                        }
                    }

                    scope.uploadCameraOptions = {
                        deleteElement: ".attribute_file_delete",
                        allowedFileType: ['jpg', 'jpeg', 'png'],
                        submit: function(e, data) {

                            var fileInput = $(data.fileInput.context).attr("attribute_id");

                            $(".att_upload_" + fileInput).find(".attribute_file_input p").html(data.files[0].name);
                            $(".att_upload_" + fileInput).addClass("engage");
                            data.context = $(".att_upload_" + fileInput);
                        },
                        done: function(e, data) {
                            var fileData = $iconsService(data.files[0].name);
                            var html = "";
                            if (fileData.file_type === 'image') {
                                html = '<img src="' + data.result.files[0].thumbnailUrl + '" />';
                            }
                            data.context.find(".attribute_file_preview").html(html);
                            var att_id = data.context.find("input[type='file']").attr("attribute_id");
                        },
                        deleteCallback: function(ele) {
                            $(ele).removeClass("engage");
                            $(ele).find(".attribute_file_input p").html("");
                            $(ele).find(".attribute_file_preview").html('<i class="la la-file-o"></i>');
                            var att_id = $(ele).find("input[type='file']").attr("attribute_id");
                            scope.attribute[att_id] = "";
                        }
                    }

                    $(document).off("click", ".attribute_file_delete").on("click", ".attribute_file_delete", function() {
                        $(this).closest(".attribute_upload").removeClass("engage");
                        $(this).closest(".attribute_upload").find(".attribute_file_input p").html("");
                        $(this).closest(".attribute_upload").find(".attribute_file_preview").html('<i class="la la-file-o"></i>');
                        var att_id = $(this).closest(".attribute_upload").find("input[type='file']").attr("attribute_id");
                        scope.attribute[att_id] = "";
                    });

                    var attributeTemplate = {};

                    if (attr.attributeTemplate) {
                        attributeTemplate = scope.$eval(attr.attributeTemplate);
                    } else {
                        attributeTemplate = true;
                    }

                    $.each(attribute.attribute, function(i, val) {
                        if (attr.attributeType != 'view' || (typeof attributeTemplate === 'object' && attributeTemplate[val.id]) || attributeTemplate === true) {
                            if (!section_ele.hasOwnProperty(val.section)) {
                                section_ele[val.section] = $("<div />").addClass("attributeMain").addClass("clearfix");
                                $(element).append(section_ele[val.section]);
                                section_ele[val.section].append("<fieldset><legend>" + val.section + "</legend><div class='row attributeMainInner'></div></fieldset>");
                                _k = 1;
                            }

                            var col = $("<div />").addClass("col-md-" + gridSize).addClass("col-print-" + gridSize);

                            var box = $("<div />").addClass("box");
                            box.append('<div class="box_label">' + val.name + '</div>');
                            box.append('<div class="box_input"></div>');
                            var ele = "";

                            var model = 'ng-model = "attribute[' + val.id + ']"';
                            var placeholder = 'placeholder = "Enter ' + val.name + '"';

                            var attribute_value = [];

                            if (attribute.attribute_value) {
                                attribute_value = $.grep(attribute.attribute_value, function(a) {
                                    return a.attribute_id == val.id;
                                });
                            }

                            // for view
                            if (attr.attributeType == 'view') {
                                if (['single_line_text', 'number', 'email', 'phone', 'paragraph_text'].indexOf(val.type) >= 0) {
                                    if (!$.isEmptyObject(attribute_value) && attribute_value[0]['value']) {
                                        ele = '<p>' + attribute_value[0]['value'] + '</p>';
                                    } else {
                                        ele = '<p>-</p>';
                                    }
                                    scope._attribute.push({
                                        attribute_id: val.id,
                                        attribute_option_name: "",
                                        foreign_value: "",
                                        value: (!$.isEmptyObject(attribute_value) ? attribute_value[0]['value'] : "")
                                    });
                                } else if (val.type == 'date') {
                                    const date_value = !$.isEmptyObject(attribute_value) && attribute_value[0]['date_value'] ? $rootScope.convertToLocalTime(attribute_value[0]['date_value']) : '';
                                    if (date_value) {
                                        ele = '<p>' + date_value + '</p>';
                                    } else {
                                        ele = '<p>-</p>';
                                    }
                                    scope._attribute.push({
                                        attribute_id: val.id,
                                        attribute_option_name: "",
                                        foreign_value: "",
                                        value: "",
                                        date_value: (date_value ? date_value : "")
                                    });
                                } else if (val.type == 'dropdown' || val.type == 'radio') {
                                    if (val.source) {
                                        if (!$.isEmptyObject(attribute_value) && attribute_value[0]['foreign_value']) {
                                            ele = '<p>' + attribute_value[0]['foreign_value'] + '</p>';
                                        } else {
                                            ele = '<p>-</p>';
                                        }
                                        scope._attribute.push({
                                            attribute_id: val.id,
                                            attribute_option_name: "",
                                            foreign_value: (!$.isEmptyObject(attribute_value) ? attribute_value[0]['foreign_value'] : ""),
                                            value: ""
                                        });
                                    } else {
                                        if (!$.isEmptyObject(attribute_value) && attribute_value[0]['attribute_option_name']) {
                                            ele = '<p>' + attribute_value[0]['attribute_option_name'] + '</p>';
                                        } else {
                                            ele = '<p>-</p>';
                                        }
                                        scope._attribute.push({
                                            attribute_id: val.id,
                                            attribute_option_name: (!$.isEmptyObject(attribute_value) ? attribute_value[0]['attribute_option_name'] : ""),
                                            foreign_value: "",
                                            value: ""
                                        });
                                    }
                                } else if (val.type == 'multi_select' || val.type == 'checkbox') {
                                    if (val.source) {
                                        var value = "";
                                        if (!$.isEmptyObject(attribute_value)) {
                                            $.each(attribute_value, function(j, k) {
                                                value += value ? ", " + k['foreign_value'] : k['foreign_value'];
                                            });
                                        } else {
                                            value = '-';
                                        }
                                        ele = '<p>' + value + '</p>';
                                        scope._attribute.push({
                                            attribute_id: val.id,
                                            attribute_option_name: "",
                                            foreign_value: (value != "-" ? value : ""),
                                            value: ""
                                        });
                                    } else {
                                        var value = "";
                                        if (!$.isEmptyObject(attribute_value)) {
                                            $.each(attribute_value, function(j, k) {
                                                value += value ? ", " + k['attribute_option_name'] : k['attribute_option_name'];
                                            });
                                        } else {
                                            value = '-';
                                        }
                                        ele = '<p>' + value + '</p>';
                                        scope._attribute.push({
                                            attribute_id: val.id,
                                            attribute_option_name: (value != "-" ? value : ""),
                                            foreign_value: "",
                                            value: ""
                                        });
                                    }
                                } else if (val.type == 'attachment' || val.type == 'camera') {
                                    if (!$.isEmptyObject(attribute_value) && attribute_value[0]['value']) {
                                        var fileData = $iconsService(attribute_value[0]['url']);
                                        var html = "";
                                        if (fileData.file_type === 'image') {
                                            html = '<img src="' + attribute_value[0]['thumbnail_url'] + '" />';
                                        } else {
                                            html = fileData.icon;
                                        }
                                        ele = '<div class="attribute_upload preview att_upload_' + val.id + '">\n\
                                                <div class="attribute_file_preview" title="click to preview"><a href="' + attribute_value[0]['url'] + '" target="_blank">' + html + '</a></div>\n\
                                                <div class="attribute_file_input">\n\
                                                    <p>' + attribute_value[0]['value'] + '</p>\n\
                                                </div>\n\
                                           </div>';
                                    } else {
                                        ele = '<div class="attribute_upload preview att_upload_' + val.id + '">\n\
                                                <div class="attribute_file_preview"><i class="la la-file-o"></i></div>\n\
                                                <div class="attribute_file_input">\n\
                                                    <p>Not uploaded.</p>\n\
                                                </div>\n\
                                           </div>';
                                    }
                                }
                            } else {
                                if (['single_line_text', 'number', 'email', 'phone'].indexOf(val.type) >= 0) {
                                    if (!$.isEmptyObject(attribute_value)) {
                                        scope.attribute[val.id] = attribute_value[0]['value'];
                                    }

                                    ele = "<input type='text' class='text' placeholder='Enter " + val.name + "' ng-model='attribute[" + val.id + "]' />";
                                } else if (val.type == 'paragraph_text') {
                                    if (!$.isEmptyObject(attribute_value)) {
                                        scope.attribute[val.id] = attribute_value[0]['value'];
                                    }
                                    ele = "<textarea class='text' placeholder='Enter " + val.name + "' ng-model='attribute[" + val.id + "]'></textarea>";
                                } else if (val.type == 'dropdown') {
                                    if (val.source) {
                                        var uiSelect2Data = {};
                                        if (!$.isEmptyObject(attribute_value)) {
                                            scope.attribute[val.id] = attribute_value[0]['foreign_id'];
                                            uiSelect2Data = {
                                                id: attribute_value[0]['foreign_id'],
                                                text: attribute_value[0]['foreign_value']
                                            };
                                        }
                                        ele = '<input type="text" ui-select2="{ajax_url:\'' + val.source + '\', placeholder:\'Select ' + val.name + '\'}" ng-model="attribute[' + val.id + ']" ui-select2-data=\'' + JSON.stringify(uiSelect2Data) + '\' />';
                                    } else {
                                        opt = $.grep(attribute.attribute_option, function(a) {
                                            return a.attribute_id == val.id;
                                        });

                                        var uiSelect2Data;
                                        if (!$.isEmptyObject(attribute_value) && attribute_value[0]['attribute_option_id']) {
                                            scope.attribute[val.id] = '' + attribute_value[0]['attribute_option_id'];
                                            uiSelect2Data = '' + attribute_value[0]['attribute_option_id'];
                                        }
                                        ele = "<select ng-model='attribute[" + val.id + "]' ui-select2='{placeholder:\"Select " + val.name + "\"}' ui-select2-data='" + JSON.stringify(uiSelect2Data) + "'><option></option>";

                                        $.each(opt, function(j, k) {
                                            ele += "<option value='" + k.id + "'>" + k.name + "</option>";
                                        });

                                        ele += "</select>";
                                    }
                                } else if (val.type == 'multi_select') {
                                    if (val.source) {
                                        var uiSelect2Data = [];
                                        scope.attribute[val.id] = [];
                                        if (!$.isEmptyObject(attribute_value)) {
                                            $.each(attribute_value, function(j, k) {
                                                uiSelect2Data.push({
                                                    id: k['foreign_id'],
                                                    text: k['foreign_value']
                                                });
                                                scope.attribute[val.id].push(k['foreign_id']);
                                            });
                                        }
                                        ele = '<input type="text" ui-select2="{ajax_url:\'' + val.source + '\', placeholder:\'Select ' + val.name + '\', multiple:true}" ng-model="attribute[' + val.id + ']" ui-select2-data=\'' + JSON.stringify(uiSelect2Data) + '\' />';
                                    } else {
                                        opt = $.grep(attribute.attribute_option, function(a) {
                                            return a.attribute_id == val.id;
                                        });

                                        var uiSelect2Data = [];
                                        scope.attribute[val.id] = [];
                                        if (!$.isEmptyObject(attribute_value)) {
                                            $.each(attribute_value, function(j, k) {
                                                uiSelect2Data.push(k['attribute_option_id']);
                                                scope.attribute[val.id].push(k['attribute_option_id']);
                                            });
                                        }

                                        ele = "<select ng-model='attribute[" + val.id + "]' ui-select2='{placeholder:\"Select " + val.name + "\"}' ui-select2-data='" + JSON.stringify(uiSelect2Data) + "' multiple><option></option>";

                                        $.each(opt, function(j, k) {
                                            ele += "<option value='" + k.id + "'>" + k.name + "</option>";
                                        });

                                        ele += "</select>";
                                    }

                                } else if (val.type == 'date') {
                                    if (!$.isEmptyObject(attribute_value) && attribute_value[0]['date_value']) {
                                        scope.attribute[val.id] = $rootScope.convertToLocalTime(attribute_value[0]['date_value']);
                                    }
                                    ele = '<div class="input-group date" k-datepicker="">\n\
                                                <input type="text" class="text" placeholder="Select ' + val.name + '" ng-model="attribute[' + val.id + ']" />\n\
                                                <span class="input-group-addon text_date_icon"><i class="la la-calendar"></i></span>\n\
                                           </div>';
                                } else if (val.type == 'checkbox' || val.type == 'radio') {
                                    opt = $.grep(attribute.attribute_option, function(a) {
                                        return a.attribute_id == val.id;
                                    });

                                    ele = "<div class='row'>";

                                    var opt_value = [];
                                    var ngChecked = "";
                                    scope.attribute[val.id] = {};

                                    $.each(opt, function(j, k) {
                                        opt_value = $.grep(attribute_value, function(a) {
                                            return a.attribute_option_id == k.id;
                                        });

                                        var ngChecked = "ng-checked='" + (opt_value.length) + "'";

                                        if (val.type == 'checkbox') {
                                            if (opt_value.length) {
                                                scope.attribute[val.id][k.id] = 1;
                                            }
                                            ele += "<div class='col-md-6'><input ng-model='attribute[" + val.id + "][" + k.id + "]' ng-true-value='1' ng-false-value='' type='checkbox' " + ngChecked + " id='attribute_" + val.id + "_" + k.id + "' /> <label for='attribute_" + val.id + "_" + k.id + "'>" + k.name + "</label></div>";
                                        } else if (val.type == 'radio') {
                                            //scope.attribute[val.id] = "";

                                            if (opt_value.length) {
                                                scope.attribute[val.id] = k.id
                                            }
                                            ele += "<div class='col-md-6'><input name='" + val.name + "' ng-model='attribute[" + val.id + "]' value='" + k.id + "' type='radio' " + ngChecked + " id='attribute_" + val.id + "_" + k.id + "' /> <label for='attribute_" + val.id + "_" + k.id + "'>" + k.name + "</label></div>";
                                        }
                                    });

                                    ele += "</div>";

                                } else if (val.type == 'attachment') {
                                    var html = '<i class="la la-file-o"></i>';
                                    var _class = "";
                                    var _file_name = "";
                                    if (!$.isEmptyObject(attribute_value) && attribute_value[0]['value']) {
                                        scope.attribute[val.id] = attribute_value[0]['value'];
                                        var fileData = $iconsService(attribute_value[0]['url']);
                                        if (fileData.file_type === 'image') {
                                            html = '<img src="' + attribute_value[0]['thumbnail_url'] + '" />';
                                        } else {
                                            html = fileData.icon;
                                        }
                                        _class = scope.attribute[val.id] ? 'engage' : "";
                                        _file_name = scope.attribute[val.id];
                                    }

                                    ele = '<div class="attribute_upload att_upload_' + val.id + ' ' + _class + '">\n\
                                                <div class="attribute_file_preview">' + html + '</div>\n\
                                                <div class="attribute_file_input">\n\
                                                    <p>' + _file_name + '</p>\n\
                                                    <input type="file" fileupload="uploadOptions" attribute_id = "' + val.id + '" ng-model="attribute[' + val.id + ']" />\n\
                                                    <span class="attribute_file_delete">Delete</span>\n\
                                                </div>\n\
                                           </div>';
                                } else if (val.type == 'camera') {
                                    var html = '<i class="la la-file-o"></i>';
                                    var _class = "";
                                    var _file_name = "";
                                    if (!$.isEmptyObject(attribute_value) && attribute_value[0]['value']) {
                                        scope.attribute[val.id] = attribute_value[0]['value'];
                                        var fileData = $iconsService(attribute_value[0]['url']);
                                        if (fileData.file_type === 'image') {
                                            html = '<img src="' + attribute_value[0]['thumbnail_url'] + '" />';
                                        } else {
                                            html = fileData.icon;
                                        }
                                        _class = scope.attribute[val.id] ? 'engage' : "";
                                        _file_name = scope.attribute[val.id];
                                    }

                                    ele = '<div class="attribute_upload attribute_camera att_upload_' + val.id + ' ' + _class + '">\n\
                                                <div class="attribute_file_preview">' + html + '</div>\n\
                                                <div class="attribute_file_input">\n\
                                                    <p>' + _file_name + '</p>\n\
                                                    <input type="file" fileupload="uploadCameraOptions" attribute_id = "' + val.id + '" ng-model="attribute[' + val.id + ']" />\n\
                                                    <span class="attribute_file_delete">Delete</span>\n\
                                                </div>\n\
                                           </div>';
                                }
                            }

                            box.find(".box_input").append(ele);
                            //box.find(".box_input").append('<p class="text-danger small att_error" att_id="' + val.id + '"></p>');
                            box.find(".box_input").append('<p class="text-danger small att_error" att_id="attribute-' + val.id + '"></p>');
                            box.append('<div class="clearfix"></div>');

                            $compile(box)(scope);

                            col.append(box);
                            section_ele[val.section].find(".attributeMainInner").append(col);
                            if (_k % (12 / gridSize) == 0) {
                                section_ele[val.section].find(".attributeMainInner").append("<div class='clearfix'></div>");
                            }
                            _k++;
                        }
                    });

                    setTimeout(function() {
                        $rootScope.$broadcast('attributeLoaded');
                    }, 100);
                }

                scope.$on("resetAttribute", function(event, args) {
                    setElement();
                });
            }
        }
    });
});