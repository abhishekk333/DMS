/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
define(['angularAMD', 'require'], function(angularAMD, require) {

    // Breadcrumb App
    var searchMenu = angular.module("searchMenu", []);

    searchMenu.directive('searchMenu', function($compile, $parse, $rootScope, $modal) {
        return {
            restrict: "A",
            link: function(scope, element, attr) {
                $rootScope.recentSearch = [];

                scope.openSearch = function() {
                    scope.searchModalInstance = $modal.open({
                        templateUrl: "template/searchMenu.html",
                        controller: "searchMenuController",
                        scope: scope,
                    });
                }

                element.click(function(e) {
                    scope.openSearch();
                });

                $(document).keydown(function(e) {
                    if (e.altKey && e.keyCode == 70) {
                        e.preventDefault();
                        if (!$(".searchMenuModal").length) {
                            scope.openSearch();
                        }
                    }
                });
            }
        };
    });

    searchMenu.controller("searchMenuController", function($scope, $controller, $http, $modalInstance, $sticky, $rootScope, $timeout, $compile) {

        // Search Menu Data
        $scope.searchMenuData = [{
                url: 'activity',
                display: 'Activity',
                group: 'My Activity',
                software: [],
                right: ['manage_activity']
            },

            {
                url: 'news',
                display: 'News',
                group: "News",
                software: [],
                right: ['manage_news']
            },
            {
                url: 'news/create',
                display: 'Add News',
                group: "News",
                software: [],
                right: ['manage_news']
            },

            {
                url: 'message',
                display: 'Message',
                group: "Message",
                software: [],
                right: ['send_message']
            },

            {
                url: 'product',
                display: 'Product',
                group: "Catalog",
                software: [],
                right: ['read_product']
            },
            {
                url: 'product/create',
                display: 'Add Product',
                group: "Catalog",
                software: [],
                right: ['add_product']
            },

            {
                url: 'priceGroup',
                display: 'Price Group',
                group: "Catalog",
                software: [],
                right: ['manage_price_group']
            },
            {
                url: 'priceGroup/create',
                display: 'Add Price Group',
                group: "Catalog",
                software: [],
                right: ['manage_price_group']
            },

            {
                url: 'productCategory',
                display: 'Category',
                group: "Catalog",
                software: [],
                right: ['manage_product_category']
            },
            {
                url: 'productCategory/create',
                display: 'Add Category',
                group: "Catalog",
                software: [],
                right: ['manage_product_category']
            },

            {
                url: 'productUnit',
                display: 'Unit',
                group: "Catalog",
                software: [],
                right: ['manage_product_unit']
            },
            {
                url: 'productUnit/create',
                display: 'Add Unit',
                group: "Catalog",
                software: [],
                right: ['manage_product_unit']
            },

            {
                url: 'priority',
                display: 'Priority',
                group: "Catalog",
                software: [],
                right: ['manage_priority']
            },

            {
                url: 'account',
                display: $rootScope.customer_module_name,
                group: $rootScope.customer_module_name,
                software: [],
                right: ['read_account']
            },
            {
                url: 'account/create',
                display: 'Add ' + $rootScope.customer_module_name,
                group: "Account",
                software: [],
                right: ['add_account']
            },

            {
                url: 'quotation',
                display: 'Sales Quotation',
                group: "Sales Quotation",
                software: [],
                right: ['read_sale_quotation']
            },
            {
                url: 'quotation/create',
                display: 'Add Sales Quotation',
                group: "Sales Quotation",
                software: [],
                right: ['add_sale_quotation']
            },

            {
                url: 'estimate',
                display: 'Estimate',
                group: "Estimate",
                software: [],
                right: ['read_estimate']
            },
            {
                url: 'estimate/create',
                display: 'Add Estimate',
                group: "Estimate",
                software: [],
                right: ['add_estimate']
            },

            {
                url: 'order',
                display: 'Order',
                group: "Order",
                software: [],
                right: ['read_order']
            },
            {
                url: 'order/create',
                display: 'Add Order',
                group: "Order",
                software: [],
                right: ['add_order']
            },

            {
                url: 'salesReturn',
                display: 'Sales Return',
                group: "Sales Return",
                software: [],
                right: ['read_sales_return']
            },
            {
                url: 'salesReturn/create',
                display: 'Add Sales Return',
                group: "Sales Return",
                software: [],
                right: ['add_sales_return']
            },

            {
                url: 'dispatch',
                display: 'Dispatch',
                group: "Dispatch",
                software: [],
                right: ['manage_multiorder_dispatch']
            },
            {
                url: 'dispatch/create',
                display: 'Add Dispatch',
                group: "Dispatch",
                software: [],
                right: ['add_order_delivery']
            },

            {
                url: 'invoice',
                display: 'Invoice',
                group: "Invoice",
                software: [],
                right: ['read_invoice']
            },
            {
                url: 'invoice/create',
                display: 'Add Invoice',
                group: "Invoice",
                software: [],
                right: ['add_invoice']
            },

            {
                url: 'paymentCollection',
                display: 'Payment',
                group: "Payment",
                software: [],
                right: ['read_payment_collection']
            },
            {
                url: 'paymentCollection/create',
                display: 'Add Payment',
                group: "Payment",
                software: [],
                right: ['add_payment_collection']
            },

            {
                url: 'expense',
                display: 'Expense',
                group: "Expense",
                software: [],
                right: ['read_expense']
            },
            {
                url: 'expense/create',
                display: 'Add Expense',
                group: "Expense",
                software: [],
                right: ['add_expense']
            },

            {
                url: 'purchaseOrder',
                display: 'Purchase Order',
                group: "Purchase Order",
                software: ['kims'],
                right: ['read_purchase_order']
            },
            {
                url: 'purchaseOrder/create',
                display: 'Add Purchase Order',
                group: "Purchase Order",
                software: ['kims'],
                right: ['add_purchase_order']
            },

            {
                url: 'job',
                display: 'Job',
                group: "Job",
                software: ['kims'],
                right: ['manage_job']
            },
            {
                url: 'job/create',
                display: 'Add Job',
                group: "Job",
                software: ['kims'],
                right: ['manage_job']
            },

            {
                url: 'complaint',
                display: 'Complaint',
                group: "Complaint",
                software: [],
                right: ['read_complaint']
            },
            {
                url: 'complaint/create',
                display: 'Add complaint',
                group: "Complaint",
                software: [],
                right: ['add_complaint']
            },

            {
                url: 'production',
                display: 'Production',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_production']
            },
            {
                url: 'production/create',
                display: 'Add Production',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_production']
            },

            {
                url: 'grn',
                display: 'Grn',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_grn']
            },
            {
                url: 'grn/create',
                display: 'Add Grn',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_grn']
            },

            {
                url: 'goodsIn',
                display: 'Goods In',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_goods_in']
            },
            {
                url: 'goodsIn/create',
                display: 'Add Goods In',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_goods_in']
            },

            {
                url: 'goodsOut',
                display: 'Goods Out',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_goods_out']
            },
            {
                url: 'goodsOut/create',
                display: 'Add Goods Out',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_goods_out']
            },

            {
                url: 'deliveryReceipt',
                display: 'Delivery Receipt',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_delivery_receipt']
            },
            {
                url: 'deliveryReceipt/create',
                display: 'Add Delivery Receipt',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_delivery_receipt']
            },

            {
                url: 'warehouseTransfer',
                display: 'Warehouse Transfer',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_warehouse_transfer']
            },
            {
                url: 'warehouseTransfer/create',
                display: 'Add Warehouse Transfer',
                group: "Inventory",
                software: ['kims'],
                right: ['manage_warehouse_transfer']
            },

            {
                url: 'stockOnHandReport',
                display: 'Stock On Hand Report',
                group: "Inventory",
                software: ['kims'],
                right: ['stock_on_hand_report']
            },

            {
                url: 'productionReport',
                display: 'Production Report',
                group: "Inventory",
                software: ['kims'],
                right: ['production_report']
            },

            {
                url: 'productTransactionReport',
                display: 'Product Transaction Report',
                group: "Inventory",
                software: ['kims'],
                right: ['product_transaction_report']
            },

            {
                url: 'jobConsumptionReport',
                display: 'Job Consumption Report',
                group: "Inventory",
                software: ['kims'],
                right: ['job_consumption_report']
            },

            {
                url: 'deal',
                display: 'Deal',
                group: "Deal",
                software: [],
                right: ['read_deal']
            },
            {
                url: 'deal/create',
                display: 'Add Deal',
                group: "Deal",
                software: [],
                right: ['add_deal']
            },

            {
                url: 'lead',
                display: 'Lead',
                group: "lead",
                software: [],
                right: ['read_lead']
            },
            {
                url: 'lead/create',
                display: 'Add Lead',
                group: "lead",
                software: [],
                right: ['add_lead']
            },

            {
                url: 'locationDashboard',
                display: 'Dashboard',
                group: "Location Tracking",
                software: [],
                right: ['visit_locator']
            },
            {
                url: 'currentLocation',
                display: 'Current Location',
                group: "Location Tracking",
                software: [],
                right: ['current_location']
            },
            {
                url: 'userLocation',
                display: 'All Locations',
                group: "Location Tracking",
                software: [],
                right: ['user_location']
            },
            {
                url: 'visitReport',
                display: 'Customer Visits',
                group: "Location Tracking",
                software: [],
                right: ['visit_report']
            },
            {
                url: 'visitLocator',
                display: 'Map Locator',
                group: "Location Tracking",
                software: [],
                right: ['visit_locator']
            },
            {
                url: 'userPerformance',
                display: 'Track Report',
                group: "Location Tracking",
                software: [],
                right: ['user_performance']
            },
            {
                url: 'userAttendance',
                display: 'User Attendance',
                group: "Location Tracking",
                software: [],
                right: ['user_attendance']
            },

            {
                url: 'leave',
                display: 'Leave',
                group: "Location Tracking",
                software: [],
                right: ['manage_leave']
            },
            {
                url: 'leave/create',
                display: 'Add Leave',
                group: "Location Tracking",
                software: [],
                right: ['manage_leave']
            },

            {
                url: 'pendingJobReport',
                display: 'Pending Job Report',
                group: "Pending Job Report",
                software: [],
                right: ['pending_job_report']
            },

            {
                url: 'orderwiseDeliveryReport',
                display: 'Pending Dispatch Orderwise',
                group: "Pending Dispatch",
                software: [],
                right: ['orderwise_delivery_report']
            },
            {
                url: 'productwiseDeliveryReport',
                display: 'Pending Dispatch Productwise',
                group: "Pending Dispatch",
                software: [],
                right: ['productwise_delivery_report']
            },

            {
                url: 'poOrderwiseDeliveryReport',
                display: 'Pending Purchase PO Orderwise',
                group: "Pending Purchase",
                software: [],
                right: ['po_orderwise_delivery_report']
            },
            {
                url: 'poProductwiseDeliveryReport',
                display: 'Pending Purchase PO Productwise',
                group: "Pending Purchase",
                software: [],
                right: ['po_productwise_delivery_report']
            },

            {
                url: 'orderReport',
                display: 'Order',
                group: "Report",
                software: [],
                right: ['order_report']
            },
            {
                url: 'salesReport',
                display: 'Sales',
                group: "Report",
                software: [],
                right: ['sales_report']
            },
            {
                url: 'paymentCollectionReport',
                display: 'Payment Collection',
                group: "Report",
                software: [],
                right: ['payment_collection_report']
            },
            {
                url: 'dealValueReport',
                display: 'Deal value',
                group: "Report",
                software: [],
                right: ['deal_value_report']
            },
            {
                url: 'dealStatusReport',
                display: 'Deal status',
                group: "Report",
                software: [],
                right: ['deal_status_report']
            },
            {
                url: 'estimateReport',
                display: 'Estimate',
                group: "Report",
                software: ['koops', 'kcrm'],
                right: ['estimate_report']
            },
            {
                url: 'salesReturnReport',
                display: 'Sales Return',
                group: "Report",
                software: [],
                right: ['sales_return_report']
            },
            {
                url: 'leadReport',
                display: 'Lead',
                group: "Report",
                software: [],
                right: ['lead_report']
            },
            {
                url: 'deviceReport',
                display: 'Device',
                group: "Report",
                software: [],
                right: ['device_report']
            },
            {
                url: 'activityReport',
                display: 'Daily Activity',
                group: "Report",
                software: [],
                right: ['activity_report']
            },
            {
                url: 'rottenReport',
                display: 'Ageing Report',
                group: "Report",
                software: [],
                right: ['rotten_report']
            },
            {
                url: 'targetReport',
                display: 'Target Report',
                group: "Report",
                software: [],
                right: ['target_report']
            },
            {
                url: 'outstandingReport',
                display: 'Outstanding Report',
                group: "Report",
                software: [],
                right: ['outstanding_report']
            },
            {
                url: 'expenseReport',
                display: 'Expense Report',
                group: "Report",
                software: [],
                right: ['expense_report']
            },
            {
                url: 'productiveVisitReport',
                display: 'Visit',
                group: "Report",
                software: [],
                right: ['productive_visit_report']
            },

            {
                url: 'user',
                display: 'User',
                group: "User",
                software: [],
                right: ['read_user']
            },
            {
                url: 'user/create',
                display: 'Add User',
                group: "User",
                software: [],
                right: ['modify_user']
            },
            {
                url: 'userRole',
                display: 'User Role',
                group: "User Role",
                software: [],
                right: ['read_user_role']
            },
            {
                url: 'userRole/create',
                display: 'Add User Role',
                group: "User Role",
                software: [],
                right: ['add_user_role']
            },

            {
                url: 'worker',
                display: 'Worker',
                group: "Worker",
                software: ['kims'],
                right: ['manage_worker']
            },
            {
                url: 'worker/create',
                display: 'Add Worker',
                group: "Worker",
                software: ['kims'],
                right: ['manage_worker']
            },

            {
                url: 'activityType',
                display: 'Activity Type',
                group: "Settings",
                software: [],
                right: ['manage_activity_type']
            },
            {
                url: 'activityType/create',
                display: 'Add Activity Type',
                group: "Settings",
                software: [],
                right: ['manage_activity_type']
            },

            {
                url: 'area',
                display: 'Area',
                group: "Settings",
                software: [],
                right: ['read_area']
            },
            {
                url: 'area/create',
                display: 'Add Area',
                group: "Settings",
                software: [],
                right: ['add_area']
            },

            {
                url: 'paymentType',
                display: 'Payment Type',
                group: "Settings",
                software: [],
                right: ['manage_payment_type']
            },
            {
                url: 'paymentType/create',
                display: 'Add Payment Type',
                group: "Settings",
                software: [],
                right: ['manage_payment_type']
            },

            {
                url: 'expenseType',
                display: 'Expense Type',
                group: "Settings",
                software: [],
                right: ['manage_expense_type']
            },
            {
                url: 'expenseType/create',
                display: 'Add Expense Type',
                group: "Settings",
                software: [],
                right: ['manage_expense_type']
            },

            {
                url: 'workProfile',
                display: 'Work Profile',
                group: "Settings",
                software: [],
                right: ['manage_work_profile']
            },
            {
                url: 'workProfile/create',
                display: 'Add Work Profile',
                group: "Settings",
                software: [],
                right: ['manage_work_profile']
            },

            {
                url: 'transport',
                display: 'Transport',
                group: "Settings",
                software: [],
                right: ['manage_transport']
            },
            {
                url: 'transport/create',
                display: 'Add Transport',
                group: "Settings",
                software: [],
                right: ['manage_transport']
            },

            {
                url: 'leadStatus',
                display: 'Lead Status',
                group: "Settings",
                software: [],
                right: ['manage_lead_status']
            },
            {
                url: 'leadStatus/create',
                display: 'Add Lead Status',
                group: "Settings",
                software: [],
                right: ['manage_lead_status']
            },

            {
                url: 'leadSource',
                display: 'Lead Source',
                group: "Settings",
                software: [],
                right: ['manage_lead_source']
            },
            {
                url: 'leadSource/create',
                display: 'Add Lead Source',
                group: "Settings",
                software: [],
                right: ['manage_lead_source']
            },

            {
                url: 'leadIndustry',
                display: 'Lead Industry',
                group: "Settings",
                software: [],
                right: ['manage_lead_industry']
            },
            {
                url: 'leadIndustry/create',
                display: 'Add Lead Industry',
                group: "Settings",
                software: [],
                right: ['manage_lead_industry']
            },

            {
                url: 'dealPipeline',
                display: 'Deal Pipeline',
                group: "Settings",
                software: [],
                right: ['manage_deal_pipeline']
            },
            {
                url: 'dealPipeline/create',
                display: 'Add Deal Pipeline',
                group: "Settings",
                software: [],
                right: ['manage_deal_pipeline']
            },

            {
                url: 'dealLost',
                display: 'Deal Lost Reason',
                group: "Settings",
                software: [],
                right: ['manage_deal_lost']
            },
            {
                url: 'dealLost/create',
                display: 'Add Deal Lost Reason',
                group: "Settings",
                software: [],
                right: ['manage_deal_lost']
            },

            {
                url: 'visitFeedbackType',
                display: 'Visit Feedback',
                group: "Settings",
                software: [],
                right: ['manage_visit_feedback_type']
            },
            {
                url: 'visitFeedbackType/create',
                display: 'Add Visit Feedback',
                group: "Settings",
                software: [],
                right: ['manage_visit_feedback_type']
            },

            {
                url: 'warehouse',
                display: 'Warehouse',
                group: "Settings",
                software: ['kims'],
                right: ['manage_warehouse']
            },
            {
                url: 'warehouse/create',
                display: 'Add Warehouse',
                group: "Settings",
                software: ['kims'],
                right: ['manage_warehouse']
            },

            {
                url: 'leaveType',
                display: 'Leave Type',
                group: "Settings",
                software: [],
                right: ['manage_leave_type']
            },
            {
                url: 'leaveType/create',
                display: 'Add Leave Type',
                group: "Settings",
                software: [],
                right: ['manage_leave_type']
            },

            {
                url: 'template',
                display: 'Template',
                group: "Settings",
                software: [],
                right: ['manage_template']
            },

            {
                url: 'prefix',
                display: 'Prefix',
                group: "Settings",
                software: [],
                right: ['manage_prefix']
            },

            {
                url: 'holiday',
                display: 'Holiday',
                group: "Settings",
                software: [],
                right: ['manage_holiday']
            },

            {
                url: 'process',
                display: 'Process',
                group: "Settings",
                software: [],
                right: ['manage_process']
            },
            {
                url: 'process/create',
                display: 'Add Process',
                group: "Settings",
                software: [],
                right: ['manage_process']
            },

            {
                url: 'smsTemplate',
                display: 'SMS Template',
                group: "Settings",
                software: [],
                right: ['manage_sms_template']
            },
            {
                url: 'smsTemplate/create',
                display: 'Add SMS Template',
                group: "Settings",
                software: [],
                right: ['manage_sms_template']
            },

            {
                url: 'mailTemplate',
                display: 'Mail Template',
                group: "Settings",
                software: [],
                right: ['manage_mail_template']
            },
            {
                url: 'mailTemplate/create',
                display: 'Add Mail Template',
                group: "Settings",
                software: [],
                right: ['manage_mail_template']
            },

            {
                url: 'terms',
                display: 'Terms & Conditions',
                group: "Settings",
                software: [],
                right: ['manage_tnc']
            },

            {
                url: 'targetType',
                display: 'Target Type',
                group: "Settings",
                software: [],
                right: ['manage_target_type']
            },
            {
                url: 'targetType/create',
                display: 'Add Target Type',
                group: "Settings",
                software: [],
                right: ['manage_target_type']
            },

            {
                url: 'complaintType',
                display: 'Complaint Type',
                group: "Settings",
                software: [],
                right: ['manage_complaint_type']
            },

            {
                url: 'complaintFeedbackType',
                display: 'Complaint Feedback',
                group: "Settings",
                software: [],
                right: ['manage_complaint_feedback_type']
            },

            {
                url: 'brand',
                display: 'Brand',
                group: "Settings",
                software: ['koops'],
                right: ['manage_brand']
            },

            {
                url: 'media',
                display: 'Media',
                group: "Settings",
                software: ['koops', 'kcrm', 'klt'],
                right: ['manage_media']
            },

            {
                url: 'settings',
                display: 'Company Settings',
                group: "Settings",
                software: [],
                right: ['manage_setting']
            },

            {
                url: 'custom_field/user',
                display: 'User',
                group: "Custom fields",
                software: [],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/account',
                display: $rootScope.customer_module_name,
                group: "Custom fields",
                software: [],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/product',
                display: 'Product',
                group: "Custom fields",
                software: ['koops', 'kcrm'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/order',
                display: 'Order',
                group: "Custom fields",
                software: ['koops'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/order_delivery',
                display: 'Order Dispatch',
                group: "Custom fields",
                software: ['koops'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/sale_quotation',
                display: 'Sale Quotation',
                group: "Custom fields",
                software: ['koops', 'kcrm'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/estimate',
                display: 'Estimate',
                group: "Custom fields",
                software: ['koops', 'kcrm'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/payment_collection',
                display: 'Payment',
                group: "Custom fields",
                software: ['koops'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/lead',
                display: 'Lead',
                group: "Custom fields",
                software: ['kcrm'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/deal',
                display: 'Deal',
                group: "Custom fields",
                software: ['kcrm'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/worker',
                display: 'Worker',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/ims_purchase_order',
                display: 'Purchase Order',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/job',
                display: 'Job',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/production',
                display: 'Production',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/grn',
                display: 'Grn',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/delivery_receipt',
                display: 'Delivery Receipt',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/goods_in',
                display: 'Goods In',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/goods_out',
                display: 'Goods Out',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/warehouse_transfer',
                display: 'Warehouse Transfer',
                group: "Custom fields",
                software: ['kims'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/visit',
                display: 'Visit',
                group: "Custom fields",
                software: [],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/invoice',
                display: 'Invoice',
                group: "Custom fields",
                software: ['koops'],
                right: ['manage_custom_field']
            },
            {
                url: 'custom_field/sales_return',
                display: 'Sales Return',
                group: "Custom fields",
                software: ['koops'],
                right: ['manage_custom_field']
            },

            {
                url: 'profile',
                display: 'Company Profile',
                group: "Company Profile",
                software: [],
                right: ['manage_company_profile']
            },

            {
                url: 'subscription',
                display: 'Subscription',
                group: "Subscription",
                software: [],
                right: ['manage_subscription']
            },
        ];

        // Custom Form
        if ($rootScope.ADVANCEFEATURE == 0 && $rootScope.getFormData()) {
            let forms = $rootScope.getFormData();
            $scope.searchMenuData.push({
                url: 'form',
                display: "All Form",
                group: "Custom Forms",
                software: ['koops'],
                right: ['manage_form']
            })
            $.each(forms, (idx, val) => {
                if (val.id) {
                    $scope.searchMenuData.push({
                        url: 'formData/' + val.id,
                        display: val.name,
                        group: "Custom Forms",
                        software: ['koops'],
                        right: ['manage_form', 'read_form_' + val.id]
                    });
                }
            });
        }

        $scope.searchMenuData = $rootScope.recentSearch.length > 0 ? $rootScope.recentSearch.concat($scope.searchMenuData) : $scope.searchMenuData;
        $timeout(function() {
            var groupName = "";
            var lst = "";
            $.each($scope.searchMenuData, function(key, item) {
                var rightCond = ((item['right'].length == 0) || (item['right'] && $rootScope.checkRight(item['right'])));
                var softCond = ((item['software'].length == 0) || (item['software'] && $rootScope.checkSoftware(item['software'])));
                if (rightCond && softCond) {
                    if (item['group'] !== groupName) {
                        groupName = item['group'];
                        if (lst !== "") {
                            lst += "</optgroup>";
                        }
                        lst += '<optgroup label="' + groupName + '">';
                    }
                    lst += '<option value="' + item['url'] + '">' + item['display'] + '</option>';
                }
            });
            $compile(lst)($rootScope);
            lst = '<option value=""></option>' + lst;
            $("#searchMenu").html(lst);
            $("#searchMenu").select2({
                placeholder: "Search Menu",
                matcher: function(term, text, opt) {
                    var $option = $(opt);
                    var $optgroup = $option.parent('optgroup');
                    var label = $optgroup.attr('label');

                    term = term.toLowerCase();
                    text = text.toLowerCase();

                    var r = true;

                    var terms = term.split(' ');

                    var te = terms.every(function(val) {
                        return text.indexOf(val) !== -1;
                    });

                    var la = terms.every(function(val) {
                        return label.toLowerCase().indexOf(val) !== -1;
                    });

                    $.each(terms, function(i, val) {
                        if (text.indexOf(val) <= -1) {
                            if (label.toLowerCase().indexOf(val) <= -1) {
                                r = false;
                                return false;
                            }
                        }
                    });

                    return te || la;

                    //                    return terms.every(term => {
                    //                        if (text.indexOf(term) > -1 || (label !== undefined && label.toUpperCase().indexOf(term) > -1)) {
                    //                            return true;
                    //                        }
                    //                    })
                }
            });
            $("#searchMenu").select2('open');
            lst = "";
        }, 500);

        $scope.redirectOn = function() {
            var selected = $("#searchMenu").select2('data');
            $.each($rootScope.recentSearch, function(key, item) {
                if (item['url'] == $scope.searchString) {
                    $rootScope.recentSearch.splice(key, 1)
                    return false;
                }
            });

            if ($rootScope.recentSearch.length >= 3) {
                $rootScope.recentSearch.pop();
            }

            var recentData = {
                url: selected['id'],
                display: selected['text'],
                group: 'Recently Searched',
                software: [],
                right: []
            };
            $rootScope.recentSearch.unshift(recentData);
            $("#searchMenu").val('');
            $("#searchMenu").select2('data', null);
            $scope.searchModalInstance.dismiss('cancel');
            window.location.href = "#/" + $scope.searchString;
            $scope.searchString = "";
        }

    });
});