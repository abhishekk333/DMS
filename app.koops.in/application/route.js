var routes = {};

// Define Your Routes
routes = {
    // Dashboard
    'dashboard': {
        controller: 'modules/dashboard/dashboard.js@index',
        url: 'dashboard',
        template: 'modules/dashboard/dashboard.html',
    },
    // Message
    'message': {
        controller: 'modules/message/message.js@index',
        url: 'message',
        template: 'modules/message/message.html',
        filter: ['send_message']
    },
    // Account
    'account': {
        controller: 'modules/account/account.js@account_index',
        url: 'account',
        template: 'modules/account/account.html',
        filter: ['read_account']
    },
    // Account Create
    'account/create': {
        controller: 'modules/account/account.js@account_create',
        url: 'account/create',
        template: 'modules/account/create.html',
        filter: ['add_account']
    },
    // Account View
    'account/view/id': {
        controller: 'modules/account/account.js@account_view',
        url: 'account/view/:id',
        template: 'modules/account/view.html',
        filter: ['read_account']
    },
    // Account Edit
    'account/edit/id': {
        controller: 'modules/account/account.js@account_edit',
        url: 'account/edit/:id',
        template: 'modules/account/create.html',
        filter: ['edit_account']
    },
    // Account Stock Adjustment
    'accountStockAdjustment': {
        controller: 'modules/accountStock/accountStock.js@index',
        url: 'accountStockAdjustment',
        template: 'modules/accountStock/accountStockAdjustment.html',
        filter: ['manage_account_stock']
    },
    // Account Stock Adjustment Create
    'accountStockAdjustment/create': {
        controller: 'modules/accountStock/accountStock.js@create',
        url: 'accountStockAdjustment/create',
        template: 'modules/accountStock/create.html',
        filter: ['manage_account_stock']
    },
    // Account Stock Adjustment View
    'accountStockAdjustment/view/id': {
        controller: 'modules/accountStock/accountStock.js@view',
        url: 'accountStockAdjustment/view/:id',
        template: 'modules/accountStock/view.html',
        filter: ['manage_account_stock']
    },
    // Account Stock Report
    'accountStockReport': {
        controller: 'modules/accountStock/accountStock.js@stockReport',
        url: 'accountStockReport',
        template: 'modules/accountStock/accountStockReport.html',
        filter: ['manage_account_stock']
    },
    // Account Stock Report
    'accountStockTransactionReport': {
        controller: 'modules/accountStock/accountStock.js@transactionReport',
        url: 'accountStockTransactionReport',
        template: 'modules/accountStock/accountStockTransactionReport.html',
        filter: ['manage_account_stock']
    },
    // User
    'user': {
        controller: 'modules/user/user/user.js@user_index',
        url: 'user',
        template: 'modules/user/user/user.html',
        filter: ['read_user']
    },
    // User Create
    'user/create': {
        controller: 'modules/user/user/user.js@user_create',
        url: 'user/create',
        template: 'modules/user/user/create.html',
        filter: ['modify_user']
    },
    // User View
    'user/view/id': {
        controller: 'modules/user/user/user.js@user_view',
        url: 'user/view/:id',
        template: 'modules/user/user/view.html',
        filter: ['read_user']
    },
    // User Edit
    'user/edit/id': {
        controller: 'modules/user/user/user.js@user_edit',
        url: 'user/edit/:id',
        template: 'modules/user/user/create.html',
        filter: ['modify_user']
    },
    // User Role
    'userRole': {
        controller: 'modules/user/userRole/userRole.js@index',
        url: 'userRole',
        template: 'modules/user/userRole/userRole.html',
        filter: ['read_user_role']
    },
    // User Create
    'userRole/create': {
        controller: 'modules/user/userRole/userRole.js@create',
        url: 'userRole/create',
        template: 'modules/user/userRole/create.html',
        filter: ['add_user_role']
    },
    // User Role Edit
    'userRole/edit/id': {
        controller: 'modules/user/userRole/userRole.js@edit',
        url: 'userRole/edit/:id',
        template: 'modules/user/userRole/create.html',
        filter: ['edit_user_role']
    },
    // Product Category
    'productCategory': {
        controller: 'modules/catalog/productCategory/productCategory.js@index',
        url: 'productCategory',
        template: 'modules/catalog/productCategory/productCategory.html',
        filter: ['manage_product_category']
    },
    // Product Category Create
    'productCategory/create': {
        controller: 'modules/catalog/productCategory/productCategory.js@create',
        url: 'productCategory/create',
        template: 'modules/catalog/productCategory/create.html',
        filter: ['manage_product_category']
    },
    // Product Category Edit
    'productCategory/edit/id': {
        controller: 'modules/catalog/productCategory/productCategory.js@edit',
        url: 'productCategory/edit/:id',
        template: 'modules/catalog/productCategory/create.html',
        filter: ['manage_product_category']
    },
    // Product Unit
    'productUnit': {
        controller: 'modules/catalog/productUnit/productUnit.js@index',
        url: 'productUnit',
        template: 'modules/catalog/productUnit/productUnit.html',
        filter: ['manage_product_unit']
    },
    // Product Unit Create
    'productUnit/create': {
        controller: 'modules/catalog/productUnit/productUnit.js@create',
        url: 'productUnit/create',
        template: 'modules/catalog/productUnit/create.html',
        filter: ['manage_product_unit']
    },
    // Product Unit Edit
    'productUnit/edit/id': {
        controller: 'modules/catalog/productUnit/productUnit.js@edit',
        url: 'productUnit/edit/:id',
        template: 'modules/catalog/productUnit/create.html',
        filter: ['manage_product_unit']
    },
    // Product
    'product': {
        controller: 'modules/catalog/product/product.js@product_index',
        url: 'product',
        template: 'modules/catalog/product/product.html',
        filter: ['read_product']
    },
    // Product Create
    'product/create': {
        controller: 'modules/catalog/product/product.js@product_create',
        url: 'product/create',
        template: 'modules/catalog/product/create.html',
        filter: ['add_product']
    },
    // Product View
    'product/view/id': {
        controller: 'modules/catalog/product/product.js@product_view',
        url: 'product/view/:id',
        template: 'modules/catalog/product/view.html',
        filter: ['read_product']
    },
    // Product Edit
    'product/edit/id': {
        controller: 'modules/catalog/product/product.js@product_edit',
        url: 'product/edit/:id',
        template: 'modules/catalog/product/create.html',
        filter: ['edit_product']
    },
    // Price Group
    'priceGroup': {
        controller: 'modules/catalog/priceGroup/priceGroup.js@index',
        url: 'priceGroup',
        template: 'modules/catalog/priceGroup/priceGroup.html',
        filter: ['manage_price_group']
    },
    // Price Group Create
    'priceGroup/create': {
        controller: 'modules/catalog/priceGroup/priceGroup.js@create',
        url: 'priceGroup/create',
        template: 'modules/catalog/priceGroup/create.html',
        filter: ['manage_price_group']
    },
    // Price Group Edit
    'priceGroup/edit/id': {
        controller: 'modules/catalog/priceGroup/priceGroup.js@edit',
        url: 'priceGroup/edit/:id',
        template: 'modules/catalog/priceGroup/create.html',
        filter: ['manage_price_group']
    },
    // Prority
    'priority': {
        controller: 'modules/catalog/priority/priority.js@index',
        url: 'priority',
        template: 'modules/catalog/priority/priority.html',
        filter: ['manage_priority']
    },
    // News
    'news': {
        controller: 'modules/news/news.js@index',
        url: 'news',
        template: 'modules/news/news.html',
        filter: ['manage_news']
    },
    // News Create
    'news/create': {
        controller: 'modules/news/news.js@create',
        url: 'news/create',
        template: 'modules/news/create.html',
        filter: ['manage_news']
    },
    // News Update
    'news/edit/id': {
        controller: 'modules/news/news.js@edit',
        url: 'news/edit/:id',
        template: 'modules/news/create.html',
        filter: ['manage_news']
    },
    // Transport
    'transport': {
        controller: 'modules/transport/transport.js@index',
        url: 'transport',
        template: 'modules/transport/transport.html',
        filter: ['manage_transport']
    },
    // Transport Create
    'transport/create': {
        controller: 'modules/transport/transport.js@create',
        url: 'transport/create',
        template: 'modules/transport/create.html',
        filter: ['manage_transport']
    },
    // Transport Edit
    'transport/edit/id': {
        controller: 'modules/transport/transport.js@edit',
        url: 'transport/edit/:id',
        template: 'modules/transport/create.html',
        filter: ['manage_transport']
    },
    // Expense Type
    'expenseType': {
        controller: 'modules/expense/expenseType/expenseType.js@index',
        url: 'expenseType',
        template: 'modules/expense/expenseType/expenseType.html',
        filter: ['manage_expense_type']
    },
    // Expense Type Create
    'expenseType/create': {
        controller: 'modules/expense/expenseType/expenseType.js@create',
        url: 'expenseType/create',
        template: 'modules/expense/expenseType/create.html',
        filter: ['manage_expense_type']
    },
    // Expense Edit
    'expenseType/edit/id': {
        controller: 'modules/expense/expenseType/expenseType.js@edit',
        url: 'expenseType/edit/:id',
        template: 'modules/expense/expenseType/create.html',
        filter: ['manage_expense_type']
    },
    // Expense
    'expense': {
        controller: 'modules/expense/expense/expense.js@expense_index',
        url: 'expense',
        template: 'modules/expense/expense/expense.html',
        filter: ['read_expense']
    },
    // Expense Create
    'expense/create': {
        controller: 'modules/expense/expense/expense.js@expense_create',
        url: 'expense/create',
        template: 'modules/expense/expense/create.html',
        filter: ['add_expense']
    },
    // Expense Edit
    'expense/edit/id': {
        controller: 'modules/expense/expense/expense.js@expense_edit',
        url: 'expense/edit/:id',
        template: 'modules/expense/expense/create.html',
        filter: ['edit_expense']
    },
    // Expense View
    'expense/view/id': {
        controller: 'modules/expense/expense/expense.js@expense_view',
        url: 'expense/view/:id',
        template: 'modules/expense/expense/view.html',
        filter: ['read_expense']
    },
    // Visit Feedback Type
    'visitFeedbackType': {
        controller: 'modules/visit/visitFeedbackType/visitFeedbackType.js@index',
        url: 'visitFeedbackType',
        template: 'modules/visit/visitFeedbackType/visitFeedbackType.html',
        filter: ['manage_visit_feedback_type']
    },
    // Visit Feedback Type Create
    'visitFeedbackType/create': {
        controller: 'modules/visit/visitFeedbackType/visitFeedbackType.js@create',
        url: 'visitFeedbackType/create',
        template: 'modules/visit/visitFeedbackType/create.html',
        filter: ['manage_visit_feedback_type']
    },
    // Visit Feedback Type Edit
    'visitFeedbackType/edit/id': {
        controller: 'modules/visit/visitFeedbackType/visitFeedbackType.js@edit',
        url: 'visitFeedbackType/edit/:id',
        template: 'modules/visit/visitFeedbackType/create.html',
        filter: ['manage_visit_feedback_type']
    },
    // Visit Report
    'visitReport': {
        controller: 'modules/visit/visitReport/visitReport.js@index',
        url: 'visitReport',
        template: 'modules/visit/visitReport/visitReport.html',
        filter: ['visit_report']
    },
    // Visit Report View
    'visitReport/view/id': {
        controller: 'modules/visit/visitReport/visitReport.js@view',
        url: 'visitReport/view/:id',
        template: 'modules/visit/visitReport/view.html',
        filter: ['visit_report']
    },
    //Customer Visit Report
    'accountVisitReport': {
        controller: 'modules/visit/accountVisitReport/accountVisitReport.js@account_visit_report_index',
        url: 'accountVisitReport',
        template: 'modules/visit/accountVisitReport/accountVisitReport.html',
        filter: ['visit_report']
    },
    //Customer Visit Report View
    'accountVisitReport/view/id': {
        controller: 'modules/visit/accountVisitReport/accountVisitReport.js@account_visit_report_view',
        url: 'accountVisitReport/view/:id',
        template: 'modules/visit/accountVisitReport/view.html',
        filter: ['visit_report']
    },
    //Lead Visit Report
    'leadVisitReport': {
        controller: 'modules/visit/leadVisitReport/leadVisitReport.js@lead_visit_report_index',
        url: 'leadVisitReport',
        template: 'modules/visit/leadVisitReport/leadVisitReport.html',
        filter: ['visit_report']
    },
    //Lead Visit Report View
    'leadVisitReport/view/id': {
        controller: 'modules/visit/leadVisitReport/leadVisitReport.js@lead_visit_report_view',
        url: 'leadVisitReport/view/:id',
        template: 'modules/visit/leadVisitReport/view.html',
        filter: ['visit_report']
    },
    // Visit Report
    'visitLocator': {
        controller: 'modules/visit/visitLocator/visitLocator.js@index',
        url: 'visitLocator',
        template: 'modules/visit/visitLocator/visitLocator.html',
        filter: ['visit_locator']
    },
    // User Location
    'userLocation': {
        controller: 'modules/visit/userLocation/userLocation.js@index',
        url: 'userLocation',
        template: 'modules/visit/userLocation/userLocation.html',
        filter: ['user_location']
    },
    // User Performance
    'userPerformance': {
        controller: 'modules/visit/userPerformance/userPerformance.js@index',
        url: 'userPerformance',
        template: 'modules/visit/userPerformance/userPerformance.html',
        filter: ['user_performance']
    },
    // Current Location
    'currentLocation': {
        controller: 'modules/visit/currentLocation/currentLocation.js@index',
        url: 'currentLocation',
        template: 'modules/visit/currentLocation/currentLocation.html',
        filter: ['current_location']
    },
    // Location Dashboard
    'locationDashboard': {
        controller: 'modules/visit/locationDashboard/locationDashboard.js@index',
        url: 'locationDashboard',
        template: 'modules/visit/locationDashboard/locationDashboard.html',
        filter: ['visit_locator']
    },
    // Change Password
    'changePassword': {
        controller: 'modules/changePassword/changePassword.js@index',
        url: 'changePassword',
        template: 'modules/changePassword/changePassword.html',
    },
    // Help
    'help': {
        controller: 'modules/help/help.js@index',
        url: 'help',
        template: 'modules/help/help.html',
    },

    // Order
    'order': {
        controller: 'modules/order/order.js@order_index',
        url: 'order',
        template: 'modules/order/order.html',
        filter: ['read_order']
    },
    // Order Create
    'order/create': {
        controller: 'modules/order/order.js@order_create',
        url: 'order/create',
        template: 'modules/order/create.html',
        filter: ['add_order']
    },
    // Order Edit
    'order/edit/id': {
        controller: 'modules/order/order.js@order_edit',
        url: 'order/edit/:id',
        template: 'modules/order/create.html',
        filter: ['edit_order']
    },
    // Order Create
    'order/view/id': {
        controller: 'modules/order/order.js@order_view',
        url: 'order/view/:id',
        template: 'modules/order/view.html',
        filter: ['read_order']
    },
    // Orderwise Delivery Report
    'orderwiseDeliveryReport': {
        controller: 'modules/report/orderwiseDeliveryReport/orderwiseDeliveryReport.js@index',
        url: 'orderwiseDeliveryReport',
        template: 'modules/report/orderwiseDeliveryReport/orderwiseDeliveryReport.html',
        filter: ['orderwise_delivery_report']
    },
    // Productwise Delivery Report
    'productwiseDeliveryReport': {
        controller: 'modules/report/productwiseDeliveryReport/productwiseDeliveryReport.js@index',
        url: 'productwiseDeliveryReport',
        template: 'modules/report/productwiseDeliveryReport/productwiseDeliveryReport.html',
        filter: ['productwise_delivery_report']
    },
    'productwiseDeliveryReport/view/id': {
        controller: 'modules/report/productwiseDeliveryReport/productwiseDeliveryReport.js@view',
        url: 'productwiseDeliveryReport/view/:id',
        template: 'modules/report/productwiseDeliveryReport/view.html',
        filter: ['productwise_delivery_report']
    },
    // All Delivery Report
    'allDeliveryReport': {
        controller: 'modules/report/allDeliveryReport/allDeliveryReport.js@index',
        url: 'allDeliveryReport',
        template: 'modules/report/allDeliveryReport/allDeliveryReport.html',
        filter: ['all_delivery_report']
    },
    // Device Report
    'deviceReport': {
        controller: 'modules/report/deviceReport/deviceReport.js@index',
        url: 'deviceReport',
        template: 'modules/report/deviceReport/deviceReport.html',
        filter: ['device_report']
    },
    // Activity Report
    'activityReport': {
        controller: 'modules/report/activityReport/activityReport.js@index',
        url: 'activityReport',
        template: 'modules/report/activityReport/activityReport.html',
        filter: ['activity_report']
    },
    // Rotten Report
    'rottenReport': {
        controller: 'modules/report/rottenReport/rottenReport.js@index',
        url: 'rottenReport',
        template: 'modules/report/rottenReport/rottenReport.html',
        filter: ['rotten_report']
    },
    // Target Report
    'targetReport': {
        controller: 'modules/report/targetReport/targetReport.js@index',
        url: 'targetReport',
        template: 'modules/report/targetReport/targetReport.html',
        filter: ['target_report']
    },
    //Stock On Hand Report
    'stockOnHandReport': {
        controller: 'modules/report/stockOnHandReport/stockOnHandReport.js@stockOnHand_index',
        url: 'stockOnHandReport',
        template: 'modules/report/stockOnHandReport/stockOnHandReport.html',
        filter: ['stock_on_hand_report']
    },
    //Stock On Hand Report View
    'stockOnHandReport/view/id': {
        controller: 'modules/report/stockOnHandReport/stockOnHandReport.js@stockOnHand_view',
        url: 'stockOnHandReport/view/:id',
        template: 'modules/report/stockOnHandReport/view.html',
        filter: ['stock_on_hand_report']
    },
    'stockOnHandReport/makePurchaseOrderModal': {
        controller: 'modules/report/stockOnHandReport/stockOnHandReport.js@makePurchaseOrder',
        url: 'stockOnHandReport/makePurchaseOrder',
        template: 'modules/report/stockOnHandReport/makePurchaseOrderModal.html',
        filter: ['stock_on_hand_report']
    },
    'stockOnHandReport/makeJobModal': {
        controller: 'modules/report/stockOnHandReport/stockOnHandReport.js@makeJob',
        url: 'stockOnHandReport/makeJob',
        template: 'modules/report/stockOnHandReport/makeJobModal.html',
        filter: ['stock_on_hand_report']
    },
    //Production Report
    'productionReport': {
        controller: 'modules/report/productionReport/productionReport.js@index',
        url: 'productionReport',
        template: 'modules/report/productionReport/productionReport.html',
        filter: ['production_report']
    },
    // User Sales Report
    'userSalesReport': {
        controller: 'modules/report/userSalesReport/userSalesReport.js@index',
        url: 'userSalesReport',
        template: 'modules/report/userSalesReport/userSalesReport.html',
        filter: ['user_sales_report']
    },
    // Payment Collection Report
    'paymentCollectionReport': {
        controller: 'modules/report/paymentCollectionReport/paymentCollectionReport.js@index',
        url: 'paymentCollectionReport',
        template: 'modules/report/paymentCollectionReport/paymentCollectionReport.html',
        filter: ['payment_collection_report']
    },
    // Device Report
    'orderReport': {
        controller: 'modules/report/orderReport/orderReport.js@index',
        url: 'orderReport',
        template: 'modules/report/orderReport/orderReport.html',
        filter: ['order_report']
    },
    // Device Report
    'salesReport': {
        controller: 'modules/report/salesReport/salesReport.js@index',
        url: 'salesReport',
        template: 'modules/report/salesReport/salesReport.html',
        filter: ['sales_report']
    },
    // Device Report
    'dealValueReport': {
        controller: 'modules/report/dealValueReport/dealValueReport.js@index',
        url: 'dealValueReport',
        template: 'modules/report/dealValueReport/dealValueReport.html',
        filter: ['deal_value_report']
    },
    // Device Report
    'dealStatusReport': {
        controller: 'modules/report/dealStatusReport/dealStatusReport.js@index',
        url: 'dealStatusReport',
        template: 'modules/report/dealStatusReport/dealStatusReport.html',
        filter: ['deal_status_report']
    },
    // Sale Quotation Report
    'saleQuotationReport': {
        controller: 'modules/report/saleQuotationReport/saleQuotationReport.js@index',
        url: 'saleQuotationReport',
        template: 'modules/report/saleQuotationReport/saleQuotationReport.html',
        filter: ['sale_quotation_report']
    },
    // Estimate Report
    'estimateReport': {
        controller: 'modules/report/estimateReport/estimateReport.js@index',
        url: 'estimateReport',
        template: 'modules/report/estimateReport/estimateReport.html',
        filter: ['estimate_report']
    },
    // Sale Quotation Report
    'salesReturnReport': {
        controller: 'modules/report/salesReturnReport/salesReturnReport.js@index',
        url: 'salesReturnReport',
        template: 'modules/report/salesReturnReport/salesReturnReport.html',
        filter: ['sales_return_report']
    },
    // Device Report
    'leadReport': {
        controller: 'modules/report/leadReport/leadReport.js@index',
        url: 'leadReport',
        template: 'modules/report/leadReport/leadReport.html',
        filter: ['lead_report']
    },
    // User Attendance
    'userAttendance': {
        controller: 'modules/visit/userAttendance/userAttendance.js@index',
        url: 'userAttendance',
        template: 'modules/visit/userAttendance/userAttendance.html',
        filter: ['user_attendance']
    },
    // Area
    'area': {
        controller: 'modules/area/area.js@index',
        url: 'area',
        template: 'modules/area/area.html',
        filter: ['read_area']
    },
    // Area Create
    'area/create': {
        controller: 'modules/area/area.js@create',
        url: 'area/create',
        template: 'modules/area/create.html',
        filter: ['add_area']
    },
    // Area Edit
    'area/edit/id': {
        controller: 'modules/area/area.js@edit',
        url: 'area/edit/:id',
        template: 'modules/area/create.html',
        filter: ['edit_area']
    },
    // Payment type
    'paymentType': {
        controller: 'modules/paymentCollection/paymentType/paymentType.js@index',
        url: 'paymentType',
        template: 'modules/paymentCollection/paymentType/paymentType.html',
        filter: ['manage_payment_type']
    },
    // Payment type Create
    'paymentType/create': {
        controller: 'modules/paymentCollection/paymentType/paymentType.js@create',
        url: 'paymentType/create',
        template: 'modules/paymentCollection/paymentType/create.html',
        filter: ['manage_payment_type']
    },
    // Payment type Edit
    'paymentType/edit/id': {
        controller: 'modules/paymentCollection/paymentType/paymentType.js@edit',
        url: 'paymentType/edit/:id',
        template: 'modules/paymentCollection/paymentType/create.html',
        filter: ['manage_payment_type']
    },
    // Payment collection
    'paymentCollection': {
        controller: 'modules/paymentCollection/paymentCollection/paymentCollection.js@payment_collection_index',
        url: 'paymentCollection',
        template: 'modules/paymentCollection/paymentCollection/paymentCollection.html',
        filter: ['read_payment_collection']
    },
    // Payment collection Create
    'paymentCollection/create': {
        controller: 'modules/paymentCollection/paymentCollection/paymentCollection.js@payment_collection_create',
        url: 'paymentCollection/create',
        template: 'modules/paymentCollection/paymentCollection/create.html',
        filter: ['add_payment_collection']
    },
    // Payment collection Edit
    'paymentCollection/edit/id': {
        controller: 'modules/paymentCollection/paymentCollection/paymentCollection.js@payment_collection_edit',
        url: 'paymentCollection/edit/:id',
        template: 'modules/paymentCollection/paymentCollection/create.html',
        filter: ['edit_payment_collection']
    },
    // Payment collection View
    'paymentCollection/view/id': {
        controller: 'modules/paymentCollection/paymentCollection/paymentCollection.js@payment_collection_view',
        url: 'paymentCollection/view/:id',
        template: 'modules/paymentCollection/paymentCollection/view.html',
        filter: ['read_payment_collection']
    },
    // Lead Status
    'leadStatus': {
        controller: 'modules/lead/leadStatus/leadStatus.js@index',
        url: 'leadStatus',
        template: 'modules/lead/leadStatus/leadStatus.html',
        filter: ['manage_lead_status']
    },
    // Lead Status Create
    'leadStatus/create': {
        controller: 'modules/lead/leadStatus/leadStatus.js@create',
        url: 'leadStatus/create',
        template: 'modules/lead/leadStatus/create.html',
        filter: ['manage_lead_status']
    },
    // Lead Status Edit
    'leadStatus/edit/id': {
        controller: 'modules/lead/leadStatus/leadStatus.js@edit',
        url: 'leadStatus/edit/:id',
        template: 'modules/lead/leadStatus/create.html',
        filter: ['manage_lead_status']
    },
    // Lead Source
    'leadSource': {
        controller: 'modules/lead/leadSource/leadSource.js@index',
        url: 'leadSource',
        template: 'modules/lead/leadSource/leadSource.html',
        filter: ['manage_lead_source']
    },
    // Lead Source Add
    'leadSource/create': {
        controller: 'modules/lead/leadSource/leadSource.js@create',
        url: 'leadSource/create',
        template: 'modules/lead/leadSource/create.html',
        filter: ['manage_lead_source']
    },
    // Lead Source Edit
    'leadSource/edit/id': {
        controller: 'modules/lead/leadSource/leadSource.js@edit',
        url: 'leadSource/edit/:id',
        template: 'modules/lead/leadSource/create.html',
        filter: ['manage_lead_source']
    },
    // Lead Industry
    'leadIndustry': {
        controller: 'modules/lead/leadIndustry/leadIndustry.js@index',
        url: 'leadIndustry',
        template: 'modules/lead/leadIndustry/leadIndustry.html',
        filter: ['manage_lead_industry']
    },
    // Lead Industry Add
    'leadIndustry/create': {
        controller: 'modules/lead/leadIndustry/leadIndustry.js@create',
        url: 'leadIndustry/create',
        template: 'modules/lead/leadIndustry/create.html',
        filter: ['manage_lead_industry']
    },
    // Lead Industry Edit
    'leadIndustry/edit/id': {
        controller: 'modules/lead/leadIndustry/leadIndustry.js@edit',
        url: 'leadIndustry/edit/:id',
        template: 'modules/lead/leadIndustry/create.html',
        filter: ['manage_lead_source']
    },
    // Lead 
    'lead': {
        controller: 'modules/lead/lead/lead.js@lead_index',
        url: 'lead',
        template: 'modules/lead/lead/lead.html',
        filter: ['read_lead']
    },
    // Lead Add
    'lead/create': {
        controller: 'modules/lead/lead/lead.js@lead_create',
        url: 'lead/create',
        template: 'modules/lead/lead/create.html',
        filter: ['add_lead']
    },
    // Lead Edit
    'lead/edit/id': {
        controller: 'modules/lead/lead/lead.js@lead_edit',
        url: 'lead/edit/:id',
        template: 'modules/lead/lead/create.html',
        filter: ['edit_lead']
    },
    // Lead View
    'lead/view/id': {
        controller: 'modules/lead/lead/lead.js@lead_view',
        url: 'lead/view/:id',
        template: 'modules/lead/lead/view.html',
        filter: ['read_lead']
    },
    // Task Type
    'activityType': {
        controller: 'modules/activity/activityType/activityType.js@index',
        url: 'activityType',
        template: 'modules/activity/activityType/activityType.html',
        filter: ['manage_activity_type']
    },
    // Task Type Add
    'activityType/create': {
        controller: 'modules/activity/activityType/activityType.js@create',
        url: 'activityType/create',
        template: 'modules/activity/activityType/create.html',
        filter: ['manage_activity_type']
    },
    // Lead Source Edit
    'activityType/edit/id': {
        controller: 'modules/activity/activityType/activityType.js@edit',
        url: 'activityType/edit/:id',
        template: 'modules/activity/activityType/create.html',
        filter: ['manage_activity_type']
    },
    // Task
    'activity': {
        controller: 'modules/activity/activity/activity.js@index',
        url: 'activity',
        template: 'modules/activity/activity/activity.html',
        filter: ['manage_activity']
    },
    // Deal Pipeline    
    'dealPipeline': {
        controller: 'modules/deal/dealPipeline/dealPipeline.js@index',
        url: 'dealPipeline',
        template: 'modules/deal/dealPipeline/dealPipeline.html',
        filter: ['manage_deal_pipeline']
    },
    // Deal Pipeline Add
    'dealPipeline/create': {
        controller: 'modules/deal/dealPipeline/dealPipeline.js@create',
        url: 'dealPipeline/create',
        template: 'modules/deal/dealPipeline/create.html',
        filter: ['manage_deal_pipeline']
    },
    // Deal Pipeline Edit
    'dealPipeline/edit/id': {
        controller: 'modules/deal/dealPipeline/dealPipeline.js@edit',
        url: 'dealPipeline/edit/:id',
        template: 'modules/deal/dealPipeline/create.html',
        filter: ['manage_deal_pipeline']
    },
    // Deal Lost    
    'dealLost': {
        controller: 'modules/deal/dealLost/dealLost.js@index',
        url: 'dealLost',
        template: 'modules/deal/dealLost/dealLost.html',
        filter: ['manage_deal_lost']
    },
    // Deal Lost Add
    'dealLost/create': {
        controller: 'modules/deal/dealLost/dealLost.js@create',
        url: 'dealLost/create',
        template: 'modules/deal/dealLost/create.html',
        filter: ['manage_deal_lost']
    },
    // Deal Lost Edit
    'dealLost/edit/id': {
        controller: 'modules/deal/dealLost/dealLost.js@edit',
        url: 'dealLost/edit/:id',
        template: 'modules/deal/dealLost/create.html',
        filter: ['manage_deal_lost']
    },
    // Deal 
    'deal': {
        controller: 'modules/deal/deal/deal.js@deal_index',
        url: 'deal',
        template: 'modules/deal/deal/deal.html',
        filter: ['read_deal']
    },
    // Deal Add
    'deal/create': {
        controller: 'modules/deal/deal/deal.js@deal_create',
        url: 'deal/create',
        template: 'modules/deal/deal/create.html',
        filter: ['add_deal']
    },
    // Deal Edit
    'deal/edit/id': {
        controller: 'modules/deal/deal/deal.js@deal_edit',
        url: 'deal/edit/:id',
        template: 'modules/deal/deal/create.html',
        filter: ['edit_deal']
    },
    // Deal View
    'deal/view/id': {
        controller: 'modules/deal/deal/deal.js@deal_view',
        url: 'deal/view/:id',
        template: 'modules/deal/deal/view.html',
        filter: ['read_deal']
    },
    // Profile
    'profile': {
        controller: 'modules/profile/profile.js@index',
        url: 'profile',
        template: 'modules/profile/profile.html',
        filter: ['manage_company_profile']
    },
    'profile/edit': {
        controller: 'modules/profile/profile.js@edit',
        url: 'profile/edit',
        template: 'modules/profile/create.html',
        filter: ['manage_company_profile']
    },
    // Custom Fields
    'custom_field/module': {
        controller: 'modules/custom_field/custom_field.js@index',
        url: 'custom_field/:module',
        template: 'modules/custom_field/custom_field.html',
        filter: ['manage_custom_field']
    },
    // Settings
    'settings': {
        controller: 'modules/settings/settings.js@index',
        url: 'settings',
        template: 'modules/settings/settings.html',
        filter: ['manage_setting']
    },
    // Subscription
    'subscription': {
        controller: 'modules/subscription/subscription.js@index',
        url: 'subscription',
        template: 'modules/subscription/subscription.html',
        filter: ['manage_subscription']
    },
    // Worker
    'worker': {
        controller: 'modules/worker/worker.js@worker_index',
        url: 'worker',
        template: 'modules/worker/worker.html',
        filter: ['manage_worker']
    },
    // Worker Create
    'worker/create': {
        controller: 'modules/worker/worker.js@worker_create',
        url: 'worker/create',
        template: 'modules/worker/create.html',
        filter: ['manage_worker']
    },
    // Worker View
    'worker/view/id': {
        controller: 'modules/worker/worker.js@worker_view',
        url: 'worker/view/:id',
        template: 'modules/worker/view.html',
        filter: ['manage_worker']
    },
    // Worker Edit
    'worker/edit/id': {
        controller: 'modules/worker/worker.js@worker_edit',
        url: 'worker/edit/:id',
        template: 'modules/worker/create.html',
        filter: ['manage_worker']
    },
    // Warehouse
    'warehouse': {
        controller: 'modules/warehouse/warehouse.js@index',
        url: 'warehouse',
        template: 'modules/warehouse/warehouse.html',
        filter: ['manage_warehouse']
    },
    // Warehouse Create
    'warehouse/create': {
        controller: 'modules/warehouse/warehouse.js@create',
        url: 'warehouse/create',
        template: 'modules/warehouse/create.html',
        filter: ['manage_warehouse']
    },
    // Warehouse Edit
    'warehouse/edit/id': {
        controller: 'modules/warehouse/warehouse.js@edit',
        url: 'warehouse/edit/:id',
        template: 'modules/warehouse/create.html',
        filter: ['manage_warehouse']
    },
    // Purchase Order
    'purchaseOrder': {
        controller: 'modules/purchaseOrder/purchaseOrder.js@purchase_order_index',
        url: 'purchaseOrder',
        template: 'modules/purchaseOrder/purchaseOrder.html',
        filter: ['read_purchase_order']
    },
    // Purchase Order Create
    'purchaseOrder/create': {
        controller: 'modules/purchaseOrder/purchaseOrder.js@purchase_order_create',
        url: 'purchaseOrder/create',
        template: 'modules/purchaseOrder/create.html',
        filter: ['add_purchase_order']
    },
    // Purchase Order Edit
    'purchaseOrder/edit/id': {
        controller: 'modules/purchaseOrder/purchaseOrder.js@purchase_order_edit',
        url: 'purchaseOrder/edit/:id',
        template: 'modules/purchaseOrder/create.html',
        filter: ['edit_purchase_order']
    },
    // Purchase Order Create
    'purchaseOrder/view/id': {
        controller: 'modules/purchaseOrder/purchaseOrder.js@purchase_order_view',
        url: 'purchaseOrder/view/:id',
        template: 'modules/purchaseOrder/view.html',
        filter: ['read_purchase_order']
    },
    // Job
    'job': {
        controller: 'modules/job/job.js@job_index',
        url: 'job',
        template: 'modules/job/job.html',
        filter: ['read_job']
    },
    // Job Create
    'job/create': {
        controller: 'modules/job/job.js@job_create',
        url: 'job/create',
        template: 'modules/job/create.html',
        filter: ['manage_job']
    },
    // Job Edit
    'job/edit/id': {
        controller: 'modules/job/job.js@job_edit',
        url: 'job/edit/:id',
        template: 'modules/job/create.html',
        filter: ['manage_job']
    },
    // Job Create
    'job/view/id': {
        controller: 'modules/job/job.js@job_view',
        url: 'job/view/:id',
        template: 'modules/job/view.html',
        filter: ['read_job']
    },

    // Production  
    'production': {
        controller: 'modules/ims/production/production.js@production_index',
        url: 'production',
        template: 'modules/ims/production/production.html',
        filter: ['manage_production']
    },
    // Production  Create
    'production/create': {
        controller: 'modules/ims/production/production.js@production_create',
        url: 'production/create',
        template: 'modules/ims/production/create.html',
        filter: ['manage_production']
    },
    // Production  Edit
    'production/edit/id': {
        controller: 'modules/ims/production/production.js@production_edit',
        url: 'production/edit/:id',
        template: 'modules/ims/production/create.html',
        filter: ['manage_production']
    },
    // Production  View
    'production/view/id': {
        controller: 'modules/ims/production/production.js@production_view',
        url: 'production/view/:id',
        template: 'modules/ims/production/view.html',
        filter: ['manage_production']
    },
    // Production  View
    'production/productPartsMapping/id': {
        controller: 'modules/ims/production/production.js@production_product_parts_mapping',
        url: 'production/productPartsMapping/:id',
        template: 'modules/ims/production/product_parts_mapping.html',
        filter: ['manage_production']
    },


    // Grn 
    'grn': {
        controller: 'modules/ims/grn/grn.js@grn_index',
        url: 'grn',
        template: 'modules/ims/grn/grn.html',
        filter: ['manage_grn']
    },
    // Grn  Create
    'grn/create': {
        controller: 'modules/ims/grn/grn.js@grn_create',
        url: 'grn/create',
        template: 'modules/ims/grn/create.html',
        filter: ['manage_grn']
    },
    // Grn  Edit
    'grn/edit/id': {
        controller: 'modules/ims/grn/grn.js@grn_edit',
        url: 'grn/edit/:id',
        template: 'modules/ims/grn/create.html',
        filter: ['manage_grn']
    },
    // Grn  View
    'grn/view/id': {
        controller: 'modules/ims/grn/grn.js@grn_view',
        url: 'grn/view/:id',
        template: 'modules/ims/grn/view.html',
        filter: ['manage_grn']
    },

    // Delivery Receipt
    'deliveryReceipt': {
        controller: 'modules/ims/deliveryReceipt/deliveryReceipt.js@delivery_receipt_index',
        url: 'deliveryReceipt',
        template: 'modules/ims/deliveryReceipt/deliveryReceipt.html',
        filter: ['manage_delivery_receipt']
    },
    // Delivery Receipt Create
    'deliveryReceipt/create': {
        controller: 'modules/ims/deliveryReceipt/deliveryReceipt.js@delivery_receipt_create',
        url: 'deliveryReceipt/create',
        template: 'modules/ims/deliveryReceipt/create.html',
        filter: ['manage_delivery_receipt']
    },
    // Delivery Receipt Edit
    'deliveryReceipt/edit/id': {
        controller: 'modules/ims/deliveryReceipt/deliveryReceipt.js@delivery_receipt_edit',
        url: 'deliveryReceipt/edit/:id',
        template: 'modules/ims/deliveryReceipt/create.html',
        filter: ['manage_delivery_receipt']
    },
    // Delivery Receipt View
    'deliveryReceipt/view/id': {
        controller: 'modules/ims/deliveryReceipt/deliveryReceipt.js@delivery_receipt_view',
        url: 'deliveryReceipt/view/:id',
        template: 'modules/ims/deliveryReceipt/view.html',
        filter: ['manage_delivery_receipt']
    },

    // Goods Out
    'goodsOut': {
        controller: 'modules/ims/goodsOut/goodsOut.js@goods_out_index',
        url: 'goodsOut',
        template: 'modules/ims/goodsOut/goodsOut.html',
        filter: ['manage_goods_out']
    },
    // Goods Out Create
    'goodsOut/create': {
        controller: 'modules/ims/goodsOut/goodsOut.js@goods_out_create',
        url: 'goodsOut/create',
        template: 'modules/ims/goodsOut/create.html',
        filter: ['manage_goods_out']
    },
    // Goods Out Edit
    'goodsOut/edit/id': {
        controller: 'modules/ims/goodsOut/goodsOut.js@goods_out_edit',
        url: 'goodsOut/edit/:id',
        template: 'modules/ims/goodsOut/create.html',
        filter: ['manage_goods_out']
    },
    // Goods Out View
    'goodsOut/view/id': {
        controller: 'modules/ims/goodsOut/goodsOut.js@goods_out_view',
        url: 'goodsOut/view/:id',
        template: 'modules/ims/goodsOut/view.html',
        filter: ['manage_goods_out']
    },

    // Goods In  
    'goodsIn': {
        controller: 'modules/ims/goodsIn/goodsIn.js@goods_in_index',
        url: 'goodsIn',
        template: 'modules/ims/goodsIn/goodsIn.html',
        filter: ['manage_goods_in']
    },
    // Goods In  Create
    'goodsIn/create': {
        controller: 'modules/ims/goodsIn/goodsIn.js@goods_in_create',
        url: 'goodsIn/create',
        template: 'modules/ims/goodsIn/create.html',
        filter: ['manage_goods_in']
    },
    // Goods In  Edit
    'goodsIn/edit/id': {
        controller: 'modules/ims/goodsIn/goodsIn.js@goods_in_edit',
        url: 'goodsIn/edit/:id',
        template: 'modules/ims/goodsIn/create.html',
        filter: ['manage_goods_in']
    },
    // Goods In  View
    'goodsIn/view/id': {
        controller: 'modules/ims/goodsIn/goodsIn.js@goods_in_view',
        url: 'goodsIn/view/:id',
        template: 'modules/ims/goodsIn/view.html',
        filter: ['manage_goods_in']
    },

    // Warehouse Transfer
    'warehouseTransfer': {
        controller: 'modules/ims/warehouseTransfer/warehouseTransfer.js@warehouse_transfer_index',
        url: 'warehouseTransfer',
        template: 'modules/ims/warehouseTransfer/warehouseTransfer.html',
        filter: ['manage_warehouse_transfer']
    },
    // Warehouse Transfer Create
    'warehouseTransfer/create': {
        controller: 'modules/ims/warehouseTransfer/warehouseTransfer.js@warehouse_transfer_create',
        url: 'warehouseTransfer/create',
        template: 'modules/ims/warehouseTransfer/create.html',
        filter: ['manage_warehouse_transfer']
    },
    // Warehouse Transfer Edit
    'warehouseTransfer/edit/id': {
        controller: 'modules/ims/warehouseTransfer/warehouseTransfer.js@warehouse_transfer_edit',
        url: 'warehouseTransfer/edit/:id',
        template: 'modules/ims/warehouseTransfer/create.html',
        filter: ['manage_warehouse_transfer']
    },
    // Warehouse Transfer View
    'warehouseTransfer/view/id': {
        controller: 'modules/ims/warehouseTransfer/warehouseTransfer.js@warehouse_transfer_view',
        url: 'warehouseTransfer/view/:id',
        template: 'modules/ims/warehouseTransfer/view.html',
        filter: ['manage_warehouse_transfer']
    },

    //Warehouse Stock Report
    'warehouseStockReport': {
        controller: 'modules/ims/warehouseStockReport/warehouseStockReport.js@index',
        url: 'warehouseStockReport',
        template: 'modules/ims/warehouseStockReport/warehouseStockReport.html',
        filter: ['warehouse_stock_report']
    },

    // Product Transaction Report
    'productTransactionReport': {
        controller: 'modules/report/productTransactionReport/productTransactionReport.js@index',
        url: 'productTransactionReport',
        template: 'modules/report/productTransactionReport/productTransactionReport.html',
        filter: ['product_transaction_report']
    },

    // Job Consumption Report
    'jobConsumptionReport': {
        controller: 'modules/report/jobConsumptionReport/jobConsumptionReport.js@job_report_index',
        url: 'jobConsumptionReport',
        template: 'modules/report/jobConsumptionReport/jobConsumptionReport.html',
        filter: ['job_consumption_report']
    },
    // Stock Adjustment  
    'stockAdjustment': {
        controller: 'modules/ims/stockAdjustment/stockAdjustment.js@index',
        url: 'stockAdjustment',
        template: 'modules/ims/stockAdjustment/stockAdjustment.html',
        filter: ['manage_stock_adjustment']
    },
    // Stock Adjustment Create
    'stockAdjustment/create': {
        controller: 'modules/ims/stockAdjustment/stockAdjustment.js@create',
        url: 'stockAdjustment/create',
        template: 'modules/ims/stockAdjustment/create.html',
        filter: ['manage_stock_adjustment']
    },
    // Stock Adjustment Edit
    'stockAdjustment/edit/id': {
        controller: 'modules/ims/stockAdjustment/stockAdjustment.js@edit',
        url: 'stockAdjustment/edit/:id',
        template: 'modules/ims/stockAdjustment/create.html',
        filter: ['manage_stock_adjustment']
    },
    // Stock Adjustment View
    'stockAdjustment/view/id': {
        controller: 'modules/ims/stockAdjustment/stockAdjustment.js@view',
        url: 'stockAdjustment/view/:id',
        template: 'modules/ims/stockAdjustment/view.html',
        filter: ['manage_stock_adjustment']
    },
    // Pending Job Report
    'pendingJobReport': {
        controller: 'modules/report/pendingJobReport/pendingJobReport.js@pendingJobReport_index',
        url: 'pendingJobReport',
        template: 'modules/report/pendingJobReport/pendingJobReport.html',
        filter: ['pending_job_report']
    },
    // Orderwise Delivery Report
    'poOrderwiseDeliveryReport': {
        controller: 'modules/report/poOrderwiseDeliveryReport/poOrderwiseDeliveryReport.js@poOrderwiseDeliveryReport_index',
        url: 'poOrderwiseDeliveryReport',
        template: 'modules/report/poOrderwiseDeliveryReport/poOrderwiseDeliveryReport.html',
        filter: ['po_orderwise_delivery_report']
    },
    // Productwise Delivery Report
    'poProductwiseDeliveryReport': {
        controller: 'modules/report/poProductwiseDeliveryReport/poProductwiseDeliveryReport.js@index',
        url: 'poProductwiseDeliveryReport',
        template: 'modules/report/poProductwiseDeliveryReport/poProductwiseDeliveryReport.html',
        filter: ['po_productwise_delivery_report']
    },
    'poProductwiseDeliveryReport/view/id': {
        controller: 'modules/report/poProductwiseDeliveryReport/poProductwiseDeliveryReport.js@view',
        url: 'poProductwiseDeliveryReport/view/:id',
        template: 'modules/report/poProductwiseDeliveryReport/view.html',
        filter: ['po_productwise_delivery_report']
    },
    // Leave Type
    'leaveType': {
        controller: 'modules/leave/leaveType/leaveType.js@index',
        url: 'leaveType',
        template: 'modules/leave/leaveType/leaveType.html',
        filter: ['manage_leave_type']
    },
    // Leave Type Create
    'leaveType/create': {
        controller: 'modules/leave/leaveType/leaveType.js@create',
        url: 'leaveType/create',
        template: 'modules/leave/leaveType/create.html',
        filter: ['manage_leave_type']
    },
    // Leave Type Edit
    'leaveType/edit/id': {
        controller: 'modules/leave/leaveType/leaveType.js@edit',
        url: 'leaveType/edit/:id',
        template: 'modules/leave/leaveType/create.html',
        filter: ['manage_leave_type']
    },
    // Holiday
    'holiday': {
        controller: 'modules/holiday/holiday.js@index',
        url: 'holiday',
        template: 'modules/holiday/holiday.html',
        filter: ['manage_holiday']
    },
    // Leave
    'leave': {
        controller: 'modules/leave/leave/leave.js@leave_index',
        url: 'leave',
        template: 'modules/leave/leave/leave.html',
        filter: ['manage_leave']
    },
    // Leave Create
    'leave/create': {
        controller: 'modules/leave/leave/leave.js@leave_create',
        url: 'leave/create',
        template: 'modules/leave/leave/create.html',
        filter: ['manage_leave']
    },
    // Leave Edit
    'leave/edit/id': {
        controller: 'modules/leave/leave/leave.js@leave_edit',
        url: 'leave/edit/:id',
        template: 'modules/leave/leave/create.html',
        filter: ['manage_leave']
    },
    // Leave View
    'leave/view/id': {
        controller: 'modules/leave/leave/leave.js@leave_view',
        url: 'leave/view/:id',
        template: 'modules/leave/leave/view.html',
        filter: ['manage_leave']
    },

    // Outstanding Report
    'outstandingReport': {
        controller: 'modules/report/outstandingReport/outstandingReport.js@index',
        url: 'outstandingReport',
        template: 'modules/report/outstandingReport/outstandingReport.html',
        filter: ['outstanding_report']
    },

    // Process
    'process': {
        controller: 'modules/process/process.js@index',
        url: 'process',
        template: 'modules/process/process.html',
        filter: ['manage_process']
    },
    // Process Create
    'process/create': {
        controller: 'modules/process/process.js@create',
        url: 'process/create',
        template: 'modules/process/create.html',
        filter: ['manage_process']
    },
    // Process Edit
    'process/edit/id': {
        controller: 'modules/process/process.js@edit',
        url: 'process/edit/:id',
        template: 'modules/process/create.html',
        filter: ['manage_process']
    },

    // smsTemplate
    'smsTemplate': {
        controller: 'modules/sms/smsTemplate/smsTemplate.js@index',
        url: 'smsTemplate',
        template: 'modules/sms/smsTemplate/smsTemplate.html',
        filter: ['manage_sms_template']
    },
    // smsTemplate Create
    'smsTemplate/create': {
        controller: 'modules/sms/smsTemplate/smsTemplate.js@create',
        url: 'smsTemplate/create',
        template: 'modules/sms/smsTemplate/create.html',
        filter: ['manage_sms_template']
    },
    // smsTemplate Edit
    'smsTemplate/edit/id': {
        controller: 'modules/sms/smsTemplate/smsTemplate.js@edit',
        url: 'smsTemplate/edit/:id',
        template: 'modules/sms/smsTemplate/create.html',
        filter: ['manage_sms_template']
    },

    // mailTemplate
    'mailTemplate': {
        controller: 'modules/mail/mailTemplate/mailTemplate.js@index',
        url: 'mailTemplate',
        template: 'modules/mail/mailTemplate/mailTemplate.html',
        filter: ['manage_mail_template']
    },
    // mailTemplate Create
    'mailTemplate/create': {
        controller: 'modules/mail/mailTemplate/mailTemplate.js@create',
        url: 'mailTemplate/create',
        template: 'modules/mail/mailTemplate/create.html',
        filter: ['manage_mail_template']
    },
    // mailTemplate Edit
    'mailTemplate/edit/id': {
        controller: 'modules/mail/mailTemplate/mailTemplate.js@edit',
        url: 'mailTemplate/edit/:id',
        template: 'modules/mail/mailTemplate/create.html',
        filter: ['manage_mail_template']
    },

    //terms & conditions
    'terms': {
        controller: 'modules/terms/terms.js@termsController',
        url: 'terms',
        template: 'modules/terms/terms.html',
        filter: ['manage_tnc']
    },

    //Prefix
    'prefix': {
        controller: 'modules/prefix/prefix.js@prefixController',
        url: 'prefix',
        template: 'modules/prefix/prefix.html',
        filter: ['manage_prefix']
    },

    //Template
    'template': {
        controller: 'modules/template/template.js@index',
        url: 'template',
        template: 'modules/template/template.html',
        filter: ['manage_template']
    },

    //Template edit
    'template/edit/id': {
        controller: 'modules/template/template.js@edit',
        url: 'template/edit/:id',
        template: 'modules/template/create.html',
        filter: ['manage_template']
    },

    // Work Profile
    'workProfile': {
        controller: 'modules/workProfile/workProfile.js@index',
        url: 'workProfile',
        template: 'modules/workProfile/workProfile.html',
        filter: ['manage_work_profile']
    },
    // Work Profile Create
    'workProfile/create': {
        controller: 'modules/workProfile/workProfile.js@create',
        url: 'workProfile/create',
        template: 'modules/workProfile/create.html',
        filter: ['manage_work_profile']
    },
    // Work Profile Edit
    'workProfile/edit/id': {
        controller: 'modules/workProfile/workProfile.js@edit',
        url: 'workProfile/edit/:id',
        template: 'modules/workProfile/create.html',
        filter: ['manage_work_profile']
    },
    // Expense Report
    'expenseReport': {
        controller: 'modules/report/expenseReport/expenseReport.js@index',
        url: 'expenseReport',
        template: 'modules/report/expenseReport/expenseReport.html',
        filter: ['expense_report']
    },

    // Dispatch
    'dispatch': {
        controller: 'modules/dispatch/dispatch.js@dispatch_index',
        url: 'dispatch',
        template: 'modules/dispatch/dispatch.html',
        filter: ['manage_multiorder_dispatch']
    },
    // Dispatch Create
    'dispatch/create': {
        controller: 'modules/dispatch/dispatch.js@dispatch_create',
        url: 'dispatch/create',
        template: 'modules/dispatch/create.html',
        filter: ['manage_multiorder_dispatch']
    },
    // Dispatch Edit
    'dispatch/edit/id': {
        controller: 'modules/dispatch/dispatch.js@dispatch_edit',
        url: 'dispatch/edit/:id',
        template: 'modules/dispatch/create.html',
        filter: ['manage_multiorder_dispatch']
    },
    // Dispatch View
    'dispatch/view/id': {
        controller: 'modules/dispatch/dispatch.js@dispatch_view',
        url: 'dispatch/view/:id',
        template: 'modules/dispatch/view.html',
        filter: ['manage_multiorder_dispatch']
    },

    // Invoice
    'invoice': {
        controller: 'modules/invoice/invoice.js@invoice_index',
        url: 'invoice',
        template: 'modules/invoice/invoice.html',
        filter: ['read_invoice']
    },
    // Invoice Create
    'invoice/create': {
        controller: 'modules/invoice/invoice.js@invoice_create',
        url: 'invoice/create',
        template: 'modules/invoice/create.html',
        filter: ['add_invoice']
    },
    // Invoice Edit
    'invoice/edit/id': {
        controller: 'modules/invoice/invoice.js@invoice_edit',
        url: 'invoice/edit/:id',
        template: 'modules/invoice/create.html',
        filter: ['edit_invoice']
    },
    // Invoice View
    'invoice/view/id': {
        controller: 'modules/invoice/invoice.js@invoice_view',
        url: 'invoice/view/:id',
        template: 'modules/invoice/view.html',
        filter: ['read_invoice']
    },

    // Quotation
    'quotation': {
        controller: 'modules/saleQuotation/saleQuotation.js@sale_quotation_index',
        url: 'quotation',
        template: 'modules/saleQuotation/saleQuotation.html',
        filter: ['read_sale_quotation']
    },
    // Quotation Create
    'quotation/create': {
        controller: 'modules/saleQuotation/saleQuotation.js@sale_quotation_create',
        url: 'quotation/create',
        template: 'modules/saleQuotation/create.html',
        filter: ['add_sale_quotation']
    },
    // Quotation Edit
    'quotation/edit/id': {
        controller: 'modules/saleQuotation/saleQuotation.js@sale_quotation_edit',
        url: 'quotation/edit/:id',
        template: 'modules/saleQuotation/create.html',
        filter: ['edit_sale_quotation']
    },
    // Quotation Create
    'quotation/view/id': {
        controller: 'modules/saleQuotation/saleQuotation.js@sale_quotation_view',
        url: 'quotation/view/:id',
        template: 'modules/saleQuotation/view.html',
        filter: ['read_sale_quotation']
    },

    // Estimate    
    'estimate': {
        controller: 'modules/estimate/estimate.js@estimate_index',
        url: 'estimate',
        template: 'modules/estimate/estimate.html',
        filter: ['read_estimate']
    },
    // Estimate Create
    'estimate/create': {
        controller: 'modules/estimate/estimate.js@estimate_create',
        url: 'estimate/create',
        template: 'modules/estimate/create.html',
        filter: ['add_estimate']
    },
    // estimate Edit
    'estimate/edit/id': {
        controller: 'modules/estimate/estimate.js@estimate_edit',
        url: 'estimate/edit/:id',
        template: 'modules/estimate/create.html',
        filter: ['edit_estimate']
    },
    // estimate Create
    'estimate/view/id': {
        controller: 'modules/estimate/estimate.js@estimate_view',
        url: 'estimate/view/:id',
        template: 'modules/estimate/view.html',
        filter: ['read_estimate']
    },

    // Location
    'location': {
        controller: 'modules/location/location.js@index',
        url: 'location',
        template: 'modules/location/location.html',
        filter: ['manage_location']
    },
    // Location Create
    'location/create': {
        controller: 'modules/location/location.js@create',
        url: 'location/create',
        template: 'modules/location/create.html',
        filter: ['manage_location']
    },
    // Location Edit
    'location/edit/id': {
        controller: 'modules/location/location.js@edit',
        url: 'location/edit/:id',
        template: 'modules/location/create.html',
        filter: ['manage_location']
    },

    // Geofencing
    'geofencing': {
        controller: 'modules/location/location.js@geofencing',
        url: 'location/geofencing',
        template: 'modules/location/geofencing.html'
    },

    // Target Type
    'targetType': {
        controller: 'modules/targetType/targetType.js@index',
        url: 'targetType',
        template: 'modules/targetType/targetType.html',
        filter: ['manage_target_type']
    },
    // Target Type Create
    'targetType/create': {
        controller: 'modules/targetType/targetType.js@create',
        url: 'targetType/create',
        template: 'modules/targetType/create.html',
        filter: ['manage_target_type']
    },
    // Target Type Edit
    'targetType/edit/id': {
        controller: 'modules/targetType/targetType.js@edit',
        url: 'targetType/edit/:id',
        template: 'modules/targetType/create.html',
        filter: ['manage_target_type']
    },

    // Sales Return
    'salesReturn': {
        controller: 'modules/salesReturn/salesReturn.js@sales_return_index',
        url: 'salesReturn',
        template: 'modules/salesReturn/salesReturn.html',
        filter: ['read_sales_return']
    },
    // Sales Return Create
    'salesReturn/create': {
        controller: 'modules/salesReturn/salesReturn.js@sales_return_create',
        url: 'salesReturn/create',
        template: 'modules/salesReturn/create.html',
        filter: ['add_sales_return']
    },
    // Sales Return Edit
    'salesReturn/edit/id': {
        controller: 'modules/salesReturn/salesReturn.js@sales_return_edit',
        url: 'salesReturn/edit/:id',
        template: 'modules/salesReturn/create.html',
        filter: ['edit_sales_return']
    },
    // Sales Return View
    'salesReturn/view/id': {
        controller: 'modules/salesReturn/salesReturn.js@sales_return_view',
        url: 'salesReturn/view/:id',
        template: 'modules/salesReturn/view.html',
        filter: ['read_sales_return']
    },

    // Complaint Type
    'complaintType': {
        controller: 'modules/complaint/complaintType/complaintType.js@index',
        url: 'complaintType',
        template: 'modules/complaint/complaintType/complaintType.html',
        filter: ['manage_complaint_type']
    },
    // Complaint Type Create
    'complaintType/create': {
        controller: 'modules/complaint/complaintType/complaintType.js@create',
        url: 'complaintType/create',
        template: 'modules/complaint/complaintType/create.html',
        filter: ['manage_complaint_type']
    },
    // Complaint Type Edit
    'complaintType/edit/id': {
        controller: 'modules/complaint/complaintType/complaintType.js@edit',
        url: 'complaintType/edit/:id',
        template: 'modules/complaint/complaintType/create.html',
        filter: ['manage_complaint_type']
    },

    // Complaint Feedback Type
    'complaintFeedbackType': {
        controller: 'modules/complaint/complaintFeedbackType/complaintFeedbackType.js@index',
        url: 'complaintFeedbackType',
        template: 'modules/complaint/complaintFeedbackType/complaintFeedbackType.html',
        filter: ['manage_complaint_feedback_type']
    },
    // Complaint Feedback Type Create
    'complaintFeedbackType/create': {
        controller: 'modules/complaint/complaintFeedbackType/complaintFeedbackType.js@create',
        url: 'complaintFeedbackType/create',
        template: 'modules/complaint/complaintFeedbackType/create.html',
        filter: ['manage_complaint_feedback_type']
    },
    // Complaint Feedback Type Edit
    'complaintFeedbackType/edit/id': {
        controller: 'modules/complaint/complaintFeedbackType/complaintFeedbackType.js@edit',
        url: 'complaintFeedbackType/edit/:id',
        template: 'modules/complaint/complaintFeedbackType/create.html',
        filter: ['manage_complaint_feedback_type']
    },

    // Complaint
    'complaint': {
        controller: 'modules/complaint/complaint/complaint.js@complaint_index',
        url: 'complaint',
        template: 'modules/complaint/complaint/complaint.html',
        filter: ['read_complaint']
    },
    // Complaint Create
    'complaint/create': {
        controller: 'modules/complaint/complaint/complaint.js@complaint_create',
        url: 'complaint/create',
        template: 'modules/complaint/complaint/create.html',
        filter: ['add_complaint']
    },
    // Complaint Edit
    'complaint/edit/id': {
        controller: 'modules/complaint/complaint/complaint.js@complaint_edit',
        url: 'complaint/edit/:id',
        template: 'modules/complaint/complaint/create.html',
        filter: ['edit_complaint']
    },
    // Complaint View
    'complaint/view/id': {
        controller: 'modules/complaint/complaint/complaint.js@complaint_view',
        url: 'complaint/view/:id',
        template: 'modules/complaint/complaint/view.html',
        filter: ['read_complaint']
    },

    // Productive Visit Report
    'productiveVisitReport': {
        controller: 'modules/report/productiveVisitReport/productiveVisitReport.js@index',
        url: 'productiveVisitReport',
        template: 'modules/report/productiveVisitReport/productiveVisitReport.html',
        filter: ['productive_visit_report']
    },

    // Brand
    'brand': {
        controller: 'modules/brand/brand.js@index',
        url: 'brand',
        template: 'modules/brand/brand.html',
        filter: ['manage_brand']
    },
    // Brand Add
    'brand/create': {
        controller: 'modules/brand/brand.js@create',
        url: 'brand/create',
        template: 'modules/brand/create.html',
        filter: ['manage_brand']
    },
    // Brand Edit
    'brand/edit/id': {
        controller: 'modules/brand/brand.js@edit',
        url: 'brand/edit/:id',
        template: 'modules/brand/create.html',
        filter: ['manage_brand']
    },

    //Media
    'media': {
        controller: 'modules/media/media.js@index',
        url: 'media',
        template: 'modules/media/media.html',
        filter: ['manage_media']
    },

    //Media with id
    'media/id': {
        controller: 'modules/media/media.js@index',
        url: 'media/:id',
        template: 'modules/media/media.html',
        filter: ['manage_media']
    },

    // orderExport Report
    'orderExportReport': {
        controller: 'modules/report/orderExportReport/orderExportReport.js@index',
        url: 'orderExportReport',
        template: 'modules/report/orderExportReport/orderExportReport.html',
        filter: []
    },
    // Cron Log
    '151137/cronLog': {
        controller: 'modules/plugin/151137/cronLog/cronLog.js@index',
        url: '151137/cronLog',
        template: 'modules/plugin/151137/cronLog/cronLog.html',
        filter: ['enable_plugin_151137']
    },
    // Cron Log
    '122181/cronLog': {
        controller: 'modules/plugin/122181/cronLog/cronLog.js@index',
        url: '122181/cronLog',
        template: 'modules/plugin/122181/cronLog/cronLog.html',
        filter: ['enable_plugin_122181']
    },
    // Cron Log
    '998755/cronLog': {
        controller: 'modules/plugin/998755/cronLog/cronLog.js@cron_log_index',
        url: '998755/cronLog',
        template: 'modules/plugin/998755/cronLog/cronLog.html',
        filter: ['enable_cron_log_998755']
    },
    // user warehouse Log
    '684301/userWarehouse': {
        controller: 'modules/plugin/684301/userWarehouse/userWarehouse.js@index',
        url: '684301/userWarehouse',
        template: 'modules/plugin/684301/userWarehouse/userWarehouse.html',
        filter: ['plugin_manage_user_warehouse_684301']
    },
    // Warehouse Create
    '684301/userWarehouse/create': {
        controller: 'modules/plugin/684301/userWarehouse/userWarehouse.js@create',
        url: 'userWarehouse/create',
        template: 'modules/plugin/684301/userWarehouse/create.html',
        filter: ['plugin_manage_user_warehouse_684301']
    },
    // Warehouse Edit
    '684301/userWarehouse/warehouse/edit/id': {
        controller: 'modules/plugin/684301/userWarehouse/userWarehouse.js@edit',
        url: 'userWarehouse/edit/:id',
        template: 'modules/plugin/684301/userWarehouse/create.html',
        filter: ['plugin_manage_user_warehouse_684301']
    },
    // fetchOutstanding
    '840944/requestLog': {
        controller: 'modules/plugin/840944/requestLog/requestLog.js@request_log_index',
        url: '840944/requestLog',
        template: 'modules/plugin/840944/requestLog/requestLog.html',
        filter: ['request_log_840944']
    },
    // fetchOutstanding
    '840944/fetchPendingSalesOrder': {
        controller: 'modules/plugin/840944/fetchPendingSalesOrder/fetchPendingSalesOrder.js@fetch_outstanding_log_index',
        url: '840944/fetchPendingSalesOrder',
        template: 'modules/plugin/840944/fetchPendingSalesOrder/fetchPendingSalesOrder.html',
        filter: ['fetch_pending_sales_order_840944']
    },
    // Form
    'form': {
        controller: 'modules/form/form.js@form_index',
        url: 'form',
        template: 'modules/form/form.html',
        filter: ['manage_form']
    },
    // Form Add
    'form/create': {
        controller: 'modules/form/form.js@form_create',
        url: 'form/create',
        template: 'modules/form/create.html',
        filter: ['manage_form']
    },
    // Form Edit
    'form/edit/id': {
        controller: 'modules/form/form.js@form_edit',
        url: 'form/edit/:id',
        template: 'modules/form/create.html',
        filter: ['manage_form']
    },
    // Form Workflow
    'form/form_code/workFlow': {
        controller: 'modules/form/form.js@form_work_flow',
        url: 'form/:form_code/workFlow',
        template: 'modules/form/form_work_flow.html',
        filter: ['edit_form_:form_code']
    },
    // From Data List
    'formData/form_code': {
        controller: 'modules/form/form.js@form_data_index',
        url: 'formData/:form_code',
        template: 'modules/form/form_data.html',
        filter: ['manage_form']
    },
    // From Data Create
    'formData/form_code/create': {
        controller: 'modules/form/form.js@form_data_create',
        url: 'formData/:form_code/create',
        template: 'modules/form/form_data_create.html',
        filter: ['add_form_:form_code']
    },
    // From Data Edit
    'formData/form_code/edit/id': {
        controller: 'modules/form/form.js@form_data_edit',
        url: 'formData/:form_code/edit/:id',
        template: 'modules/form/form_data_create.html',
        filter: ['edit_form_:form_code']
    },
    // From Data View
    'formData/form_code/view/id': {
        controller: 'modules/form/form.js@form_data_view',
        url: 'formData/:form_code/view/:id',
        template: 'modules/form/form_data_view.html',
        filter: ['read_form_:form_code']
    },
    // Coupon
    '396482/coupon': {
        controller: 'modules/plugin/396482/coupon/coupon.js@coupon_index',
        url: '396482/coupon',
        template: 'modules/plugin/396482/coupon/coupon.html',
        filter: ['read_coupon_396482']
    },
    // coupon Add
    '396482/coupon/create': {
        controller: 'modules/plugin/396482/coupon/coupon.js@coupon_create',
        url: '396482/coupon/create',
        template: 'modules/plugin/396482/coupon/create.html',
        filter: ['add_coupon_396482']
    },
    // coupon Add Multiple
    '396482/coupon/createMultiple': {
        controller: 'modules/plugin/396482/coupon/coupon.js@coupon_create',
        url: '396482/coupon/createMultiple',
        template: 'modules/plugin/396482/coupon/create_multiple.html',
        filter: ['add_coupon_396482']
    },
    // Coupon Edit
    '396482/coupon/edit/id': {
        controller: 'modules/plugin/396482/coupon/coupon.js@coupon_edit',
        url: '396482/coupon/edit/:id',
        template: 'modules/plugin/396482/coupon/create.html',
        filter: ['edit_coupon_396482']
    },
    // Contact Type
    '396482/contactType': {
        controller: 'modules/plugin/396482/contactType/contactType.js@contact_type_index',
        url: '396482/contactType',
        template: 'modules/plugin/396482/contactType/contactType.html',
        filter: ['manage_contact_type_396482']
    },
    // contact type Add
    '396482/contactType/create': {
        controller: 'modules/plugin/396482/contactType/contactType.js@contact_type_create',
        url: '396482/contactType/create',
        template: 'modules/plugin/396482/contactType/create.html',
        filter: ['manage_contact_type_396482']
    },
    // contact type Edit
    '396482/contactType/edit/id': {
        controller: 'modules/plugin/396482/contactType/contactType.js@contact_type_edit',
        url: '396482/contactType/edit/:id',
        template: 'modules/plugin/396482/contactType/create.html',
        filter: ['manage_contact_type_396482']
    },
    // Contact
    '396482/contact': {
        controller: 'modules/plugin/396482/contact/contact.js@contact_index',
        url: '396482/contact',
        template: 'modules/plugin/396482/contact/contact.html',
        filter: ['read_contact_396482']
    },
    // contact Add
    '396482/contact/create': {
        controller: 'modules/plugin/396482/contact/contact.js@contact_create',
        url: '396482/contact/create',
        template: 'modules/plugin/396482/contact/create.html',
        filter: ['add_contact_396482']
    },
    // contact Edit
    '396482/contact/edit/id': {
        controller: 'modules/plugin/396482/contact/contact.js@contact_edit',
        url: '396482/contact/edit/:id',
        template: 'modules/plugin/396482/contact/create.html',
        filter: ['edit_contact_396482']
    },
    // offer
    '396482/offer': {
        controller: 'modules/plugin/396482/offer/offer.js@offer_index',
        url: '396482/offer',
        template: 'modules/plugin/396482/offer/offer.html',
        filter: ['read_offer_396482']
    },
    // offer Add
    '396482/offer/create': {
        controller: 'modules/plugin/396482/offer/offer.js@offer_create',
        url: '396482/offer/create',
        template: 'modules/plugin/396482/offer/create.html',
        filter: ['add_offer_396482']
    },
    // offer Edit
    '396482/offer/edit/id': {
        controller: 'modules/plugin/396482/offer/offer.js@offer_edit',
        url: '396482/offer/edit/:id',
        template: 'modules/plugin/396482/offer/create.html',
        filter: ['edit_offer_396482']
    },
    // redeemCoupon
    '396482/redeemCoupon': {
        controller: 'modules/plugin/396482/redeemCoupon/redeemCoupon.js@redeem_coupon_index',
        url: '396482/redeemCoupon',
        template: 'modules/plugin/396482/redeemCoupon/redeemCoupon.html',
        filter: ['read_redeem_coupon_396482']
    },
    // redeemCoupon Add
    '396482/redeemCoupon/create': {
        controller: 'modules/plugin/396482/redeemCoupon/redeemCoupon.js@redeem_coupon_create',
        url: '396482/redeemCoupon/create',
        template: 'modules/plugin/396482/redeemCoupon/create.html',
        filter: ['add_redeem_coupon_396482']
    },
    // redeemCoupon Edit
    '396482/redeemCoupon/edit/id': {
        controller: 'modules/plugin/396482/redeemCoupon/redeemCoupon.js@redeem_coupon_edit',
        url: '396482/redeemCoupon/edit/:id',
        template: 'modules/plugin/396482/redeemCoupon/create.html',
        filter: ['edit_redeem_coupon_396482']
    },
    // claimHistory
    '396482/claimHistory': {
        controller: 'modules/plugin/396482/claimHistory/claimHistory.js@claim_history_index',
        url: '396482/claimHistory',
        template: 'modules/plugin/396482/claimHistory/claimHistory.html',
        filter: ['read_claim_history_396482']
    },
    // Phone Call Report
    'phoneCallReport': {
        controller: 'modules/report/phoneCallReport/phoneCallReport.js@index',
        url: 'phoneCallReport',
        template: 'modules/report/phoneCallReport/phoneCallReport.html',
        filter: ['phone_call_report']
    },

    // whatsapp template
    'whatsappTemplate': {
        controller: 'modules/whatsapp/whatsappTemplate/whatsappTemplate.js@index',
        url: 'whatsappTemplate',
        template: 'modules/whatsapp/whatsappTemplate/whatsappTemplate.html',
        filter: ['manage_whatsapp_template']
    },
    // whatsappTemplate Create
    'whatsappTemplate/create': {
        controller: 'modules/whatsapp/whatsappTemplate/whatsappTemplate.js@create',
        url: 'whatsappTemplate/create',
        template: 'modules/whatsapp/whatsappTemplate/create.html',
        filter: ['manage_whatsapp_template']
    },
    // whatsappTemplate Edit
    'whatsappTemplate/edit/id': {
        controller: 'modules/whatsapp/whatsappTemplate/whatsappTemplate.js@edit',
        url: 'whatsappTemplate/edit/:id',
        template: 'modules/whatsapp/whatsappTemplate/create.html',
        filter: ['manage_whatsapp_template']
    },
    // Account Category
    'accountCategory': {
        controller: 'modules/accountCategory/accountCategory.js@account_category_index',
        url: 'accountCategory',
        template: 'modules/accountCategory/accountCategory.html',
        filter: ['manage_account_category']
    },
    // accountCategory Add
    'accountCategory/create': {
        controller: 'modules/accountCategory/accountCategory.js@account_category_create',
        url: 'accountCategory/create',
        template: 'modules/accountCategory/create.html',
        filter: ['manage_account_category']
    },
    // accountCategory Edit
    'accountCategory/edit/id': {
        controller: 'modules/accountCategory/accountCategory.js@account_category_edit',
        url: 'accountCategory/edit/:id',
        template: 'modules/accountCategory/create.html',
        filter: ['manage_account_category']
    },
    // meta lead campaign
    'metaLeadCampaign': {
        controller: 'modules/metaLeadCampaign/metaLeadCampaign.js@meta_lead_campaign_index',
        url: 'metaLeadCampaign',
        template: 'modules/metaLeadCampaign/metaLeadCampaign.html',
        filter: ['manage_meta_lead_campaign']
    },
    // meta Lead Campaign Create
    'metaLeadCampaign/create': {
        controller: 'modules/metaLeadCampaign/metaLeadCampaign.js@meta_lead_campaign_create',
        url: 'metaLeadCampaign/create',
        template: 'modules/metaLeadCampaign/create.html',
        filter: ['manage_meta_lead_campaign']
    },
    // meta Lead Campaign Edit
    'metaLeadCampaign/edit/id': {
        controller: 'modules/metaLeadCampaign/metaLeadCampaign.js@meta_lead_campaign_edit',
        url: 'metaLeadCampaign/edit/:id',
        template: 'modules/metaLeadCampaign/create.html',
        filter: ['manage_meta_lead_campaign']
    },
    // Request Log
    'requestLog': {
        controller: 'modules/requestLog/requestLog.js@request_log_index',
        url: 'requestLog',
        template: 'modules/requestLog/requestLog.html',
        filter: ['manage_request_log']
    },
    //  Request Log View
    'requestLog/view/id': {
        controller: 'modules/requestLog/requestLog.js@request_log_view',
        url: 'requestLog/view/:id',
        template: 'modules/requestLog/view.html',
        filter: ['manage_request_log']
    },
};