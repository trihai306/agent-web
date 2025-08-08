<?php

namespace App\Events;

use App\Models\TiktokAccount;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TiktokAccountUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $tiktokAccount;
    public $changes;

    /**
     * Create a new event instance.
     */
    public function __construct(TiktokAccount $tiktokAccount, array $changes = [])
    {
        $this->tiktokAccount = $tiktokAccount;
        $this->changes = $changes;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('tiktok-accounts.' . $this->tiktokAccount->id),
            new Channel('notifications'), // Also broadcast to general notifications
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'tiktok-account.updated';
    }

    /**
     * Get the data to broadcast.
     */
    public function broadcastWith(): array
    {
        return [
            'account' => [
                'id' => $this->tiktokAccount->id,
                'username' => $this->tiktokAccount->username,
                'status' => $this->tiktokAccount->status,
                'followers_count' => $this->tiktokAccount->followers_count,
                'updated_at' => $this->tiktokAccount->updated_at->toISOString(),
            ],
            'changes' => $this->changes,
            'timestamp' => now()->toISOString(),
        ];
    }
}

