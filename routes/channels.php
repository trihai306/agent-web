<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Device;
use App\Models\User;

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

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('user.{userId}.datatable.{tableId}', function ($user, $userId, $tableId) {
    // Ensure the authenticated user can only listen to their own channel
    return (int) $user->id === (int) $userId;
});

/*
|--------------------------------------------------------------------------
| Device Channels
|--------------------------------------------------------------------------
*/

// Channel cho device cụ thể - chấp nhận cả device.id (số) và device_id (chuỗi)
Broadcast::channel('device.{identifier}', function ($user, $identifier) {
    // Tìm device theo device_id trước, nếu không có thì tìm theo id
    $device = Device::where('device_id', $identifier)->first();

    // Không tìm thấy thiết bị
    if (!$device) {
        return false;
    }
    return $user->id === $device->user_id;
});

/*
|--------------------------------------------------------------------------
| Admin Channels
|--------------------------------------------------------------------------
*/


// Channel cho admin theo dõi thống kê realtime
Broadcast::channel('admin.dashboard', function ($user) {
    return $user->hasRole('admin') || $user->hasRole('super-admin') ? [
        'id' => $user->id,
        'name' => $user->name,
        'role' => $user->getRoleNames()->first(),
    ] : false;
});

/*
|--------------------------------------------------------------------------
| Notification Channels
|--------------------------------------------------------------------------
*/

// Channel cho thông báo realtime
Broadcast::channel('notifications.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

// Channel cho thông báo hệ thống
Broadcast::channel('system.notifications', function ($user) {
    return true; // Tất cả user đã xác thực đều có thể nhận thông báo hệ thống
});

/*
|--------------------------------------------------------------------------
| TikTok Account Management Channels
|--------------------------------------------------------------------------
*/

// Public channel cho TikTok account table reload events
Broadcast::channel('tiktok-accounts', function () {
    return true; // Public channel - không cần authentication
});