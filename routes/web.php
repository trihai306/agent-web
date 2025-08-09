<?php

use Illuminate\Support\Facades\Route;

// Only handle Laravel-specific routes
// Let Next.js handle all frontend routes

// Health check for Laravel
Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'Laravel API',
        'timestamp' => now()->toISOString()
    ]);
});

// Fallback for unknown routes - redirect to Next.js
Route::fallback(function () {
    return response()->json([
        'error' => 'Route not found',
        'message' => 'This Laravel instance only handles API routes. Please check your Next.js application for frontend routes.',
        'api_base' => url('/api')
    ], 404);
});