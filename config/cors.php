<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Cho phép mọi method (GET/POST/PUT/DELETE/OPTIONS...)
    'allowed_methods' => ['*'],

    // Origin được phép gọi sang API (phải liệt kê cụ thể khi dùng credentials)
    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'https://localhost:3000',
        'https://127.0.0.1:3000',
    ],

    'allowed_origins_patterns' => [],

    // Header cho phép nhận từ phía client (để * cho tiện dev)
    'allowed_headers' => [
        '*',
        'RSC',
        'Next-Url',
        'Next-Router-State-Tree',
        'Next-Pathname-Index',
        'Next-Action',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-Requested-With',
    ],

    // Header sẽ được expose cho trình duyệt đọc từ response (tuỳ bạn có cần hay không)
    'exposed_headers' => [
        'Authorization',
        'XSRF-TOKEN',
    ],

    // Cache preflight (OPTIONS) 1 ngày cho nhanh
    'max_age' => 86400,

    // BẮT BUỘC bật khi dùng cookie/Sanctum (cross-site)
    'supports_credentials' => true,
];
