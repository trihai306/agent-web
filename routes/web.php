<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

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

// Fallback for unknown routes
// In local/dev, redirect to Next.js dev server so browsing via Laravel host still works
Route::fallback(function (Request $request) {
    if (app()->environment('local')) {
        $target = 'http://127.0.0.1:3000' . $request->getRequestUri();
        return redirect()->away($target);
    }

    return response()->json([
        'error' => 'Route not found',
        'message' => 'This Laravel instance only handles API routes. Please check your Next.js application for frontend routes.',
        'api_base' => url('/api')
    ], 404);
});