/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // Breadcrumb App
    var icons = angular.module("icons", []);

    // factory for icons
    icons.factory('$iconsService', function($http, $location, $sce, $modal, $compile) {
        var imgIcon = [];
        return function(url) {

            var ext_array = url.split(".");
            var ext = ext_array[ext_array.length - 1];
            var fileData = {};

            if ((/(gif|jpe?g|png|tiff|bmp|png|svg)$/i).test(ext)) {
                fileData.file_type = "image";
            } else if ((/(pdf)$/i).test(ext)) {
                fileData.file_type = "other";
                fileData.icon = '<img src="' + appUrl + '/assets/images/icons/pdf-48_32.png" class="icon" />';
            } else if ((/(docx?)$/i).test(ext)) {
                fileData.file_type = "other";
                fileData.icon = '<img src="' + appUrl + '/assets/images/icons/docx_win-48_32.png" class="icon" />';
            } else if ((/(xlsx?|csv)$/i).test(ext)) {
                fileData.file_type = "other";
                fileData.icon = '<img src="' + appUrl + '/assets/images/icons/xlsx_win-48_32.png" class="icon" />';
            } else if ((/(pptx?)$/i).test(ext)) {
                fileData.file_type = "other";
                fileData.icon = '<img src="' + appUrl + '/assets/images/icons/pptx_win-48_32.png" class="icon" />';
            } else if ((/(txt|rtf)$/i).test(ext)) {
                fileData.file_type = "other";
                fileData.icon = '<img src="' + appUrl + '/assets/images/icons/text-48_32.png" class="icon" />';
            } else if ((/(zip|rar|tar)$/i).test(ext)) {
                fileData.file_type = "other";
                fileData.icon = '<img src="' + appUrl + '/assets/images/icons/zip-48_32.png" class="icon" />';
            } else if ((/(mp4)$/i).test(ext)) {
                fileData.file_type = "video";
                fileData.icon = '<img src="' + appUrl + '/assets/images/video.png" class="icon" />';
            } else if ((/(mp3)$/i).test(ext)) {
                fileData.file_type = "audio";
                fileData.icon = '<img src="' + appUrl + '/assets/images/icons_48px/mp3.png" class="icon" />';
            }
            return fileData;
        };
    });

    icons.directive('fileIcon', function($parse, $location, $rootScope, $http, $compile, $modal, $cookies, $filter, $iconsService) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                var file_tenant = $rootScope.USERCONST._kscustomerid;
                var icon = "";
                if (attr.fileIcon) {
                    var data = scope.$eval(attr.fileIcon);
                    if (data.url) {
                        //check url is youtube url
                        var youtube_url = data.url.match(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/);
                        if (youtube_url) {
                            var thumb_img = "https://img.youtube.com/vi/" + (youtube_url[1] ? youtube_url[1] : youtube_url[2]) + "/2.jpg";
                            icon = '<img src="' + (thumb_img ? thumb_img : appUrl + '/assets/images/play_02.png') + '"/>';
                        } else {
                            var fileData = $iconsService(data.url);
                            if (data.module && (data.module.module == 'expense' || data.module.module == 'complaint')) {
                                icon = fileData.file_type == 'image' ? '<img src="' + baseUrl + '/upload/' + file_tenant + '/' + data.module.module + '/thumbnail/' + data.url + '" class="image" />' : fileData.icon;
                            } else {
                                icon = fileData.file_type == 'image' ? '<img src="' + baseUrl + '/upload/' + file_tenant + '/media/thumbnail/' + data.url + '" class="image" />' : fileData.icon;
                                if (fileData.file_type === undefined) {
                                    icon = '<img src="' + appUrl + '/assets/images/icons/link.png" class="image" />';
                                }
                            }
                        }
                    } else if (data.type && data.type == 'video') {
                        icon = '<img src="' + appUrl + '/assets/images/video.png" />';
                    } else if (data.type && data.type == 'folder') {
                        icon = '<img src="' + appUrl + '/assets/images/icons/folder.png" />';
                    }

                    element.append(icon);
                }
            }
        }
    });

});