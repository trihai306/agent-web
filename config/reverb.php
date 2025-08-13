<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Reverb Server Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure the Reverb server settings for your application.
    | These settings control how the Reverb server operates and connects
    | to your application.
    |
    */

    'host' => env('REVERB_HOST', 'socket.lionsoftware.cloud'),
    'port' => env('REVERB_PORT', 443),
    'scheme' => env('REVERB_SCHEME', 'https'),
    'app_id' => env('REVERB_APP_ID', 'your-reverb-app-id'),
    'app_key' => env('REVERB_APP_KEY', 'xynwukcprjb0jctqndga'),
    'app_secret' => env('REVERB_APP_SECRET', 'your-reverb-secret'),
    'cluster' => env('REVERB_CLUSTER', 'mt1'),

    /*
    |--------------------------------------------------------------------------
    | SSL/TLS Configuration
    |--------------------------------------------------------------------------
    |
    | Configure SSL/TLS settings for secure WebSocket connections.
    |
    */

    'useTLS' => env('REVERB_SCHEME', 'https') === 'https',
    'encrypted' => true,

    /*
    |--------------------------------------------------------------------------
    | Connection Settings
    |--------------------------------------------------------------------------
    |
    | Configure connection timeouts and retry settings.
    |
    */

    'activityTimeout' => 120000,
    'pongTimeout' => 30000,
    'unavailableTimeout' => 10000,

    /*
    |--------------------------------------------------------------------------
    | Scaling Configuration
    |--------------------------------------------------------------------------
    |
    | Configure Redis scaling for multiple Reverb instances.
    |
    */

    'scaling' => [
        'enabled' => env('REVERB_SCALING_ENABLED', false),
        'driver' => env('REVERB_SCALING_DRIVER', 'redis'),
        'redis' => [
            'host' => env('REDIS_HOST', '127.0.0.1'),
            'port' => env('REDIS_PORT', 6379),
            'password' => env('REDIS_PASSWORD', null),
            'database' => env('REDIS_DB', 0),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration
    |--------------------------------------------------------------------------
    |
    | Configure CORS settings for WebSocket connections.
    |
    */

    'cors' => [
        'allowed_origins' => [
            'http://localhost:3000',
            'https://localhost:3000',
            'http://127.0.0.1:3000',
            'https://127.0.0.1:3000',
            'https://*.lionsoftware.cloud',
        ],
        'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        'allowed_headers' => ['*'],
        'exposed_headers' => [],
        'max_age' => 86400,
        'supports_credentials' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Authentication Configuration
    |--------------------------------------------------------------------------
    |
    | Configure authentication settings for private channels.
    |
    */

    'auth' => [
        'endpoint' => '/api/broadcasting/auth',
        'middleware' => ['auth:sanctum'],
        'headers' => [
            'Authorization',
            'Accept',
            'Content-Type',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Logging Configuration
    |--------------------------------------------------------------------------
    |
    | Configure logging settings for the Reverb server.
    |
    */

    'logging' => [
        'enabled' => env('REVERB_LOGGING_ENABLED', true),
        'level' => env('REVERB_LOGGING_LEVEL', 'info'),
        'channel' => env('REVERB_LOGGING_CHANNEL', 'stack'),
    ],

];

