<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TiktokAccountTableReload implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @var string|null
     */
    public ?string $message;

    /**
     * Tạo một instance mới của sự kiện.
     */
    public function __construct(?string $message = null)
    {
        $this->message = $message ?? 'TikTok account data has been updated';
    }

    /**
     * Tên event broadcast
     */
    public function broadcastAs(): string
    {
        return 'tiktok-accounts.reload';
    }

    /**
     * Channel mà event sẽ broadcast tới
     */
    public function broadcastOn(): Channel
    {
        // Public channel cho tất cả users quản lý TikTok accounts
        return new Channel('tiktok-accounts');
    }

    /**
     * Payload gửi đi kèm event
     */
    public function broadcastWith(): array
    {
        return [
            'message' => $this->message,
            'timestamp' => now()->format('Y-m-d H:i:s'),
        ];
    }
}
