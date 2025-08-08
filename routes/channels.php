<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Public channel for general notifications
Broadcast::channel('notifications', function () {
    return true;
});

// Private channel for user-specific notifications
Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Channel for real-time updates on specific resources
Broadcast::channel('tiktok-accounts.{accountId}', function ($user, $accountId) {
    // Check if user has permission to view this account
    return $user->can('view', \App\Models\TiktokAccount::find($accountId));
});

// Channel for transaction updates
Broadcast::channel('transactions.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Channel for device status updates
Broadcast::channel('devices.{deviceId}', function ($user, $deviceId) {
    // Check if user has permission to view this device
    return $user->can('view', \App\Models\Device::find($deviceId));
});

// Channel for account task updates
Broadcast::channel('account-tasks.{taskId}', function ($user, $taskId) {
    // Check if user has permission to view this task
    return $user->can('view', \App\Models\AccountTask::find($taskId));
});

