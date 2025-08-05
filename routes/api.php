<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AISpendingHistoryController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TransactionAnalyticController;

// Auth routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);


// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'getProfile']);
    Route::post('/profile/settings', [ProfileController::class, 'update']);
    Route::post('/profile/change-password', [ProfileController::class, 'changePassword']);
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar']);

    // Transaction routes (User)
    Route::post('/deposit', [TransactionController::class, 'deposit']);
    Route::post('/withdrawal', [TransactionController::class, 'withdrawal']);
    Route::get('/my-transactions', [TransactionController::class, 'getUserHistory']);

    // Transaction routes (Admin)
    Route::apiResource('transactions', TransactionController::class)->except(['store', 'update']);
    Route::post('transactions/bulk-delete', [TransactionController::class, 'bulkDelete']);

    // Notification routes (User)
    Route::get('/my-notifications', [NotificationController::class, 'getUserNotifications']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);

    // Notification routes (Admin)
    Route::apiResource('notifications', NotificationController::class)->except(['store', 'update']);
    Route::post('notifications/bulk-delete', [NotificationController::class, 'bulkDelete']);

    // AI Spending History routes
    Route::post('/ai-spending-history', [AISpendingHistoryController::class, 'recordUsage']);
    Route::get('/ai-spending-history', [AISpendingHistoryController::class, 'getUserHistory']);
    Route::get('/ai-spending-history/feature', [AISpendingHistoryController::class, 'getFeatureHistory']);
    Route::get('/ai-spending-history/model', [AISpendingHistoryController::class, 'getModelHistory']);
    
    // Roles, Permissions, and User Management
    Route::apiResource('roles', RoleController::class);
    Route::post('roles/bulk-delete', [RoleController::class, 'bulkDelete']);
    Route::apiResource('permissions', PermissionController::class);
    Route::post('permissions/bulk-delete', [PermissionController::class, 'bulkDelete']);
    Route::apiResource('users', UserController::class);
    Route::post('users/{user}/assign-role', [UserController::class, 'assignRole']);
    Route::post('users/bulk-delete', [UserController::class, 'bulkDelete']);
    Route::post('users/bulk-update-status', [UserController::class, 'bulkUpdateStatus']);
    
    // Analytics
    Route::get('/analytic/transactions', TransactionAnalyticController::class);
});
