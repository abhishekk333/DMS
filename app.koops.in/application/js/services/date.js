/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD'], function(angularAMD) {

    // date app
    var date = angular.module("date", []);

    // service for auth
    date.factory('$date', function($q, $http, $rootScope) {

        return {
            getDate: function(format, s) {
                var t = new Date();

                if (typeof s != 'undefined') {
                    s = s.split(' ');
                    var v = parseInt(s[0]);
                    var e = s[1];

                    if (e == 'days') {
                        t.setDate(t.getDate() + v);
                    } else if (e == 'month') {
                        console.log("not working");
                    } else if (e == 'year') {
                        console.log("not working");
                    }
                }

                if (format) {
                    t = date_format(format, t);
                }
                return t;
            },
            getRange: function(format, s) {
                var t = new Date();
                var f, l;

                if (s == 'today') {
                    f = new Date();
                    l = new Date();
                } else if (s == 'current_month') {
                    f = new Date(t.getFullYear(), t.getMonth(), 1);
                    l = new Date(t.getFullYear(), t.getMonth() + 1, 0);
                } else if (s == 'current_quarter') {
                    var m = t.getMonth();
                    if (m < 3) {
                        f = new Date(t.getFullYear(), 0, 1);
                        l = new Date(t.getFullYear(), 3, 0);
                    } else if (m < 6) {
                        f = new Date(t.getFullYear(), 3, 1);
                        l = new Date(t.getFullYear(), 6, 0);
                    } else if (m < 9) {
                        f = new Date(t.getFullYear(), 6, 1);
                        l = new Date(t.getFullYear(), 9, 0);
                    } else if (m < 12) {
                        f = new Date(t.getFullYear(), 9, 1);
                        l = new Date(t.getFullYear(), 12, 0);
                    }
                } else if (s == 'current_year') {
                    f = new Date(t.getFullYear(), 0, 1);
                    l = new Date(t.getFullYear(), 12, 0);
                } else if (s == 'previous_month') {
                    f = new Date(t.getFullYear(), t.getMonth() - 1, 1);
                    l = new Date(t.getFullYear(), t.getMonth(), 0);
                } else if (s == 'previous_quarter') {
                    var m = t.getMonth();
                    if (m < 3) {
                        f = new Date(t.getFullYear() - 1, 9, 1);
                        l = new Date(t.getFullYear() - 1, 12, 0);
                    } else if (m < 6) {
                        f = new Date(t.getFullYear(), 0, 1);
                        l = new Date(t.getFullYear(), 3, 0);
                    } else if (m < 9) {
                        f = new Date(t.getFullYear(), 3, 1);
                        l = new Date(t.getFullYear(), 6, 0);
                    } else if (m < 12) {
                        f = new Date(t.getFullYear(), 6, 1);
                        l = new Date(t.getFullYear(), 9, 0);
                    }
                } else if (s == 'next_year') {
                    f = new Date(t.getFullYear() + 1, 0, 1);
                    l = new Date(t.getFullYear() + 1, 12, 0);
                } else if (s == 'next_month') {
                    f = new Date(t.getFullYear(), t.getMonth() + 1, 1);
                    l = new Date(t.getFullYear(), t.getMonth() + 2, 0);
                } else if (s == 'next_quarter') {
                    var m = t.getMonth();
                    if (m < 3) {
                        f = new Date(t.getFullYear(), 3, 1);
                        l = new Date(t.getFullYear(), 6, 0);
                    } else if (m < 6) {
                        f = new Date(t.getFullYear(), 6, 1);
                        l = new Date(t.getFullYear(), 9, 0);

                    } else if (m < 9) {
                        f = new Date(t.getFullYear(), 9, 1);
                        l = new Date(t.getFullYear(), 12, 0);
                    } else if (m < 12) {
                        f = new Date(t.getFullYear() + 1, 0, 1);
                        l = new Date(t.getFullYear() + 1, 3, 0);
                    }
                } else if (s == 'previous_year') {
                    f = new Date(t.getFullYear() - 1, 0, 1);
                    l = new Date(t.getFullYear() - 1, 12, 0);
                } else {
                    f = new Date();
                    l = new Date();

                    _s = s.split('_');
                    var v = parseInt(_s[1]);
                    if (_s[0] == 'last') {
                        v = 0 - v;
                    }
                    f.setDate(f.getDate() + v);
                }

                if (typeof format != 'undefined') {
                    f = date_format(format, f);
                    l = date_format(format, l);
                }

                return [f, l];

            },
        };
    });
});

function date_format(format, date) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!
    var yyyy = date.getFullYear();
    var MM = months[date.getMonth()];

    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }

    var return_date = format;
    return_date = return_date.replace('dd', dd);
    return_date = return_date.replace('mm', mm);
    return_date = return_date.replace('MM', MM);
    return_date = return_date.replace('yyyy', yyyy);
    return return_date;
}