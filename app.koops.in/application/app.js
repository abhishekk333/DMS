var cookie = document.cookie;
var _right, _const, _software, _formData;

if (cookie && cookie.indexOf('_ksld') > -1 && cookie.indexOf('_ksud') > -1) {
    cookie = cookie.split(";");
    var ck = [];

    for (var i = 0; i < cookie.length; i++) {
        var temp_cookie = unescape(cookie[i]).trim();
        if (temp_cookie.indexOf('_ksld') > -1 || temp_cookie.indexOf('_ksud') > -1) {
            var temp = temp_cookie.split("=");
            ck[temp[0]] = JSON.parse(temp[1]);
        }
    }

    if (ck['_ksud']["_ksusergroup"] == 'account') {
        window.location.href = customerUrl;
    }

    var required = ['angularAMD', 'angular-ui-router', 'route', 'helper', 'const', 'angular-cookies', 'plugin', 'auth', 'httpInterceptor', 'table', 'ui-select2', 'ui-bootstrap', 'stickyMessage', 'attribute', 'datepicker', 'import', 'hotkey', 'activityService', 'date', 'help', 'settingService', 'searchMenu', 'popupService', 'moment_timezone'];

    define(required, function(angularAMD) {
        var app = angular.module("koops_app", ['ui.router', 'ngCookies', 'ngPlugins', 'auth', 'httpInterceptor', 'table', 'ui-select2', 'ui.bootstrap', 'stickyMessage', 'attribute', 'datepicker', 'import', 'cfp.hotkeys', 'activityService', 'date', 'help', 'settingService', 'searchMenu', 'popupService']);

        app.config(function($locationProvider, $httpProvider, $stateProvider, $urlRouterProvider, USERCONST, LOGINCONST, USERSOFTWARE, $modalProvider) {

            // when '/' (blank)
            if (_right.indexOf('manage_activity') > -1) {
                $urlRouterProvider.when('', '/activity');
            } else {
                $urlRouterProvider.when('', '/dashboard');
            }

            // when state not found
            $urlRouterProvider.otherwise('/404');

            // 404
            $stateProvider.state("404", {
                url: "/404",
                externalUrl: "../error_page/404.html"
            });

            // 401
            $stateProvider.state("401", {
                url: "/401",
                externalUrl: "../error_page/401.html"
            });

            // 503
            $stateProvider.state("503", {
                url: "/503",
                externalUrl: "../error_page/503.html"
            });

            // 505
            $stateProvider.state("505", {
                url: "/505",
                externalUrl: "../error_page/505.html"
            });

            $.each(routes, function(i, val) {
                $stateProvider.state(i, {
                    url: "/" + val.url,
                    templateUrl: function() {
                        return val.template;
                    },
                    resolve: {
                        loadController: ['$q', '$stateParams', '$state', function($q, $stateParams, $state) {
                            var deferred = $q.defer();

                            var js = val.controller.split("@");
                            var permission = false;
                            var software = false;

                            if (val.software && val.software.length) {
                                $.each(val.software, function(j, value) {
                                    if (_software.indexOf(value) > -1) {
                                        software = true;
                                    }
                                });
                            } else {
                                software = true;
                            }

                            if (val.filter && val.filter.length) {
                                $.each(val.filter, function(j, value) {
                                    // add,edit,view right check for formdata form code wise
                                    if ($stateParams.hasOwnProperty("form_code") && $stateParams.form_code !== '') {
                                        value = value.replace(":form_code", $stateParams.form_code)
                                    }
                                    if (_right.indexOf(value) > -1) {
                                        permission = true;
                                    }
                                });
                            } else {
                                permission = true;
                            }

                            js = js[0];
                            require([js], function() {
                                if (software) {
                                    if (permission) {
                                        deferred.resolve();
                                    } else {
                                        require.undef(js);
                                        window.location.href = "../error_page/401.html";
                                    }
                                } else {
                                    require.undef(js);
                                    window.location.href = "../error_page/404.html";
                                }
                            }, function(err) {
                                require.undef(js);
                                window.location.href = "../error_page/404.html";
                            });
                            return deferred.promise;
                        }]
                    },
                    controllerProvider: function($stateParams) {
                        var controller = val.controller.split("@");
                        return controller[1];
                    }
                });
            });

            $httpProvider.defaults.headers.post = {
                'Content-Type': 'application/json'
            };
            $httpProvider.interceptors.push('myHttpInterceptor');
            $modalProvider.options.openedClass = 'openModal';

        });

        app.run(function($rootScope, $stateParams, $location, $cookies, $auth, $httpBuffer, $http, USERCONST, LOGINCONST, USERRIGHT, USERSOFTWARE, SUBEND, GOOGLEAPIKEY, ADVANCEFEATURE, ISCUSTOM, UNIT, SETTING, $compile, $modal, $sticky, $importService, $activityService, $timeout, hotkeys, $helpService, $settingService, $popup) {
            $rootScope.MAX_FILE_SIZE = 2 * 1024 * 1024;
            $rootScope.USERCONST = USERCONST;
            $rootScope.LOGINCONST = LOGINCONST;
            $rootScope.USERRIGHT = USERRIGHT;
            $rootScope.USERSOFTWARE = USERSOFTWARE;
            $rootScope.SUBEND = SUBEND;
            $rootScope.GOOGLEAPIKEY = GOOGLEAPIKEY;
            $rootScope.ADVANCEFEATURE = ADVANCEFEATURE;
            $rootScope.ISCUSTOM = ISCUSTOM;
            $rootScope.UNIT = UNIT;
            $rootScope.SETTING = SETTING;
            $rootScope.Math = window.Math; // to use Math function in template
            $rootScope.parseFloat = parseFloat; // to use Math function in template
            $rootScope.reLogin = false;
            $rootScope.logout = function() {
                $.each($cookies.getAll(), function(i, val) {
                    $cookies.remove(i, {
                        path: cookiePath
                    });
                    $cookies.remove(i, {
                        path: cookiePath,
                        domain: cookieDomain
                    });
                })
                localStorage.clear();
                $auth.logout();
            }

            $rootScope.getFormData = function() {
                return _formData;
            }

            $rootScope.LOCALTIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone == 'Asia/Calcutta' ? 'Asia/Kolkata' : Intl.DateTimeFormat().resolvedOptions().timeZone;
            $rootScope.SERVERTIMEZONE = 'Asia/Kolkata';

            // Load script for google maps
            var script = document.createElement('script');
            script.type = 'text/javascript';
            // script.src = 'https://maps.googleapis.com/maps/api/js?key=' + $rootScope.GOOGLEAPIKEY;
            script.src = 'https://maps.googleapis.com/maps/api/js?key=' + $rootScope.GOOGLEAPIKEY + '&libraries=drawing,geometry&.js';
            document.body.appendChild(script);

            // When State Change Start
            $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

                //close select2 when redirect or back event fire
                $('[ui-select2]').select2("close");

                /*if ($rootScope.somethingChanged) {
                    $rootScope.formChanges($rootScope.somethingChanged, toState, toParams, fromState, fromParams);
                    event.preventDefault();
                } else {
                    $rootScope.somethingChanged = false;*/
                $("[ui-view]").html('<div class="stateLoader"><img src="assets/images/svg-loaders/oval.svg" alt="Please Wait..." height="48" width="48" style="margin-bottom: 20px;" /></div>');

                var states = toState.name.split("/");
                $rootScope.param = toParams;
                $rootScope.current_state = (states[0] == $rootScope.USERCONST._kscustomerid) ? states[1] : states[0];
                $rootScope.open = (states[0] == $rootScope.USERCONST._kscustomerid) ? states[1] : states[0];

                if (toState.hasOwnProperty("externalUrl") && toState.externalUrl) {
                    window.location.href = toState.externalUrl;
                }

                // Unload Previous Module
                if (fromState.name && $.inArray(fromState.name, ['401', '400']) <= -1) {
                    var js = routes[fromState.name]['controller'].split("@");
                    require.undef(js[0]);
                }

                // Check for Logged In or Not.
                if (!$auth.loggedIn()) {
                    window.location.reload();
                }
                /*}*/
                setTimeout(function() {
                    $('form, input, select').attr('autocomplete', 'new-password');
                }, 100);
            });

            $rootScope.$on('loginRequired', function() {
                if (!$rootScope.reLogin) {
                    $rootScope.reLogin = true;
                    $auth.reLogin().then(function(data, configUpdater) {
                        var updater = configUpdater || function(config) {
                            return config;
                        };
                        $httpBuffer.retryAll(updater);
                        $rootScope.reLogin = false;
                    }, function(response) {
                        window.location.href = baseUrl;
                    });
                }
            });

            $(document).keyup(function(e) {
                if (e.which == 9) {
                    if ($(":focus").hasClass('last_focus')) {
                        $(".btn-important:first").focus();
                    }
                }
            });

            $rootScope.checkRight = function(right) {
                var flag = false;

                $.each(right, function(i, val) {
                    if ($rootScope.USERRIGHT.indexOf(val) > -1) {
                        flag = true;
                        return false;
                    }
                });

                return flag;
            };

            $rootScope.checkSoftware = function(software) {
                var flag = false;
                $.each(software, function(i, val) {
                    if ($rootScope.USERSOFTWARE.indexOf(val) > -1) {
                        flag = true;
                        return false;
                    }
                });

                return flag;
            };

            $rootScope.checkSetting = function(setting, value) {
                return $settingService.check(setting, value);
            };

            $rootScope.convertToServerTime = function(date, displayFormat = 'DD-MM-YYYY', givenFormat = 'DD-MM-YYYY') {
                const moment = require('moment').tz.setDefault($rootScope.LOCALTIMEZONE);
                let returnData = '';
                if (date.indexOf(':') > -1) {
                    returnData = moment(date, givenFormat);
                } else {
                    let _givenFormat = givenFormat.indexOf(':') === -1 ? (givenFormat + ' HH:mm:ss') : givenFormat;
                    const currentSeconds = moment().format('HH:mm:ss');
                    returnData = moment((date + ' ' + currentSeconds), _givenFormat);
                }
                if ($rootScope.LOCALTIMEZONE !== $rootScope.SERVERTIMEZONE) {
                    returnData = returnData.tz($rootScope.SERVERTIMEZONE);
                }
                return returnData.format(displayFormat);
            }

            $rootScope.convertToLocalTime = function(date, displayFormat = 'DD-MM-YYYY', givenFormat = 'YYYY-MM-DD HH:mm:ss') {
                const moment = require('moment').tz.setDefault($rootScope.SERVERTIMEZONE);
                let returnData = '';
                if (date.indexOf(':') > -1) {
                    returnData = moment(date, givenFormat);
                } else {
                    const currentSeconds = moment().format('HH:mm:ss');
                    returnData = moment((date + ' ' + currentSeconds), givenFormat);
                }
                if ($rootScope.LOCALTIMEZONE !== $rootScope.SERVERTIMEZONE) {
                    returnData = returnData.tz($rootScope.LOCALTIMEZONE);
                }
                return returnData.format(displayFormat);
            }

            $rootScope.convertDataToServerTime = function(moduleConfig) {
                const returnData = {
                    moduleData: moduleConfig.moduleData
                };
                if (moduleConfig.hasOwnProperty('moduleKey') && moduleConfig.moduleKey.length > 0) {
                    const moduleData = angular.copy(moduleConfig.moduleData);
                    moduleConfig.moduleKey.map(function(x) {
                        if (moduleData[x] && moduleData[x] !== '' && moduleData[x] !== null) {
                            moduleData[x] = $rootScope.convertToServerTime(moduleData[x], 'YYYY-MM-DD HH:mm:ss');
                        }
                    });
                    returnData['moduleData'] = moduleData;
                }

                if (moduleConfig.hasOwnProperty('attribute') && moduleConfig.hasOwnProperty('attribute_schema')) {
                    const attributeData = angular.copy(moduleConfig.attribute);
                    moduleConfig.attribute_schema.map(function(x) {
                        if (x['type'] == 'date' && attributeData[x['id']] != undefined && attributeData[x['id']] != null && attributeData[x['id']] != "") {
                            attributeData[x['id']] = $rootScope.convertToServerTime(attributeData[x['id']], 'YYYY-MM-DD HH:mm:ss')
                        }
                    });
                    returnData['attributeData'] = attributeData;
                }
                return returnData;
            }

            $rootScope.convertFromToDateServerTime = function(dateArray) {
                const returnDateArray = angular.copy(dateArray);
                if (returnDateArray.hasOwnProperty('from_date') && returnDateArray['from_date'] !== '' && returnDateArray['from_date'] !== null) {
                    returnDateArray.from_date = $rootScope.convertToServerTime(dateArray.from_date + ' 00:00:00', 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm:ss');
                    returnDateArray._from_date = dateArray.from_date;
                }
                if (returnDateArray.hasOwnProperty('to_date') && returnDateArray['to_date'] !== '' && returnDateArray['to_date'] !== null) {
                    returnDateArray.to_date = $rootScope.convertToServerTime(dateArray.to_date + ' 23:59:59', 'DD-MM-YYYY HH:mm:ss', 'DD-MM-YYYY HH:mm:ss');
                    returnDateArray._to_date = dateArray.to_date;
                }
                return returnDateArray;
            }

            $rootScope.customer_module_name = $rootScope.checkSoftware(['kims']) ? "Account" : "Customer";

            $rootScope.print = function() {
                window.print();
            };

            $rootScope.converToTitleCase = function(val) {
                return val.replace(/^_*(.)|_+(.)/g, (val, c, d) => c ? c.toUpperCase() : ' ' + d.toUpperCase());
            }

            $rootScope.showNotification = function(notification) {
                notification = typeof notification != 'undefined' ? notification : "order_deal";

                if (!$("#" + notification + "_notification").hasClass("active") || !$(".slide_notification").hasClass("active")) {
                    $(".slide_notification_icon.active").removeClass("active");
                    $("#" + notification + "_notification").addClass("active");
                    $(".slide_notification_main ul").html("<li class='loading_notification'><i class='la la-refresh la-spin'></i>&nbsp;&nbsp;&nbsp;Loading...</li>");
                    $rootScope.getNotificationData(notification);
                }

                if (!$(".slide_notification").hasClass("active")) {
                    $(".slide_notification").addClass("active");
                    $(".slide_notification_wrapper").fadeIn(200);
                }
            }

            $rootScope.hideNotification = function() {
                $(".slide_notification_icon.active").removeClass("active");
                $(".slide_notification_main ul").html("");
                $(".slide_notification").removeClass("active");
                $(".slide_notification_wrapper").fadeOut(200);
            }

            // Get notification data
            $rootScope.getNotificationData = function(notification) {

                notification = typeof notification != 'undefined' ? notification : "all";
                $http({
                    url: serverUrl + "/public/common/web/getNotificationData/" + notification,
                    method: "post",
                }).then(function(response) {
                    $(".slide_notification_main ul").html("");

                    var data = response.data;
                    if (data.length) {
                        $.each(data, function(i, val) {
                            var li = $("<li />").attr('ng-click', 'hideNotification()');
                            if (notification == "all") {
                                li.html("<a href='#/" + val.module + "/view/" + val.id + "'>New <span class='first_capital'>" + val.module.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/(?:^|\s)\S/g, function(a) {
                                    return a.toUpperCase();
                                }) + "</span> #" + val.id + " from <span class='bold themed-color-fancy'>" + val.name + "</span></a>");
                            } else if (notification == "device") {
                                li.html("<a href='#/" + (val.user_group == 'account' ? "account" : "user") + "/view/" + val.id + "'>New Device Registration request from <span class='bold themed-color-autumn'>" + val.name + "</a>");
                            } else if (notification == "message") {
                                li.html("<a href='#/message?&contactId=" + val.sender_id + "'>New Message from <span class='bold themed-color-amethyst'>" + val.sender_name + "</a>");
                            }

                            $compile(li)($rootScope);
                            $(".slide_notification_main ul").append(li);
                        });
                    } else {
                        var li = $("<li />").addClass("no_notification");
                        if (notification == "all") {
                            li.html("No New Notification.");
                        } else if (notification == "device") {
                            li.html("No New Devices.");
                        } else if (notification == "message") {
                            li.html("No New Messages.");
                        }

                        $(".slide_notification_main ul").append(li);
                    }
                });
            }

            var audio = new Audio(appUrl + '/assets/audio/demonstrative.mp3');
            $rootScope.activity = [];

            // Get notification 
            $rootScope.getNotification = function() {

                $http({
                    url: serverUrl + '/public/common/web/getNotification',
                    method: "post",
                    spinner: false,
                }).then(function(response) {
                    // all count
                    if (response.data.all > 0) {
                        $('#allCount').show();
                        $("#all_notification .badge").show();
                        $('#allCount').html(response.data.all);
                        $("#all_notification .badge").html(response.data.all);
                    } else {
                        $("#all_notification .badge").hide();
                        $('#allCount').hide();
                    }

                    // Order
                    if (response.data.order > 0) {
                        $('#orderCountMenu').html('(' + response.data.order + ')').show();
                    } else {
                        $('#orderCountMenu').html("(0)").hide();
                    }

                    // Payment Collection
                    if (response.data.payment_collection > 0) {
                        $('#paymentCountMenu').html('(' + response.data.payment_collection + ')').show();
                    } else {
                        $('#paymentCountMenu').html("(0)").hide();
                    }

                    // Expense                    
                    if (response.data.expense > 0) {
                        $('#expenseCountMenu').html('(' + response.data.expense + ')').show();
                    } else {
                        $('#expenseCountMenu').html("(0)").hide();
                    }

                    // Deal
                    if (response.data.deal > 0) {
                        $('#dealCountMenu').html('(' + response.data.deal + ')').show();
                    } else {
                        $('#dealCountMenu').html("(0)").hide();
                    }

                    // Message
                    if (response.data.message > 0) {
                        $('#message').show();
                        $('#messageCount').parent('.notify_icon').show();
                        $("#message_notification .badge").show();
                        $('#messageCount').html(response.data.message);
                        $('#messageCountMenu').html('(' + response.data.message + ')').show();
                        $("#message_notification .badge").html(response.data.message);
                    } else {
                        $("#message_notification .badge").hide();
                        $('#messageCount').parent('.notify_icon').hide();
                        $('#messageCountMenu').html("0").hide();
                    }

                    // Device
                    if (response.data.device > 0) {
                        $('#deviceCount').parent('.notify_icon').show();
                        $("#device_notification .badge").show();
                        $('#deviceCount').html(response.data.device);
                        $("#device_notification .badge").html(response.data.device);
                    } else {
                        $("#device_notification .badge").hide();
                        $('#deviceCount').parent('.notify_icon').hide();
                    }

                    // Activity Reminder
                    if (response.data.activity) {
                        $.each(response.data.activity, function(i, val) {
                            setTimeout(function() {
                                $rootScope.makeActivityView(val);
                            }, 300 * i);
                        });
                    }
                });
            }

            $rootScope.changeStatus = function(id) {
                $("#activity_" + id).css("background", "#f5f5f5");
                $("#activityCheck_" + id).prop("disabled", true);

                $http({
                    url: serverUrl + "/public/common/web/changeActivityStatus",
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    spinner: false,
                    data: {
                        id: id,
                        status: 1,
                        filter: ''
                    },
                }).then(function(response) {
                    $(".activity_reminder ul #activity_" + id).remove();
                });
            };

            $rootScope.editActivity = function($event, activity) {
                if (!$($event.target).hasClass("module_link")) {
                    var data = {
                        data: activity
                    };
                    $activityService.addActivity(data);
                }
            };

            $rootScope.closeReminder = function(id) {
                $(".activity_reminder ul #activity_" + id).remove();
            }

            $rootScope.makeActivityView = function(data, isEdit) {
                // play sounds
                audio.pause();
                audio.currentTime = 0;
                audio.play();

                var html = $("<li />").addClass("activityBox").addClass("reminder").attr("id", 'activity_' + data.id);

                var icon = $activityService.getIcon(data.activity_type);
                html.append("<div class='activityIcon'><i class='la la-" + icon + "'></i></div>");

                var due_date = "";
                let date = $rootScope.convertToLocalTime(data.due_date + " " + data.due_date_time, 'DD-MM-YYYY hh:mm A', 'DD-MM-YYYY hh:mm A');
                due_date = "<small class='text-muted'><span>" + date + "</span>&nbsp;&nbsp;</small>";

                var module_link = "";
                if (data.module) {
                    var module_icon = $activityService.getIcon(data.module);
                    //data.module = data.module.replace(/_([a-z])/g, function (g) { return g[1].toUpperCase(); });
                    data.module_link_name = data.module.replace(/_([a-z])/g, function(g) {
                        return g[1].toUpperCase();
                    });
                    module_link = data.module_name ? "<small class='text-muted'>|&nbsp;&nbsp;<a href='#/" + data.module_link_name + "/view/" + data.module_id + "' class='module_link'><i class='la la-" + module_icon + "'></i>&nbsp;" + data.module_name + "</a></small>" : "";
                }

                var reference_link = "";
                if (data.reference) {
                    var reference_icon = $activityService.getIcon(data.reference);
                    reference_link = data.reference_name ? "<small class='text-muted'>|&nbsp;&nbsp;<a href='#/" + data.reference + "/view/" + data.reference_id + "' class='module_link'><i class='la la-" + reference_icon + "'></i>&nbsp;" + data.reference_name + "</a></small>" : ""
                }
                html.append("<div class='activityText' ng-click='editActivity($event," + JSON.stringify(data) + ")'>\n\
                                <p>" + data.activity + "</p>\n\
                                " + due_date + "\n\
                                " + module_link + "\n\
                                " + reference_link + "\n\
                            </div>");


                html.append("<div class='activityCheck'>\n\
                                <input type='checkbox' id='activityCheck_" + data.id + "' ng-checked='" + (data.done_status ? 'true' : 'false') + "' ng-click='changeStatus(" + data.id + ",1)' />\n\
                                <label for='activityCheck_" + data.id + "'></label>\n\
                                <div class='activityAction text-muted'>\n\
                                    <i class='la la-times' ng-click='closeReminder(" + data.id + ")'></i>\n\
                                </div>\n\
                             </div>");

                html.append("<div class='clearfix'></div>");

                $compile(html)($rootScope);

                $(".activity_reminder ul").prepend(html);

                html.addClass("visible");

            }

            $rootScope.clearing = false;
            $rootScope.getNotification();

            setInterval(function() {
                if (!$rootScope.clearing) {
                    $rootScope.getNotification();
                }
            }, 40000);


            /*$rootScope.formChanges = function (somethingChanged, toState, toParams, fromState, fromParams) {
                var data = {somethingChanged: somethingChanged, nextUrl: toState, currentUrl: fromState, nextUrlParams: toParams, currentUrlParams: fromParams};
                $rootScope.modalInstance = $modal.open({
                    template: '<div class="modal-header">' +
                            '<h3 class="modal-title">Leave this page</h3>' +
                            '</div>' +
                            '<div class="modal-body">If you leave before saving, your changes will be lost. Are you sure you want to leave this page?' +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button class="btn" ng-click="leavePage(data)">Leave</button>' +
                            '<button class="btn btn-important" ng-click="stayOnThisPage(data)">Stay</button>' +
                            '</div>',
                    scope: $rootScope,
                    backdrop: 'static',
                    controller: function ($rootScope, data, $modalInstance) {
                        $rootScope.data = data;
                    },
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
                return false;
            }

            $rootScope.leavePage = function (data) {
                $rootScope.somethingChanged = false;
                $rootScope.modalInstance.dismiss('cancel');
                str = data.nextUrl.url;
                url = data.nextUrlParams.id ? str.replace(":id", data.nextUrlParams.id) : str;
                window.location.href = baseUrl + '/application/#' + url;
            }

            $rootScope.stayOnThisPage = function (data) {
                $rootScope.somethingChanged = true;
                $rootScope.modalInstance.dismiss('cancel');
                str = data.currentUrl.url;
                url = data.currentUrlParams.id ? str.replace(":id", data.currentUrlParams.id) : str;
                window.location.href = baseUrl + '/application/#' + url;
            }*/

            // Get Modal Template
            $rootScope.deactivate = function(table, url, val) {
                if (typeof val == 'undefined') {
                    if ($(".tdCheckbox:checked").length) {
                        $rootScope.deactivateVal = $(".tdCheckbox").serializeArray();
                    } else {
                        $rootScope.modalInstance = $modal.open({
                            template: '<div class="modal-header">' +
                                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="deactivateCancel()" >×</button>' +
                                '<h3 class="modal-title">' + sprintf(messages.not_selected_heading, table) + '</h3>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                sprintf(messages.not_selected_description, table, table) +
                                '</div>' +
                                '<div class="modal-footer">' +
                                '<button class="btn btn-important" ng-click="deactivateCancel()">OK</button>' +
                                '</div>',
                            scope: $rootScope
                        });
                        return false;
                    }
                } else {
                    $rootScope.deactivateVal = val;
                }

                $rootScope.modalInstance = $modal.open({
                    template: '<div class="modal-header">' +
                        '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="deactivateCancel()" >×</button>' +
                        '<h3 class="modal-title">' + messages.are_you_sure_heading + '</h3>' +
                        '</div>' +
                        '<div class="modal-body">' +
                        sprintf(messages.are_you_sure_description, table) +
                        '</div>' +
                        '<div class="modal-footer">' +
                        '<button class="btn btn-important" ng-click="deactivateConfirm(\'' + url + '\',\'' + table + '\')">Yes</button>' +
                        '<button class="btn" ng-click="deactivateCancel()">No</button>' +
                        '</div>',
                    scope: $rootScope
                });
            }

            if ($cookies.get("new_signup")) {
                $rootScope.$helpModal = $modal.open({
                    templateUrl: "template/help.html",
                    size: "lg"
                });
                //                var helpData = [
                //                    {link:"https://www.youtube.com/embed/8_BNqu9UCOw", title:"Short Intro to KOOPS", type:"video"},
                //                    {link:"https://www.youtube.com/embed/G-YkAlfAU9Y", title:"How to use Customer module in KOOPS?", type:"video"},
                //                    {link:"https://www.youtube.com/embed/6xUsSAS9eUM", title:"How to use Product Module?", type:"video"},
                //                    {link:"https://www.youtube.com/embed/_X7iQLjwW18", title:"How to Import Customers to KOOPS?", type:"video"},
                //                ];
                //                $helpService.showHelp(helpData);
                //                $cookies.remove('new_signup', {path: cookiePath});

                $rootScope.closeHelp = function() {
                    $rootScope.$helpModal.dismiss('cancel');
                }

                $cookies.remove('new_signup', {
                    path: cookiePath,
                    domain: cookieDomain
                });
            }

            $rootScope.deactivateCancel = function() {
                $rootScope.modalInstance.dismiss('cancel');
            }

            $rootScope.deactivateConfirm = function(url, table) {
                const data = {
                    data: $rootScope.deactivateVal,
                    table: table
                };
                if (['mail_template', 'whatsapp_template', 'sms_template'].indexOf(table) > -1) {
                    data['customer_id'] = $rootScope.USERCONST._kscustomerid;
                }
                $rootScope.modalInstance.close();
                $http({
                    url: url,
                    method: "post",
                    data: data,
                }).then(function(response) {
                    $sticky.success(response.data.hasOwnProperty("success_description") ? response.data.success_description : sprintf(messages.deactivated, table));
                    $rootScope.$broadcast('getTable');
                }, function(rejection) {
                    $sticky.error(rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error);
                });
            }

            $rootScope.export = function(module, _data) {
                const ls_datatable_filter = localStorage.getItem('datatable_filter') !== null ? JSON.parse(localStorage.getItem('datatable_filter')) : {};

                var data = {
                    search: angular.extend($location.search(), ls_datatable_filter)
                }

                if (data.search.hasOwnProperty("rows_per_page") && data.search.rows_per_page) {
                    data.rows_per_page = data.search.rows_per_page;
                    data.page = data.search.page;
                }

                if (_data != undefined) {
                    data = angular.extend(data, _data);
                }

                if (module == 'redeemCoupon' || module == 'claimHistory') {
                    var url = serverUrl + "/public/common/web/396482/export/" + module;
                } else {
                    var url = serverUrl + "/public/common/web/" + ((module == 'account' || module == 'product') ? module + "/export" : "export/" + module);
                }

                $http({
                    url: url,
                    method: "post",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data,
                }).then(function(response) {
                    $sticky.success(response.data.hasOwnProperty('success_description') ? response.data.success_description : sprintf(messages.demo_downloaded, modalData.bit));
                    if (response.data.hasOwnProperty("redirect") && response.data.redirect) {
                        $rootScope.downloadFile(response.data.redirect.file);
                    }
                }, function(rejection) {
                    $sticky.error(rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error);
                });
            }

            $rootScope.import = function(module, data) {
                $importService.addImport(module, data);
            }

            $rootScope.generateActivity = function(linkTo) {
                $activityService.addActivity(linkTo);
            }

            $rootScope.generateRandomString = function(length) {
                var result = '';
                var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
                var charactersLength = characters.length;
                for (var i = 0; i < length; i++) {
                    result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
                return result;
            }

            $rootScope.showContact = function() {
                $rootScope.$modalInstance = $modal.open({
                    templateUrl: "template/contact.html",
                });
            }

            $rootScope.gotIt = function() {
                $rootScope.$modalInstance.dismiss('cancel');
            }

            $rootScope.showShortcut = function() {
                $rootScope.$modalInstance = $modal.open({
                    templateUrl: "template/shortcut.html",
                });
            }

            $rootScope.globalBack = function() {

                //var lastPopup = $popup.getLast();
                var lastPopup = $rootScope.modalInstance || $popup.getLast();
                if (lastPopup) {
                    if ($rootScope.modalInstance) {
                        $rootScope.modalInstance.dismiss();
                        delete $rootScope.modalInstance;
                    }
                    $popup.close(lastPopup);

                } else {
                    window.history.back();
                }
            }

            $rootScope.downloadFile = function(file, isDelete) {
                var data = "";
                data += '?access_token=' + $rootScope.LOGINCONST._ksat;
                data += '&username=' + $rootScope.USERCONST._ksemail;
                data += '&global_user_id=' + $rootScope.USERCONST._ksglobaluserid;
                data += '&request_from=' + request_from;
                data += '&app_version=' + app_version;
                data += "&is_delete=" + (isDelete ? isDelete : "1");
                var url = serverUrl + "/public/common/web/downloadFile/" + file + data;

                window.location.href = url;
            }

            $rootScope.getCurrentDate = function() {
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1; //January is 0!

                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd
                }
                if (mm < 10) {
                    mm = '0' + mm
                }
                var today = dd + '-' + mm + '-' + yyyy;
                return today;
            }


            $rootScope.getDate = function(date) {
                var date = new Date(date);

                var dd = date.getDate();
                var mm = date.getMonth() + 1; //January is 0!
                var yyyy = date.getFullYear();

                if (dd < 10) {
                    dd = '0' + dd
                }
                if (mm < 10) {
                    mm = '0' + mm
                }

                var date = dd + '-' + mm + '-' + yyyy;
                return date;
            }

            $rootScope.getCurrentTime = function() {
                var today = new Date();
                var hours = today.getHours();
                var minutes = Math.ceil(today.getMinutes() / 5) * 5;
                if (minutes >= 60) {
                    hours += 1;
                    minutes = 0;
                }
                var maridian = hours < 12 ? "AM" : "PM";
                hours = hours > 12 ? hours - 12 : hours;
                hours = ('0' + hours).slice(-2);
                minutes = ('0' + minutes).slice(-2);
                var time = (hours == 00 ? 12 : hours) + ":" + minutes + " " + maridian;
                return time;
            }

            $rootScope.shortFun = function(dir) {
                var ele;
                if ($('[my' + dir + ']').length > 1) {
                    if ($('.modal [my' + dir + ']').length > 0) {
                        ele = $('.modal [my' + dir + ']');
                    } else {
                        ele = $('[my' + dir + '][priority="high"]');
                    }
                } else {
                    ele = $('[my' + dir + ']');
                }
                if (ele.attr('href')) {
                    window.location = ele.attr('href');
                } else {
                    $timeout(function() {
                        ele.click();
                    });
                }
            }

            $rootScope.shortNumber = function(num) {
                if (num > 1000) {
                    var n = num / 1000;
                    n = Math.round(n * 10) / 10;
                    n = n + "K";
                } else {
                    var n = Math.round(num * 10) / 10;
                }

                return n;
            }

            $rootScope.customActionListCall = function(action, url, callback) {
                $http({
                    url: serverUrl + "/public/common/" + url,
                    method: "post",
                    data: {
                        data: $(".tdCheckbox").serializeArray()
                    }
                }).then(function(response) {
                    $rootScope.modalInstance = $modal.open({
                        template: '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true" ng-click="deactivateCancel()" >×</button>' +
                            '<h3 class="modal-title">Response</h3>' +
                            '</div>' +
                            '<div class="modal-body">' +
                            response.data.html +
                            '</div>' +
                            '<div class="modal-footer">' +
                            '<button class="btn btn-important" ng-click="deactivateCancel()">Ok</button>' +
                            '</div>',
                        scope: $rootScope
                    });
                    if (callback) {
                        callback();
                    }
                }, function(rejection) {
                    $sticky.error(rejection.data.hasOwnProperty("error_description") ? rejection.data.error_description : messages.some_error);
                });
            };

            // define shortcuts
            hotkeys.add({
                combo: 'alt+a',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('add');
                }
            });
            hotkeys.add({
                combo: 'alt+e',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function(e) {
                    e.preventDefault();
                    $rootScope.shortFun('edit');
                }
            });
            hotkeys.add({
                combo: 'alt+r',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('refresh');
                }
            });
            hotkeys.add({
                combo: 'alt+s',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('save');
                }
            });
            hotkeys.add({
                combo: 'alt+p',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('print');
                }
            });
            hotkeys.add({
                combo: 'alt+b',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('back');
                }
            });
            hotkeys.add({
                combo: 'alt+n',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('savenew');
                }
            });
            hotkeys.add({
                combo: 'alt+i',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('import');
                }
            });
            hotkeys.add({
                combo: 'alt+x',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('export');
                }
            });
            hotkeys.add({
                combo: 'alt+enter',
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: function() {
                    $rootScope.shortFun('send');
                }
            });
        });

        app.filter('min_to_readable', function() {
            return function(val) {
                if (val !== null) {

                    var hours = Math.floor(val / 60);

                    var min = Math.floor((val % 60) % 60);

                    var str = "";

                    if (hours) {
                        str += " " + hours + "hr";
                    }

                    if (min) {
                        str += " " + min + "min";
                    }

                    str = str.trim() ? str.trim() : "0min";

                    return str;
                } else {
                    return "-";
                }
            };
        });

        app.filter('sec_to_readable', function() {
            return function(val) {
                if (val !== null) {

                    var hours = Math.floor(val / 3600);

                    var min = Math.floor((val % 3600) / 60);

                    var sec = Math.floor((val % 3600) % 60);

                    var str = "";

                    if (hours) {
                        str += " " + hours + "hr";
                    }

                    if (min) {
                        str += " " + min + "min";
                    }

                    if (sec) {
                        str += " " + sec + "sec";
                    }

                    str = str.trim() ? str.trim() : "0sec";

                    return str;
                } else {
                    return "-";
                }
            };
        });

        app.filter('unsafe', function($sce) {
            return $sce.trustAsHtml;
        });

        // string replace filter
        app.filter('strReplace', function() {
            return function(input, from, to) {
                input = input || '';
                from = from || '';
                to = to || '';
                return input.replace(new RegExp(from, 'g'), to);
            };
        });

        // currency format filter
        app.filter('formatCurrency', function() {
            return function(input, fraction, locale = 'en-US') {
                var parsedInput = parseFloat(input);
                return parsedInput.toLocaleString(locale, {
                    minimumFractionDigits: fraction,
                    maximumFractionDigits: fraction
                });
            };
        });

        var initInjector = angular.injector(['ng']);
        var $http = initInjector.get("$http");
        var $rootScope = initInjector.get("$rootScope");

        setTimeout(function() {
            getAppData();
        }, 1000);

        function getAppData() {
            $http({
                url: serverUrl + '/public/common/web/getAppData',
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    access_token: ck['_ksld']['_ksat'],
                    request_from: request_from,
                    app_version: app_version,
                    username: ck['_ksud']['_ksusername'],
                    global_user_id: ck['_ksud']['_ksglobaluserid'],
                },
            }).then(function(response) {

                if (response.data.hasOwnProperty('user')) {
                    ck['_ksud']['_ksemail'] = response.data.user.email;
                    ck['_ksud']['_ksregisteredno'] = response.data.user.registered_no;
                    ck['_ksud']['_ksusername'] = response.data.user.username;
                    ck['_ksud']['_ksname'] = response.data.user.name;
                    ck['_ksud']['_ksprofilepic'] = response.data.user.thumbnail_url;
                    ck['_ksud']['_ksusergroup'] = response.data.user.user_group;
                    ck['_ksud']['_kscurrency'] = response.data.setting.currency;
                    ck['_ksud']['_kscurrencydecimalcode'] = response.data.setting.currency_decimal_code;
                    ck['_ksud']['_kssupportcontactno'] = response.data.user.support_contact_no ? (response.data.user.support_contact_no.substring(0, 5) + ' ' + response.data.user.support_contact_no.substring(5)) : null;
                    ck['_ksud']['_ksregistercompanyemail'] = response.data.user.register_company_email ? response.data.user.register_company_email : null;
                    let register_company_no = response.data.user.register_company_no;
                    if (register_company_no) {
                        if (register_company_no.length > 10) {
                            register_company_no = register_company_no.replace('+91', '');
                        }
                        register_company_no = (register_company_no.substring(0, 5) + ' ' + register_company_no.substring(5))
                    }
                    ck['_ksud']['_ksregistercompanyno'] = register_company_no;
                }

                app.constant('USERCONST', ck['_ksud']);
                app.constant('LOGINCONST', ck['_ksld']);
                app.constant('USERRIGHT', response.data.right);
                app.constant('USERSOFTWARE', response.data.software);
                app.constant('SUBEND', response.data.sub_end_date);
                app.constant('GOOGLEAPIKEY', response.data.google_api_key);
                app.constant('ADVANCEFEATURE', response.data.advance_feature);
                app.constant('ISCUSTOM', response.data.is_custom);
                app.constant('UNIT', response.data.unit);
                app.constant('SETTING', response.data.setting);

                _right = response.data.right;
                _software = response.data.software;
                _const = ck['_ksud'];

                _formData = response.data.hasOwnProperty("form") ? response.data.form : [];

                angularAMD.bootstrap(app);
            }, function(reject) {
                if (reject.status != -1) {
                    if (reject.status == 503) {
                        localStorage.setItem("heading", reject.data.heading);
                        localStorage.setItem("description", reject.data.description);
                        localStorage.setItem("link", (reject.data.link != undefined ? reject.data.link : ""));
                        document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                        document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                        window.location.href = "../error_page/503.html";
                    } else if (reject.status == 505) {
                        localStorage.setItem("heading", reject.data.heading);
                        localStorage.setItem("description", reject.data.description);
                        localStorage.setItem("can_extend", (reject.data.can_extend != undefined ? reject.data.can_extend : 1));
                        //                        document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        //                        document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        window.location.href = "../error_page/505.html";
                    } else if (reject.status == 401) {
                        reLogin();
                    } else if (reject.status == 403) {
                        if (reject.data.error == 'access_forbidden') {
                            document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                            document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                            window.location.href = "../error_page/401.html";
                        } else if (reject.data.error == 'unregistered_user' || reject.data.error == 'inactive_user') {
                            document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                            document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                            window.location.href = baseUrl;
                        } else {
                            document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                            document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                            window.location.href = baseUrl;
                        }
                    } else {
                        document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                        document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                        window.location.href = baseUrl;
                    }
                } else {
                    getAppData();
                }
            });
        }

        function reLogin() {
            $http({
                url: serverUrl + '/public/common/loginWithRefreshToken',
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: {
                    grant_type: 'refresh_token',
                    client_id: '1',
                    client_secret: '123456',
                    username: ck['_ksud']['_ksemail'],
                    global_user_id: ck['_ksud']['_ksglobaluserid'],
                    refresh_token: ck['_ksld']['_ksrt'],
                    request_from: request_from,
                    app_version: app_version
                },
            }).then(function(response) {

                var cookieObj = makeCookieObject(response.data);

                ck['_ksld'] = cookieObj._ksld;
                ck['_ksud'] = cookieObj._ksud;

                document.cookie = '_ksld=' + escape(JSON.stringify(ck['_ksld'])) + '; path=' + cookiePath + '; domain=' + cookieDomain + ';';
                document.cookie = '_ksud=' + escape(JSON.stringify(ck['_ksud'])) + '; path=' + cookiePath + '; domain=' + cookieDomain + ';';

                getAppData();
            }, function(reject) {
                if (reject.status != -1) {
                    if (reject.status == 503) {
                        localStorage.setItem("heading", reject.data.heading);
                        localStorage.setItem("description", reject.data.description);
                        localStorage.setItem("link", (reject.data.link != undefined ? reject.data.link : ""));
                        document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                        document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                        document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        window.location.href = "../error_page/503.html";
                    } else if (reject.status == 505) {
                        localStorage.setItem("heading", reject.data.heading);
                        localStorage.setItem("description", reject.data.description);
                        localStorage.setItem("can_extend", (reject.data.link != undefined ? reject.data.can_extend : ""));
                        //                        document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        //                        document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        window.location.href = "../error_page/505.html";
                    } else {
                        document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                        document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT; domain=' + cookieDomain + ';';
                        document.cookie = '_ksld=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        document.cookie = '_ksud=; path=' + cookiePath + ';expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                        window.location.href = baseUrl;
                    }
                } else {
                    reLogin();
                }
            });
        }
    });
} else {
    window.location.href = baseUrl;
}