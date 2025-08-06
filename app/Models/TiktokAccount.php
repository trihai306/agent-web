<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TiktokAccount extends Model
{
    use HasFactory;

    protected $table = 'tiktok_accounts';

    protected $fillable = [
        'user_id',
        'username',
        'password',
        'nickname',
        'avatar_url',
        'follower_count',
        'following_count',
        'heart_count',
        'video_count',
        'bio_signature',
        'status',
        'proxy_id',
        'last_login_at',
        'last_activity_at',
    ];

    protected $casts = [
        'last_login_at' => 'datetime',
        'last_activity_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function proxy()
    {
        return $this->belongsTo(Proxy::class);
    }
}
